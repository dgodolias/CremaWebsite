import { expect, test } from '@playwright/test'

test('homepage renders the Crema experience without layout overflow', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('#hero-title')).toHaveAccessibleName(/Crema/i)
  await expect(page.locator('.hero-kickers')).toHaveCount(0)
  await expect(page.locator('.hero-brand-line')).toHaveCount(0)
  await expect(page.locator('.hero-support-line')).toHaveCount(0)
  await expect(page.locator('.hero-title-logo')).toBeVisible()
  await expect(page.locator('.hero-title-logo')).toHaveAttribute('src', /crema-hero-logo-coffee-crepes-pastry-shop\.png/)
  await expect(page.locator('.hero-heritage-line')).toHaveAttribute('src', /crema-hero-athens-since-2009\.png/)
  await expect(page.locator('.hero-dessert-quote')).toHaveAccessibleName('LIFE IS UNCERTAIN. EAT DESSERT FIRST.')

  const heroHierarchy = await page.locator('#hero-title').evaluate((title) => {
    const logo = title.querySelector<HTMLImageElement>('.hero-title-logo')
    const logoBox = logo?.getBoundingClientRect()

    return {
      logoHeight: logoBox?.height ?? 0,
      logoNaturalHeight: logo?.naturalHeight ?? 0,
      logoNaturalWidth: logo?.naturalWidth ?? 0,
      logoWidth: logoBox?.width ?? 0,
    }
  })
  expect(heroHierarchy.logoNaturalWidth).toBe(1473)
  expect(heroHierarchy.logoNaturalHeight).toBe(1068)
  expect(heroHierarchy.logoWidth).toBeGreaterThan(200)
  expect(heroHierarchy.logoHeight).toBeGreaterThan(150)

  const supportingDisplayScale = await page.evaluate(() => {
    const readFontSize = (selector: string) => {
      const element = document.querySelector(selector)
      return element ? Number.parseFloat(getComputedStyle(element).fontSize) : 0
    }

    return {
      crepes: readFontSize('.crepe-explorer-heading h2'),
      delivery: readFontSize('.delivery-panel span'),
      marquee: readFontSize('.marquee-group span'),
      sectionTitle: readFontSize('.section-copy h2'),
      storyStatement: readFontSize('.story-visual span'),
    }
  })
  expect(Math.max(
    supportingDisplayScale.delivery,
    supportingDisplayScale.crepes,
    supportingDisplayScale.sectionTitle,
    supportingDisplayScale.storyStatement,
  )).toBeLessThan(120)
  expect(supportingDisplayScale.marquee).toBeLessThan(64)
  await expect(page.locator('#google_translate_element')).toHaveCount(1)
  await expect(page.locator('.hero-media')).toBeVisible()
  await expect(page.locator('.hero-poster')).toHaveAttribute('src', /crema-scroll-cover\.avif/)
  await expect(page.locator('.hero-video')).toHaveCount(0)
  await expect(page.locator('.hero-sequence-canvas')).toHaveCount(0)
  await expect(page.locator('.since-scroll-mark')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Crema menu' })).toHaveAttribute(
    'href',
    'https://www.e-food.gr/delivery/menu/crema',
  )
  await expect(page.locator('.order-trigger')).toBeVisible()
  await expect(page.locator('.delivery-chip')).toHaveText('Περσεφόνης 63, Γκάζι')
  await expect(page.locator('.location-iframe')).toHaveAttribute('src', /google\.com\/maps\/embed/)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('location closes the page with all five contact and ordering actions', async ({ page }) => {
  await page.goto('./')

  const actions = page.locator('.location-actions a')
  await expect(page).toHaveTitle(/^Crema Gazi 24\/7/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /^Ανοιχτά 24 ώρες, 7 ημέρες την εβδομάδα/,
  )
  await expect(page.locator('.delivery-section')).toHaveCount(0)
  await expect(page.locator('.location-hours')).toContainText('Ανοιχτά 24 ώρες')
  await expect(page.locator('.location-hours')).toContainText('7 ημέρες την εβδομάδα')
  await expect(page.getByText('Ανοιχτά 24 ώρες · 7 ημέρες την εβδομάδα', { exact: true })).toHaveCount(1)
  await expect(actions).toHaveCount(5)
  await expect(actions.nth(0)).toHaveAttribute('href', 'https://www.instagram.com/crema_gazi/')
  await expect(actions.nth(1)).toHaveAttribute('href', 'tel:+302103467213')
  await expect(actions.nth(2)).toHaveAttribute('href', 'https://wolt.com/el/grc/athens/restaurant/crema')
  await expect(actions.nth(3)).toHaveAttribute('href', 'https://www.e-food.gr/delivery/menu/crema')
  await expect(actions.nth(4)).toHaveAttribute('href', 'https://box.gr/delivery/gkazi/crema-gkazi')

  const titleSizes = await page.evaluate(() => ({
    location: Number.parseFloat(getComputedStyle(document.querySelector('.location-copy h2')!).fontSize),
    standard: Number.parseFloat(getComputedStyle(document.querySelector('.story-section .section-copy h2')!).fontSize),
  }))
  expect(titleSizes.location).toBeLessThan(titleSizes.standard)

  const businessSchema = await page.locator('script[type="application/ld+json"]').textContent()
  expect(businessSchema).not.toBeNull()
  const structuredData = JSON.parse(businessSchema ?? '{}') as {
    openingHours?: string
    openingHoursSpecification?: Array<{ closes?: string; dayOfWeek?: string[]; opens?: string }>
  }
  expect(structuredData.openingHours).toBe('Mo-Su 00:00-23:59')
  expect(structuredData.openingHoursSpecification?.[0]).toMatchObject({
    closes: '23:59',
    opens: '00:00',
  })
  expect(structuredData.openingHoursSpecification?.[0]?.dayOfWeek).toHaveLength(7)
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
  await expect(page.locator('.provio-spotlight')).toHaveCount(0)
  const fourthSignature = page.locator('.signature-card').nth(3)
  await expect(fourthSignature).toContainText('Παγωτό Provio')
  await expect(fourthSignature.locator('img')).toHaveAttribute('src', /provio-strawberry-chocolate-cup\.avif/)

  const displayedProductSources = await page
    .locator('.crepe-card > img, .signature-card img, .product-card img, .gallery-tile img')
    .evaluateAll((images) => images.map((image) => (image as HTMLImageElement).src))
  expect(displayedProductSources).toHaveLength(17)
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

test('crepe explorer follows the category band and reveals scrollable ingredients without prices', async ({ page }) => {
  await page.goto('./')

  const explorer = page.locator('.crepe-explorer')
  await expect(explorer).toContainText('Κρέπες με αγνά υλικά καθημερινά, μείγμα δικό μας και κάθε δημιουργία φτιαγμένη με αγάπη')
  await expect(explorer).toContainText('Αλμυρή κρέπα')
  await expect(explorer).toContainText('Γλυκιά κρέπα')
  await expect(explorer).not.toContainText('€')
  expect(await explorer.evaluate((element) => element.previousElementSibling?.classList.contains('marquee-band'))).toBe(true)

  const savoryCard = page.locator('.crepe-card--savory')
  const trigger = savoryCard.locator('.crepe-card-trigger')
  const canHover = await page.evaluate(() => window.matchMedia('(hover: hover)').matches)
  if (canHover) {
    await savoryCard.hover()
  } else {
    await trigger.tap()
  }
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(savoryCard.locator('.crepe-ingredients')).toContainText('Προσθέστε τυριά')
  expect(await savoryCard.locator('.crepe-ingredients-scroll').evaluate(
    (element) => element.scrollHeight > element.clientHeight,
  )).toBe(true)

  if (canHover) {
    await explorer.locator('.crepe-explorer-heading').hover()
  } else {
    await trigger.tap()
  }
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  await trigger.focus()
  await trigger.press('Enter')
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await trigger.press('Escape')
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')
})

test('key sections stay reachable on mobile', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('.topbar .icon-action[href^="tel:"]')).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  await expect(page.locator('.site-footer')).toContainText('63')
  await expect(page.locator('.site-footer')).toContainText('delivery')
  const footerInstagram = page.locator('.footer-instagram')
  await expect(footerInstagram).toHaveText('@crema_gazi')
  await expect(footerInstagram).toHaveAttribute('href', 'https://www.instagram.com/crema_gazi/')
  await expect(footerInstagram.locator('svg')).toBeVisible()
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

  await expect.poll(() => heroImage.evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).a)).toBeLessThan(1.04)

  await page.evaluate(() => window.scrollTo(0, window.innerHeight))

  await page.evaluate(() => window.scrollTo(0, 0))

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
