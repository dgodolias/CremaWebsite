import { expect, test } from '@playwright/test'

test('homepage renders the Crema experience without layout overflow', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('#hero-title')).toHaveAccessibleName(/Crema/i)
  await expect(page.locator('.hero-kickers')).toHaveCount(0)
  await expect(page.locator('.hero-brand-line')).toHaveCount(0)
  await expect(page.locator('.hero-support-line')).toHaveCount(2)
  await expect(page.locator('.hero-title-logo')).toBeVisible()
  await expect(page.locator('.hero-title-logo')).toHaveAttribute('src', /crema-logo-optimized\.webp/)

  const heroHierarchy = await page.locator('#hero-title').evaluate((title) => {
    const logo = title.querySelector<HTMLImageElement>('.hero-title-logo')
    const support = title.querySelector<HTMLElement>('.hero-support-line')
    const logoBox = logo?.getBoundingClientRect()

    return {
      logoHeight: logoBox?.height ?? 0,
      logoNaturalWidth: logo?.naturalWidth ?? 0,
      logoWidth: logoBox?.width ?? 0,
      support: support ? Number.parseFloat(getComputedStyle(support).fontSize) : 0,
    }
  })
  expect(heroHierarchy.logoNaturalWidth).toBeGreaterThan(0)
  expect(heroHierarchy.logoWidth / heroHierarchy.support).toBeGreaterThan(6)

  const supportingDisplayScale = await page.evaluate(() => {
    const readFontSize = (selector: string) => {
      const element = document.querySelector(selector)
      return element ? Number.parseFloat(getComputedStyle(element).fontSize) : 0
    }

    return {
      delivery: readFontSize('.delivery-panel span'),
      marquee: readFontSize('.marquee-group span'),
      provio: readFontSize('.provio-copy h2'),
      sectionTitle: readFontSize('.section-copy h2'),
      storyStatement: readFontSize('.story-visual span'),
    }
  })
  expect(Math.max(
    supportingDisplayScale.delivery,
    supportingDisplayScale.provio,
    supportingDisplayScale.sectionTitle,
    supportingDisplayScale.storyStatement,
  )).toBeLessThan(heroHierarchy.logoHeight)
  expect(supportingDisplayScale.marquee).toBeLessThan(heroHierarchy.support)
  await expect(page.locator('#google_translate_element')).toHaveCount(1)
  await expect(page.locator('.hero-media')).toBeVisible()
  await expect(page.locator('.hero-poster')).toHaveAttribute('src', /crema-scroll-cover\.avif/)
  await expect(page.locator('.hero-video')).toHaveCount(0)
  await expect(page.locator('.hero-sequence-canvas')).toHaveCount(0)
  await expect(page.locator('.since-scroll-mark')).toHaveText(/Since\s*2009/i)
  await expect(page.getByRole('link', { name: 'Crema menu' })).toHaveAttribute(
    'href',
    'https://www.e-food.gr/delivery/menu/crema',
  )
  await expect(page.locator('.order-trigger')).toBeVisible()
  await expect(page.locator('.delivery-chip')).toContainText('63')
  await expect(page.locator('.location-iframe')).toHaveAttribute('src', /google\.com\/maps\/embed/)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('featured menu reflects the requested brands and categories', async ({ page }) => {
  await page.goto('./')

  const site = page.locator('.site-shell')
  await expect(site).toContainText('Dimello')
  await expect(site).toContainText('Χειροποίητες μπάρες')
  await expect(site).toContainText('Αραβικές πίτες')
  await expect(site).toContainText('Club Sandwich XL')
  await expect(site).toContainText(/παγωτό Provio/i)
  const expandedMenu = page.locator('.products-section')
  await expect(expandedMenu).toContainText('My Waffle')
  await expect(expandedMenu).toContainText("Σαλάτα Caesar's")
  await expect(expandedMenu).toContainText('Banoffee')
  await expect(expandedMenu).toContainText('Φρουτοσαλάτα')
  await expect(page.locator('.product-card').first().locator('img')).toHaveAttribute('src', /crema-waffle-wolt\.avif/)
  await expect(page.locator('.provio-spotlight')).toContainText('Μάρκα που στηρίζουμε')
  await expect(page.locator('.provio-logo')).toHaveAttribute('src', /provio-logo-reference\.png/)
  await expect(page.locator('.provio-product')).toHaveAttribute('src', /provio-amarena-wolt\.avif/)

  const displayedProductSources = await page
    .locator('.signature-card img, .product-card img, .provio-product, .gallery-tile img')
    .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).src))
  expect(displayedProductSources).toHaveLength(16)
  expect(new Set(displayedProductSources).size).toBe(displayedProductSources.length)

  const clippedProductCards = await page.locator('.product-card').evaluateAll((cards) =>
    cards.filter((card) => {
      const cardBox = card.getBoundingClientRect()
      const ctaBox = card.querySelector('a')?.getBoundingClientRect()
      return card.scrollHeight > card.clientHeight + 1 || Boolean(ctaBox && ctaBox.bottom > cardBox.bottom + 1)
    }).length,
  )
  expect(clippedProductCards).toBe(0)
  await expect(site).not.toContainText(/Illy|σφολιάτ|croissant|pastry/i)
})

