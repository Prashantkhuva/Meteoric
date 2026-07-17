from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto("http://localhost:3000/work")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)

    # Check navbar structure
    header = page.locator("header").first
    header_box = header.bounding_box()
    print(f"Header: x={header_box['x']}, w={header_box['width']}, right={header_box['x'] + header_box['width']}")

    # Check inner container
    inner = header.locator("> div").first
    inner_box = inner.bounding_box()
    print(f"Inner div: x={inner_box['x']}, w={inner_box['width']}, right={inner_box['x'] + inner_box['width']}")

    # Check hamburger
    hamburger = page.locator("button[aria-label*='navigation']")
    if hamburger.count():
        hb = hamburger.bounding_box()
        print(f"Hamburger: x={hb['x']}, w={hb['width']}, right={hb['x'] + hb['width']}")

    # Check logo
    logo = header.locator("a").first
    if logo.count():
        lb = logo.bounding_box()
        print(f"Logo: x={lb['x']}, w={lb['width']}, right={lb['x'] + lb['width']}")

    # Final scroll check
    sw = page.evaluate("document.documentElement.scrollWidth")
    cw = page.evaluate("document.documentElement.clientWidth")
    print(f"Scroll: {sw}, Client: {cw}, Overflow: {sw > cw}")

    page.screenshot(path="D:/PROJECTS/Meteoric/scripts/work-mobile-final.png", full_page=False)
    browser.close()
