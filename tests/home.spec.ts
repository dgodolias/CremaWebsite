import { expect, test } from '@playwright/test'

test('homepage renders the Crema experience without layout overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /Crema Φάε γλυκό πρώτα/i })).toBeVisible()
  await expect(page.locator('.hero-actions').getByRole('link', { name: /Παραγγελία στο Wolt/i })).toBeVisible()
  await expect(page.locator('.delivery-chip')).toContainText('Περσεφόνης 63')

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('key sections stay reachable on mobile', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: /Κλήση στο Crema Gazi/i }).first().isVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  await expect(page.locator('.site-footer')).toContainText('Περσεφόνης 63, Γκάζι')
  await expect(page.locator('.site-footer')).toContainText('24ωρο delivery')
})
