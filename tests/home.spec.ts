import { expect, test } from '@playwright/test'

test('homepage renders the Crema experience without layout overflow', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('h1')).toContainText('Crema')
  await expect(page.locator('#google_translate_element')).toHaveCount(1)
  await expect(page.locator('.hero-media')).toBeVisible()
  await expect(page.locator('.hero-poster')).toHaveAttribute('src', /crema-scroll-cover\.avif/)
  await expect(page.locator('.hero-video')).toHaveAttribute('src', /crema-hero-crepe\.mp4/)
  await expect(page.locator('.hero-sequence-canvas')).toHaveCount(0)
  await expect(page.locator('.since-badge')).toHaveText(/Since 2009/i)
  await expect(page.getByRole('link', { name: 'Crema menu' })).toHaveAttribute(
    'href',
    'https://www.e-food.gr/delivery/menu/crema',
  )
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
  await expect(page.locator('.product-card').first().locator('img')).toHaveAttribute('src', /dimello-coffee\.avif/)
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

test('desktop uses the native pointer without a continuous cursor animation', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('.custom-cursor')).toHaveCount(0)
  await expect(page.locator('body')).not.toHaveClass(/has-custom-cursor/)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('crepe hero scrubs forward and backward with scroll without frame sequences', async ({ page }) => {
  await page.goto('./')

  const heroVideo = page.locator('.hero-video')
  await expect.poll(() => heroVideo.evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThanOrEqual(2)

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2))
  await expect.poll(() => heroVideo.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(4)
  const forwardTime = await heroVideo.evaluate((video: HTMLVideoElement) => video.currentTime)

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.5))
  await expect.poll(() => heroVideo.evaluate((video: HTMLVideoElement) => video.currentTime)).toBeLessThan(forwardTime - 2)

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  const resources = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((entry) => entry.name),
  )

  expect(resources.some((url) => /hero-sequence|frame-\d+\.webp/.test(url))).toBe(false)
  expect(resources.some((url) => url.includes('translate.google.com/translate_a/element.js'))).toBe(false)
})
