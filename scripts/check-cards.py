from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto("http://localhost:3000/work")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(2000)

    # Check each card's image and text section dimensions
    cards = page.locator(".gsap-work-card").all()
    print(f"Total cards: {len(cards)}")
    for i, card in enumerate(cards):
        box = card.bounding_box()
        if box:
            print(f"Card {i}: w={box['width']:.0f} h={box['height']:.0f}")

    # Check the heading
    h1 = page.locator("h1")
    if h1.count():
        box = h1.bounding_box()
        if box:
            print(f"H1: w={box['width']:.0f} h={box['height']:.0f}")

    # Check page padding
    section = page.locator("section").first
    if section.count():
        box = section.bounding_box()
        if box:
            print(f"Section: x={box['x']:.0f} w={box['width']:.0f}")

    browser.close()