test('key sections stay reachable on mobile', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('.topbar .icon-action[href^="tel:"]')).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  await expect(page.locator('.site-footer')).toContainText('63')
  await expect(page.locator('.site-footer')).toContainText('delivery')
})

test('language selector opens a custom menu without native browser chrome', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('.language-picker select')).toHaveCount(0)

  const trigger = page.locator('.language-trigger')
  await trigger.click()

  const panel = page.locator('.language-panel')
  await expect(panel).toBeVisible()
  await expect(panel.locator('.language-option')).toHaveCount(16)
  await expect(panel.locator('.language-option[data-language="el"]')).toHaveAttribute('aria-selected', 'true')

  await expect(panel.locator('.language-code')).toHaveText([
    'GR',
    'EN',
    'DE',
    'FR',
    'IT',
    'ES',
    'RU',
    'ZH',
    'AR',
    'TR',
    'BG',
    'RO',
    'UA',
    'PL',
    'NL',
    'PT',
  ])
  await expect(panel.locator('.language-panel-status')).toHaveCount(0)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('order dropdown exposes e-food, BOX and Wolt with keyboard dismissal', async ({ page }) => {
  await page.goto('./')

  const trigger = page.locator('.order-trigger')
  await trigger.click()

  const panel = page.locator('.order-panel')
  await expect(panel).toBeVisible()
  await expect(panel.locator('.order-option')).toHaveCount(3)
  await expect(panel.locator('.order-platform-logo')).toHaveCount(3)
  await expect(panel.locator('[data-platform="efood"]')).toHaveAttribute('href', 'https://www.e-food.gr/delivery/menu/crema')
  await expect(panel.locator('[data-platform="box"]')).toHaveAttribute('href', 'https://box.gr/delivery/gkazi/crema-gkazi')
  await expect(panel.locator('[data-platform="wolt"]')).toHaveAttribute('href', 'https://wolt.com/el/grc/athens/restaurant/crema')
  await expect(panel.locator('[data-platform="efood"] .order-platform-logo')).toHaveAttribute('src', /efood-logo-official\.svg/)
  await expect(panel.locator('[data-platform="box"] .order-platform-logo')).toHaveAttribute('src', /box-logo-official\.svg/)
  await expect(panel.locator('[data-platform="wolt"] .order-platform-logo')).toHaveAttribute('src', /wolt-logo-official\.png/)
  expect(
    await panel.locator('.order-platform-logo').evaluateAll((logos) => logos.every((logo) => (logo as HTMLImageElement).naturalWidth > 0)),
  ).toBe(true)

  await page.keyboard.press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('language selector lets Google translate the label while preserving language names', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('.language-picker')).not.toHaveAttribute('translate', 'no')
  await expect(page.locator('.language-kicker')).toHaveText('Γλώσσα')
  await expect(page.locator('.language-current')).toHaveAttribute('translate', 'no')
  await expect(page.locator('.language-panel')).toHaveCount(0)

  await page.locator('.language-trigger').click()
  await expect(page.locator('.language-panel')).toHaveAttribute('translate', 'no')
  await expect(page.locator('.translation-status')).toHaveCount(0)
})

test('desktop uses the native pointer without a continuous cursor animation', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('.custom-cursor')).toHaveCount(0)
  await expect(page.locator('body')).not.toHaveClass(/has-custom-cursor/)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('crepe hero zooms and blurs before reversing through the third black section', async ({ page }) => {
  await page.goto('./')

  const heroImage = page.locator('.hero-poster')
  const sinceMark = page.locator('.since-scroll-mark')

  await expect.poll(() => sinceMark.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.95)
  await expect.poll(() => heroImage.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a)).toBeLessThan(1.04)

  await page.evaluate(() => window.scrollTo(0, window.innerHeight))
  await expect.poll(() => sinceMark.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeLessThan(0.05)

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(() => sinceMark.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThan(0.95)

  const signatureTop = await page.locator('.signature-section').evaluate((element) => {
    const rect = element.getBoundingClientRect()
    return rect.top + window.scrollY
  })

  await page.evaluate((top) => window.scrollTo(0, Math.max(top - window.innerHeight, 0)), signatureTop)
  await expect.poll(() => heroImage.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a)).toBeGreaterThan(1.08)
  await expect.poll(() => heroImage.evaluate((element) => {
    const match = getComputedStyle(element).filter.match(/blur\(([-\d.]+)px\)/)
    return match ? Number.parseFloat(match[1]) : 0
  })).toBeGreaterThan(2)

  await page.evaluate((top) => window.scrollTo(0, top), signatureTop)
  await expect.poll(() => heroImage.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a)).toBeLessThan(1.04)
  await expect.poll(() => heroImage.evaluate((element) => {
    const match = getComputedStyle(element).filter.match(/blur\(([-\d.]+)px\)/)
    return match ? Number.parseFloat(match[1]) : 0
  })).toBeLessThan(0.2)

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  const resources = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((entry) => entry.name),
  )

  expect(resources.some((url) => /crema-hero-crepe\.mp4|hero-sequence|frame-\d+\.webp/.test(url))).toBe(false)
  expect(resources.some((url) => url.includes('translate.google.com/translate_a/element.js'))).toBe(false)
})
