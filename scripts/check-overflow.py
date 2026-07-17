from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto("http://localhost:3000/work")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)

    # Find all elements wider than viewport
    overflowing = page.evaluate("""() => {
        const results = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > 375 || rect.left < 0) {
                results.push({
                    tag: el.tagName,
                    class: el.className?.substring?.(0, 120) || '',
                    width: Math.round(rect.width),
                    right: Math.round(rect.right),
                    left: Math.round(rect.left),
                    text: el.textContent?.substring(0, 50) || '',
                });
            }
        }
        return results;
    }""")

    print("=== OVERFLOWING ELEMENTS ===")
    for el in overflowing:
        print(f"{el['tag']}.{el['class'][:60]}  w={el['width']} right={el['right']} left={el['left']}")

    browser.close()
