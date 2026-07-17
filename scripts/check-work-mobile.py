from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 375, "height": 812})  # iPhone 13 size
    page.goto("http://localhost:3000/work")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)
    page.screenshot(path="D:/PROJECTS/Meteoric/scripts/work-mobile-top.png", full_page=False)
    page.screenshot(path="D:/PROJECTS/Meteoric/scripts/work-mobile-full.png", full_page=True)

    # Check for horizontal overflow
    scroll_width = page.evaluate("document.documentElement.scrollWidth")
    client_width = page.evaluate("document.documentElement.clientWidth")
    print(f"Scroll width: {scroll_width}, Client width: {client_width}, Overflow: {scroll_width > client_width}")

    # Check navbar dimensions
    header = page.locator("header")
    if header.count() > 0:
        box = header.bounding_box()
        if box:
            print(f"Header: x={box['x']}, width={box['width']}, right={box['x'] + box['width']}")

    browser.close()
