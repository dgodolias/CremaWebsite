import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route(/translate\.google\.com|google\.com\/maps\/embed/, (route) =>
    route.abort(),
  )
})

test('homepage renders the Crema Melt rebrand without layout overflow', async ({
  isMobile,
  page,
}) => {
  await page.goto('./')

  await expect(page.locator('h1')).toContainText('Crema')
  await expect(page.locator('h1')).toContainText('Melt')
  await expect(page.locator('#google_translate_element')).toHaveCount(1)
  await expect(page.locator('.melt-hero-shell')).toBeVisible()
  await expect(page.locator('.melt-hero-liquid')).toHaveAttribute(
    'data-renderer',
    /webgl|static/,
  )
  await expect(page.locator('.melt-hero-poster-image')).toHaveAttribute(
    'src',
    /crema-scroll-cover\.avif/,
  )
  await expect(page.getByRole('link', { name: 'Crema menu' })).toHaveAttribute(
    'href',
    'https://quar.gr/crema',
  )
  await expect(
    page.locator('.melt-hero-actions').getByRole('link', { name: /Wolt/i }),
  ).toBeVisible()
  await expect(page.locator('.melt-gallery-depth')).toHaveCount(1)
  await expect(page.locator('.melt-gazi-iframe')).toHaveAttribute(
    'src',
    /google\.com\/maps\/embed/,
  )

  if (isMobile) {
    await expect(page.locator('.melt-signatures-mobile')).toBeVisible()
  } else {
    await expect(page.locator('.melt-hover-expand')).toBeVisible()
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(2)
})

test('heavy Unlumen effects fall back safely on mobile', async ({
  isMobile,
  page,
}) => {
  test.skip(!isMobile, 'the adaptive fallback is specific to mobile/coarse pointers')

  await page.goto('./')

  await expect(page.locator('.melt-hero-liquid')).toHaveAttribute(
    'data-renderer',
    'static',
  )
  await expect(page.locator('.melt-hero-liquid canvas')).toHaveCount(0)
  await expect(page.locator('.melt-gallery-depth')).toHaveAttribute(
    'data-presentation',
    'static',
  )
  await expect(page.locator('.melt-gallery-depth figure')).toHaveCount(8)

  const downloadedChunks = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((name) => name.includes('-renderer-')),
  )
  expect(downloadedChunks).toEqual([])
})

test('key conversion paths remain semantic and reachable', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('#delivery a[href*="wolt.com"]')).toBeVisible()
  await expect(page.locator('#delivery a[href*="e-food.gr"]')).toBeVisible()
  await expect(page.locator('#delivery a[href="https://quar.gr/crema"]')).toBeVisible()
  await expect(page.locator('#gazi a[href^="tel:"]')).toBeVisible()
  await expect(page.locator('.melt-button button, .melt-button a')).toHaveCount(0)

  await page.locator('#delivery').scrollIntoViewIfNeeded()
  await expect(page.locator('.site-footer')).toContainText('63')
  await expect(page.locator('.site-footer')).toContainText('delivery')
})

test('HoverExpand supports keyboard focus and disclosure', async ({
  isMobile,
  page,
}) => {
  test.skip(isMobile, 'mobile uses the compact static signatures list')

  await page.goto('./')
  const rows = page.locator('.melt-hover-expand button')
  await expect(rows).toHaveCount(4)

  await rows.nth(0).focus()
  await expect(rows.nth(0)).toHaveAttribute('aria-expanded', 'true')

  await page.keyboard.press('Tab')
  await expect(rows.nth(1)).toBeFocused()
  await expect(rows.nth(1)).toHaveAttribute('aria-expanded', 'true')
  await expect(rows.nth(0)).toHaveAttribute('aria-expanded', 'false')
})

test('language selector opens a custom accessible menu', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('.language-picker select')).toHaveCount(0)
  await expect(page.locator('.language-kicker')).toHaveText('Γλώσσα')
  await expect(page.locator('.language-current')).toHaveAttribute('translate', 'no')

  const trigger = page.locator('.language-trigger')
  await trigger.click()

  const panel = page.locator('.language-panel')
  await expect(panel).toBeVisible()
  await expect(panel).toHaveAttribute('translate', 'no')
  await expect(panel.locator('.language-option')).toHaveCount(16)
  await expect(
    panel.locator('.language-option[data-language="el"]'),
  ).toHaveAttribute('aria-selected', 'true')
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
})

test('custom cursor stays lightweight on fine desktop pointers', async ({
  browserName,
  isMobile,
  page,
}) => {
  test.skip(
    browserName !== 'chromium' || isMobile,
    'custom cursor is only enabled for fine desktop pointers',
  )

  await page.goto('./')

  await expect(page.locator('body')).toHaveClass(/has-custom-cursor/)
  await expect(page.locator('.custom-cursor')).toHaveClass(/is-enabled/)
  await page.mouse.move(420, 360)
  await expect(page.locator('.custom-cursor')).toHaveClass(/is-visible/)

  const menuBox = await page
    .getByRole('link', { name: 'Crema menu' })
    .first()
    .boundingBox()
  expect(menuBox).not.toBeNull()
  await page.mouse.move(
    menuBox!.x + menuBox!.width / 2,
    menuBox!.y + menuBox!.height / 2,
  )
  await expect(page.locator('.custom-cursor')).toHaveClass(/is-interactive/)
})
