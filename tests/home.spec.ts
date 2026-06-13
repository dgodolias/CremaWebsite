import { expect, test } from '@playwright/test'

test('homepage renders the Crema experience without layout overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toContainText('Crema')
  await expect(page.locator('#google_translate_element')).toHaveCount(1)
  await expect(page.locator('.hero-media')).toBeVisible()
  await expect(page.locator('.hero-poster')).toHaveAttribute('src', /crema-scroll-cover\.avif/)
  await expect(page.locator('.hero-sequence-canvas')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Crema menu' })).toHaveAttribute('href', 'https://quar.gr/crema')
  await expect(page.locator('.hero-actions').getByRole('link', { name: /Wolt/i })).toBeVisible()
  await expect(page.locator('.delivery-chip')).toContainText('63')
  await expect(page.locator('.location-iframe')).toHaveAttribute('src', /google\.com\/maps\/embed/)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('key sections stay reachable on mobile', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.topbar .icon-action[href^="tel:"]')).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  await expect(page.locator('.site-footer')).toContainText('63')
  await expect(page.locator('.site-footer')).toContainText('24')
})

test('language selector opens a custom menu without native browser chrome', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.language-picker select')).toHaveCount(0)

  const trigger = page.locator('.language-trigger')
  await trigger.click()

  const panel = page.locator('.language-panel')
  await expect(panel).toBeVisible()
  await expect(panel.locator('.language-option')).toHaveCount(11)
  await expect(panel.locator('.language-option[data-language="el"]')).toHaveAttribute('aria-selected', 'true')

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('hero canvas sequence scrubs when the desktop page scrolls', async ({ browserName, page }) => {
  test.skip(browserName !== 'chromium', 'desktop Chromium gives the most stable canvas signal')

  await page.goto('/')
  await page.waitForFunction(() => {
    const canvas = document.querySelector<HTMLCanvasElement>('.hero-sequence-canvas')
    return canvas && canvas.dataset.frame === '0' && canvas.width > 0 && canvas.height > 0
  })

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
