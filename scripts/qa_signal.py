from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
SCREEN_DIR = ROOT / ".tmp"
SCREEN_DIR.mkdir(exist_ok=True)
URL = "http://127.0.0.1:5173/CremaWebsite/signal"


def inspect(page, name: str) -> dict:
    page.goto(URL)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1800)

    page.screenshot(path=SCREEN_DIR / f"signal-{name}.png", full_page=True)
    return page.evaluate(
        """() => ({
          title: document.title,
          h1: document.querySelector('h1')?.textContent?.trim(),
          sections: [...document.querySelectorAll('main section')].map((node) => node.id || node.className),
          width: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
          canvases: [...document.querySelectorAll('canvas')].map((node) => ({
            width: node.width,
            height: node.height,
            rect: node.getBoundingClientRect().toJSON(),
          })),
          images: [...document.images].map((image) => ({
            src: image.currentSrc,
            loaded: image.complete && image.naturalWidth > 0,
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
          })),
          navVisible: Boolean(document.querySelector('.signal-nav')),
          reducedMotion: document.querySelector('.signal-shell')?.dataset.reducedMotion,
          magicSource: document.querySelector('[data-source="21st-floating-paths"]')?.getAttribute('data-source'),
          recipeCount: document.querySelectorAll('.signal-recipe article').length,
          externalLinks: [...document.querySelectorAll('a[target="_blank"]')].length,
          unsafeExternalLinks: [...document.querySelectorAll('a[target="_blank"]')].filter(
            (link) => !link.relList.contains('noreferrer')
          ).length,
        })"""
    )


def animation_delta(page) -> dict:
    before = page.evaluate(
        """() => ({
          canvas: document.querySelector('canvas')?.toDataURL(),
          path: document.querySelector('[data-source="21st-floating-paths"] path')?.getAttribute('style'),
        })"""
    )
    page.wait_for_timeout(700)
    after = page.evaluate(
        """() => ({
          canvas: document.querySelector('canvas')?.toDataURL(),
          path: document.querySelector('[data-source="21st-floating-paths"] path')?.getAttribute('style'),
        })"""
    )
    return {
        "canvasChanged": before["canvas"] != after["canvas"],
        "pathChanged": before["path"] != after["path"],
    }


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    errors: list[str] = []

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    desktop.on("console", lambda message: errors.append(f"console:{message.type}:{message.text}") if message.type == "error" else None)
    desktop.on("pageerror", lambda error: errors.append(f"pageerror:{error}"))
    desktop_result = inspect(desktop, "desktop")
    desktop.keyboard.press("Tab")
    keyboard_result = desktop.evaluate(
        """() => {
          const active = document.activeElement
          const style = getComputedStyle(active)
          return {
            tag: active?.tagName,
            href: active?.getAttribute?.('href'),
            outlineStyle: style.outlineStyle,
            outlineWidth: style.outlineWidth,
          }
        }"""
    )

    mobile = browser.new_page(
        viewport={"width": 390, "height": 844},
        device_scale_factor=1,
        is_mobile=True,
        has_touch=True,
    )
    mobile.on("console", lambda message: errors.append(f"mobile-console:{message.type}:{message.text}") if message.type == "error" else None)
    mobile.on("pageerror", lambda error: errors.append(f"mobile-pageerror:{error}"))
    mobile_result = inspect(mobile, "mobile")

    reduced = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=1)
    reduced.emulate_media(reduced_motion="reduce")
    reduced.on("console", lambda message: errors.append(f"reduced-console:{message.type}:{message.text}") if message.type == "error" else None)
    reduced.on("pageerror", lambda error: errors.append(f"reduced-pageerror:{error}"))
    reduced_result = inspect(reduced, "reduced")
    reduced_animation = animation_delta(reduced)

    print({
        "desktop": desktop_result,
        "mobile": mobile_result,
        "reduced": reduced_result,
        "keyboard": keyboard_result,
        "reducedAnimation": reduced_animation,
        "errors": errors,
    })

    assert desktop_result["title"] == "Crema Signal — coffee, crepes & late-night Gazi"
    assert desktop_result["h1"] == "Sweet static.Fresh signal."
    assert desktop_result["scrollWidth"] - desktop_result["width"] <= 2
    assert mobile_result["scrollWidth"] - mobile_result["width"] <= 2
    assert desktop_result["recipeCount"] == 4
    assert mobile_result["recipeCount"] == 4
    assert desktop_result["unsafeExternalLinks"] == 0
    assert mobile_result["unsafeExternalLinks"] == 0
    assert keyboard_result["tag"] == "A"
    assert keyboard_result["href"] == "#signal-top"
    assert keyboard_result["outlineStyle"] != "none"
    assert keyboard_result["outlineWidth"] != "0px"
    assert reduced_result["reducedMotion"] == "true"
    assert not reduced_animation["canvasChanged"]
    assert not reduced_animation["pathChanged"]
    assert desktop_result["magicSource"] == "21st-floating-paths"
    assert mobile_result["magicSource"] == "21st-floating-paths"
    assert all(image["loaded"] for image in desktop_result["images"])
    assert all(image["loaded"] for image in mobile_result["images"])
    assert desktop_result["canvases"], "Expected the Lottie runtime to render a canvas"
    assert not errors, errors

    browser.close()
