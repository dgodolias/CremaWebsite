import { expect, test } from '@playwright/test'

test('homepage renders the Crema experience without layout overflow', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('h1')).toContainText('Crema')
  await expect(page.locator('#google_translate_element')).toHaveCount(1)
  await expect(page.locator('.hero-media')).toBeVisible()
  await expect(page.locator('.hero-poster')).toHaveAttribute('src', /dimello-coffee\.jpg/)
  await expect(page.locator('.hero-sequence-canvas')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Crema menu' })).toHaveAttribute('href', 'https://www.e-food.gr/delivery/menu/crema')
  await expect(page.locator('.hero-actions').getByRole('link', { name: /Wolt/i })).toBeVisible()
  await expect(page.locator('.delivery-chip')).toContainText('63')
  await expect(page.locator('.location-iframe')).toHaveAttribute('src', /google\.com\/maps\/embed/)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('featured menu reflects the requested brands and categories', async ({ page }) => {
  await page.goto('./')

  const site = page.locator('.site-shell')
  await expect(site).toContainText('Dimello')
  await expect(site).toContainText('Μπάρες βρώμης')
  await expect(site).toContainText('Αραβική πίτα')
  await expect(site).toContainText('Club Sandwich XL')
  await expect(site).toContainText('Παγωτό Provio')
  await expect(page.locator('.provio-spotlight')).toContainText('Μάρκα που στηρίζουμε')
  await expect(page.locator('.provio-spotlight img')).toHaveAttribute('src', /provio-logo-reference\.png/)
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

test('custom cursor stays lightweight and reacts to desktop interactions', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'custom cursor is only enabled for fine desktop pointers')

  await page.goto('./')

  await expect(page.locator('body')).toHaveClass(/has-custom-cursor/)
  await expect(page.locator('.custom-cursor')).toHaveClass(/is-enabled/)
  await page.mouse.move(420, 360)
  await expect(page.locator('.custom-cursor')).toHaveClass(/is-visible/)

  const menuBox = await page.getByRole('link', { name: 'Crema menu' }).first().boundingBox()
  expect(menuBox).not.toBeNull()
  await page.mouse.move(menuBox!.x + menuBox!.width / 2, menuBox!.y + menuBox!.height / 2)
  await expect(page.locator('.custom-cursor')).toHaveClass(/is-interactive/)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('hero canvas sequence scrubs when the desktop page scrolls', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'desktop Chromium gives the most stable canvas signal')

  await page.goto('./')
  await page.waitForFunction(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('.hero-sequence-canvas')
    return canvas && canvas.dataset.frame === '0' && canvas.width > 0 && canvas.height > 0
  })

  const canvasSizing = await page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('.hero-sequence-canvas')!
    const media = document.querySelector<HTMLElement>('.hero-media')!
    return {
      bitmapWidth: canvas.width,
      bitmapHeight: canvas.height,
      mediaWidth: media.clientWidth,
      mediaHeight: media.clientHeight,
    }
  })
  expect(Math.abs(canvasSizing.bitmapWidth - canvasSizing.mediaWidth)).toBeLessThanOrEqual(2)
  expect(Math.abs(canvasSizing.bitmapHeight - canvasSizing.mediaHeight)).toBeLessThanOrEqual(2)

  const initialDarken = await page.evaluate(() =>
    Number.parseFloat(getComputedStyle(document.querySelector('.site-shell')!).getPropertyValue('--hero-scroll-darken')),
  )
  expect(initialDarken).toBeLessThan(0.05)

  await page.mouse.wheel(0, 900)

  await expect
    .poll(() => page.locator('.hero-sequence-canvas').evaluate((element) => Number((element as HTMLCanvasElement).dataset.frame)), {
      timeout: 8_000,
    })
    .toBeGreaterThan(12)

  await expect
    .poll(
      () =>
        page.evaluate(() =>
          Number.parseFloat(getComputedStyle(document.querySelector('.site-shell')!).getPropertyValue('--hero-scroll-darken')),
        ),
      { timeout: 8_000 },
    )
    .toBeGreaterThan(0.25)

  for (let step = 0; step < 5; step += 1) {
    await page.mouse.wheel(0, 900)
    await page.waitForTimeout(160)
  }

  await expect
    .poll(() => page.locator('.hero-sequence-canvas').evaluate((element) => Number((element as HTMLCanvasElement).dataset.frame)), {
      timeout: 8_000,
    })
    .toBeGreaterThan(45)
})
