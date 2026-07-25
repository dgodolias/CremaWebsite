import os
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
SCREEN_DIR = ROOT / ".tmp"
SCREEN_DIR.mkdir(exist_ok=True)
URL = os.environ.get(
    "SIGNAL_BASE_URL",
    "http://127.0.0.1:5173/CremaWebsite/signal",
)


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
            lazy: image.getAttribute('loading') === 'lazy',
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
          })),
          navVisible: Boolean(document.querySelector('.signal-nav')),
          reducedMotion: document.querySelector('.signal-shell')?.dataset.reducedMotion,
          magicSource: document.querySelector('[data-source="crema-procedural-paths"]')?.getAttribute('data-source'),
          storyFrame: Number(document.querySelector('.signal-story-canvas')?.getAttribute('data-frame') || 0),
          storyRenderedFrame: Number(document.querySelector('.signal-story-canvas')?.getAttribute('data-rendered-frame') || 0),
          storyChapterCount: document.querySelectorAll('.signal-story-chapter').length,
          activeStoryChapters: document.querySelectorAll('.signal-story-chapter[data-active="true"]').length,
          paletteButtonCount: document.querySelectorAll('.signal-palette-controls button').length,
          activePalette: document.querySelector('.signal-palette-controls button[aria-pressed="true"]')?.textContent?.trim(),
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
          path: document.querySelector('[data-source="crema-procedural-paths"] path')?.getAttribute('style'),
        })"""
    )
    page.wait_for_timeout(700)
    after = page.evaluate(
        """() => ({
          canvas: document.querySelector('canvas')?.toDataURL(),
          path: document.querySelector('[data-source="crema-procedural-paths"] path')?.getAttribute('style'),
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
    story_top = desktop.locator("#story").evaluate("(node) => node.getBoundingClientRect().top + window.scrollY")
    desktop.evaluate(
        "(top) => window.scrollTo({ top: top + window.innerHeight * 1.7, behavior: 'instant' })",
        story_top,
    )
    desktop.wait_for_timeout(1400)
    desktop.screenshot(path=SCREEN_DIR / "signal-story-desktop.png")
    story_result = desktop.evaluate(
        """() => ({
          frame: Number(document.querySelector('.signal-story-canvas')?.getAttribute('data-frame') || 0),
          renderedFrame: Number(document.querySelector('.signal-story-canvas')?.getAttribute('data-rendered-frame') || 0),
          activeChapter: document.querySelector('.signal-story-sticky')?.getAttribute('data-chapter'),
          visibleChapters: document.querySelectorAll('.signal-story-chapter[data-active="true"]').length,
        })"""
    )
    desktop.get_by_role("button", name="Berry afterimage").click()
    desktop.wait_for_function(
        """() => {
          const image = document.querySelector('.signal-palette-card img')
          return image?.getAttribute('alt') === 'Close crop of espresso and chocolate crepe with berries'
            && image.complete
            && image.naturalWidth > 0
        }"""
    )
    desktop.wait_for_timeout(600)
    desktop.locator("#colorways").screenshot(path=SCREEN_DIR / "signal-palette-desktop.png")
    palette_result = desktop.evaluate(
        """() => ({
          pressed: document.querySelector('.signal-palette-controls button[aria-pressed="true"]')?.textContent?.trim(),
          readout: document.querySelector('.signal-palette-readout strong')?.textContent?.trim(),
          imageAlt: document.querySelector('.signal-palette-card img')?.getAttribute('alt'),
        })"""
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
    mobile_story_top = mobile.locator("#story").evaluate("(node) => node.getBoundingClientRect().top + window.scrollY")
    mobile.evaluate(
        "(top) => window.scrollTo({ top: top + window.innerHeight * 1.45, behavior: 'instant' })",
        mobile_story_top,
    )
    mobile.wait_for_timeout(1300)
    mobile.screenshot(path=SCREEN_DIR / "signal-story-mobile.png")
    mobile_story_result = mobile.evaluate(
        """() => ({
          frame: Number(document.querySelector('.signal-story-canvas')?.getAttribute('data-frame') || 0),
          renderedFrame: Number(document.querySelector('.signal-story-canvas')?.getAttribute('data-rendered-frame') || 0),
          visibleChapters: document.querySelectorAll('.signal-story-chapter[data-active="true"]').length,
        })"""
    )
    mobile.get_by_role("button", name="Espresso metal").click()
    mobile.wait_for_function(
        """() => {
          const image = document.querySelector('.signal-palette-card img')
          return image?.getAttribute('alt') === 'Cinematic espresso, crepe and pastry arrangement'
            && image.complete
            && image.naturalWidth > 0
        }"""
    )
    mobile.wait_for_timeout(600)
    mobile.locator("#colorways").screenshot(path=SCREEN_DIR / "signal-palette-mobile.png")
    mobile_palette_result = mobile.evaluate(
        """() => ({
          pressed: document.querySelector('.signal-palette-controls button[aria-pressed="true"]')?.textContent?.trim(),
          readout: document.querySelector('.signal-palette-readout strong')?.textContent?.trim(),
          tiltX: getComputedStyle(document.querySelector('.signal-palette-stage')).getPropertyValue('--lab-tilt-x').trim(),
          tiltY: getComputedStyle(document.querySelector('.signal-palette-stage')).getPropertyValue('--lab-tilt-y').trim(),
        })"""
    )

    tablet = browser.new_page(viewport={"width": 834, "height": 1112}, device_scale_factor=1)
    tablet.on("console", lambda message: errors.append(f"tablet-console:{message.type}:{message.text}") if message.type == "error" else None)
    tablet.on("pageerror", lambda error: errors.append(f"tablet-pageerror:{error}"))
    tablet_result = inspect(tablet, "tablet")

    reduced = browser.new_page(viewport={"width": 1280, "height": 900}, device_scale_factor=1)
    reduced.emulate_media(reduced_motion="reduce")
    reduced.on("console", lambda message: errors.append(f"reduced-console:{message.type}:{message.text}") if message.type == "error" else None)
    reduced.on("pageerror", lambda error: errors.append(f"reduced-pageerror:{error}"))
    reduced_result = inspect(reduced, "reduced")
    reduced_animation = animation_delta(reduced)

    print({
        "desktop": desktop_result,
        "mobile": mobile_result,
        "tablet": tablet_result,
        "reduced": reduced_result,
        "keyboard": keyboard_result,
        "story": story_result,
        "palette": palette_result,
        "mobileStory": mobile_story_result,
        "mobilePalette": mobile_palette_result,
        "reducedAnimation": reduced_animation,
        "errors": errors,
    })

    assert desktop_result["title"] == "Crema Signal — coffee, crepes & late-night Gazi"
    assert desktop_result["h1"] == "Sweet static.Fresh signal."
    assert desktop_result["scrollWidth"] - desktop_result["width"] <= 2
    assert mobile_result["scrollWidth"] - mobile_result["width"] <= 2
    assert tablet_result["scrollWidth"] - tablet_result["width"] <= 2
    assert desktop_result["storyChapterCount"] == 4
    assert mobile_result["storyChapterCount"] == 4
    assert tablet_result["storyChapterCount"] == 4
    assert desktop_result["activeStoryChapters"] == 1
    assert mobile_result["activeStoryChapters"] == 1
    assert desktop_result["paletteButtonCount"] == 4
    assert mobile_result["paletteButtonCount"] == 4
    assert tablet_result["paletteButtonCount"] == 4
    assert desktop_result["recipeCount"] == 6
    assert mobile_result["recipeCount"] == 6
    assert tablet_result["recipeCount"] == 6
    assert desktop_result["unsafeExternalLinks"] == 0
    assert mobile_result["unsafeExternalLinks"] == 0
    assert keyboard_result["tag"] == "A"
    assert keyboard_result["href"] == "#signal-top"
    assert keyboard_result["outlineStyle"] != "none"
    assert keyboard_result["outlineWidth"] != "0px"
    assert reduced_result["reducedMotion"] == "true"
    assert reduced_result["storyChapterCount"] == 4
    assert reduced_result["paletteButtonCount"] == 4
    assert not reduced_animation["canvasChanged"]
    assert not reduced_animation["pathChanged"]
    assert story_result["frame"] > 20
    assert story_result["renderedFrame"] > 0
    assert story_result["visibleChapters"] == 1
    assert palette_result["pressed"].endswith("Berry afterimage")
    assert palette_result["readout"] == "Berry afterimage"
    assert palette_result["imageAlt"] == "Close crop of espresso and chocolate crepe with berries"
    assert mobile_story_result["frame"] > 20
    assert mobile_story_result["renderedFrame"] > 0
    assert mobile_story_result["visibleChapters"] == 1
    assert mobile_palette_result["pressed"].endswith("Espresso metal")
    assert mobile_palette_result["readout"] == "Espresso metal"
    assert mobile_palette_result["tiltX"] == "0deg"
    assert mobile_palette_result["tiltY"] == "0deg"
    assert desktop_result["magicSource"] == "crema-procedural-paths"
    assert mobile_result["magicSource"] == "crema-procedural-paths"
    assert all(image["loaded"] for image in desktop_result["images"] if not image["lazy"])
    assert all(image["loaded"] for image in mobile_result["images"] if not image["lazy"])
    assert all(image["loaded"] for image in tablet_result["images"] if not image["lazy"])
    assert desktop_result["canvases"], "Expected the Lottie runtime to render a canvas"
    assert not errors, errors

    browser.close()
