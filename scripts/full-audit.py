"""Full website audit: screenshots, console errors, load times, accessibility checks."""
import json, time, sys
from playwright.sync_api import sync_playwright

PAGES = [
    ("Home", "/"),
    ("About", "/about"),
    ("Work", "/work"),
    ("Services", "/services"),
    ("Case Studies", "/case-studies"),
    ("Privacy", "/privacy"),
    ("Terms", "/terms"),
    ("Login", "/login"),
    ("Sitemap", "/sitemap.xml"),
]

def run_audit():
    results = {"pages": [], "console_errors": [], "summary": {}}
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        for name, path in PAGES:
            print(f"\n{'='*60}")
            print(f"AUDITING: {name} ({path})")
            print(f"{'='*60}")
            
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            console_errors = []
            page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ("error", "warning") else None)
            page.on("pageerror", lambda err: console_errors.append(f"[PAGE_ERROR] {err}"))
            
            # Desktop screenshot
            start = time.time()
            try:
                resp = page.goto(f"http://localhost:3000{path}", wait_until="networkidle", timeout=30000)
                load_time = round(time.time() - start, 2)
                status = resp.status if resp else "N/A"
            except Exception as e:
                load_time = -1
                status = f"ERROR: {e}"
            
            page.wait_for_timeout(2000)  # Let animations settle
            
            # Desktop screenshot
            page.screenshot(path=f"D:/PROJECTS/Meteoric/scripts/screenshots/{name.lower().replace(' ', '-')}-desktop.png", full_page=True)
            
            # Mobile screenshot
            page.set_viewport_size({"width": 375, "height": 812})
            page.wait_for_timeout(500)
            page.screenshot(path=f"D:/PROJECTS/Meteoric/scripts/screenshots/{name.lower().replace(' ', '-')}-mobile.png", full_page=True)
            
            # Check images
            images = page.query_selector_all("img")
            images_without_alt = []
            images_without_dimensions = []
            for img in images:
                alt = img.get_attribute("alt")
                if not alt:
                    images_without_alt.append(img.get_attribute("src") or "unknown")
                w = img.get_attribute("width")
                h = img.get_attribute("height")
                if not w and not h:
                    src = img.get_attribute("src") or "unknown"
                    images_without_dimensions.append(src[:80])
            
            # Check links
            links = page.query_selector_all("a[href]")
            broken_links = []
            for link in links:
                href = link.get_attribute("href")
                if href and href.startswith("http") and "localhost" not in href:
                    # External link - skip check
                    pass
            
            # Accessibility quick checks
            a11y_issues = []
            # Check for aria-labels on buttons without text
            buttons = page.query_selector_all("button")
            for btn in buttons:
                text = btn.inner_text().strip()
                aria = btn.get_attribute("aria-label")
                if not text and not aria:
                    a11y_issues.append("Button without text or aria-label")
            
            # Check heading hierarchy
            headings = []
            for level in range(1, 7):
                for h in page.query_selector_all(f"h{level}"):
                    headings.append((level, h.inner_text().strip()[:50]))
            
            page_result = {
                "name": name,
                "path": path,
                "status": status,
                "load_time_s": load_time,
                "console_errors": console_errors,
                "images_total": len(images),
                "images_no_alt": images_without_alt,
                "images_no_dimensions": images_without_dimensions[:5],
                "buttons_total": len(buttons),
                "a11y_issues": a11y_issues[:10],
                "headings": headings[:10],
            }
            results["pages"].append(page_result)
            
            print(f"  Status: {status}")
            print(f"  Load time: {load_time}s")
            print(f"  Console errors/warnings: {len(console_errors)}")
            for e in console_errors[:5]:
                print(f"    {e}")
            print(f"  Images: {len(images)} total, {len(images_without_alt)} missing alt")
            if images_without_alt:
                for src in images_without_alt[:3]:
                    print(f"    Missing alt: {src}")
            print(f"  Images without dimensions: {len(images_without_dimensions)}")
            print(f"  Accessibility issues: {len(a11y_issues)}")
            print(f"  Heading structure: {headings[:5]}")
            
            page.close()
        
        # Mobile nav check
        print(f"\n{'='*60}")
        print("MOBILE NAV TEST")
        print(f"{'='*60}")
        page = browser.new_page(viewport={"width": 375, "height": 812})
        page.goto("http://localhost:3000/", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)
        
        # Try to find and click hamburger menu
        hamburger = page.query_selector("[aria-label*='menu'], [aria-label*='Menu'], button:has(svg)")
        if hamburger:
            hamburger.click()
            page.wait_for_timeout(500)
            page.screenshot(path="D:/PROJECTS/Meteoric/scripts/screenshots/mobile-nav-open.png")
            print("  Mobile nav opened successfully")
        else:
            print("  No hamburger menu found")
        
        # Check font loading
        print(f"\n{'='*60}")
        print("FONT LOADING CHECK")
        print(f"{'='*60}")
        page.goto("http://localhost:3000/", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(3000)
        fonts_loaded = page.evaluate("() => document.fonts.status")
        fonts_count = page.evaluate("() => document.fonts.size")
        print(f"  Font status: {fonts_loaded}")
        print(f"  Fonts loaded: {fonts_count}")
        
        # Performance metrics
        print(f"\n{'='*60}")
        print("PERFORMANCE METRICS (Home page)")
        print(f"{'='*60}")
        metrics = page.evaluate("""() => {
            const perf = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            const resources = performance.getEntriesByType('resource');
            
            let totalTransferSize = 0;
            let resourceCount = resources.length;
            let largestResources = resources
                .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
                .slice(0, 10)
                .map(r => ({
                    name: r.name.split('/').pop().split('?')[0].substring(0, 50),
                    type: r.initiatorType,
                    size_kb: Math.round((r.transferSize || 0) / 1024),
                    duration_ms: Math.round(r.duration)
                }));
            
            resources.forEach(r => totalTransferSize += r.transferSize || 0);
            
            return {
                ttfb: Math.round(perf.responseStart - perf.requestStart),
                domContentLoaded: Math.round(perf.domContentLoadedEventEnd - perf.fetchStart),
                loadComplete: Math.round(perf.loadEventEnd - perf.fetchStart),
                domInteractive: Math.round(perf.domInteractive - perf.fetchStart),
                transferSizeKB: Math.round(totalTransferSize / 1024),
                resourceCount,
                largestResources,
                fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            };
        }""")
        
        print(f"  TTFB: {metrics['ttfb']}ms")
        print(f"  FCP: {round(metrics['fcp'])}ms")
        print(f"  DOM Interactive: {metrics['domInteractive']}ms")
        print(f"  DOM Content Loaded: {metrics['domContentLoaded']}ms")
        print(f"  Load Complete: {metrics['loadComplete']}ms")
        print(f"  Total Transfer Size: {metrics['transferSizeKB']}KB")
        print(f"  Total Resources: {metrics['resourceCount']}")
        print(f"\n  Top 10 largest resources:")
        for r in metrics['largestResources']:
            print(f"    [{r['type']}] {r['name']}: {r['size_kb']}KB ({r['duration_ms']}ms)")
        
        results["performance"] = metrics
        browser.close()
    
    # Write full report
    with open("D:/PROJECTS/Meteoric/scripts/audit-report.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n{'='*60}")
    print("AUDIT COMPLETE — Full report saved to scripts/audit-report.json")
    print(f"{'='*60}")

if __name__ == "__main__":
    import os
    os.makedirs("D:/PROJECTS/Meteoric/scripts/screenshots", exist_ok=True)
    run_audit()
