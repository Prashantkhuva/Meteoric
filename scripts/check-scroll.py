from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto("http://localhost:3000/work")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)

    scroll_width = page.evaluate("document.documentElement.scrollWidth")
    client_width = page.evaluate("document.documentElement.clientWidth")
    body_overflow = page.evaluate("getComputedStyle(document.body).overflowX")
    main_overflow = page.evaluate("document.querySelector('.min-h-screen') ? getComputedStyle(document.querySelector('.min-h-screen')).overflowX : 'N/A'")

    print(f"Scroll width: {scroll_width}, Client width: {client_width}")
    print(f"Body overflow-x: {body_overflow}")
    print(f"Main div overflow-x: {main_overflow}")
    print(f"Horizontal scroll exists: {scroll_width > client_width}")

    browser.close()
