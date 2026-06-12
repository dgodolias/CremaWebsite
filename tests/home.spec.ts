import { expect, test } from '@playwright/test'

test('homepage renders the Crema experience without layout overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /Crema Eat dessert first/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Order on Wolt/i })).toBeVisible()
  await expect(page.locator('.delivery-chip')).toContainText('Persefonis 63')

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('key sections stay reachable on mobile', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: /Call Crema Gazi/i }).first().isVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  await expect(page.locator('.site-footer')).toContainText('Persefonis 63, Gazi')
  await expect(page.locator('.site-footer')).toContainText('24hr delivery')
})
