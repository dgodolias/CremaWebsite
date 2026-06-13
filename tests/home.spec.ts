import { expect, test } from '@playwright/test'

test('homepage renders the Crema experience without layout overflow', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toContainText('Crema')
  await expect(page.locator('.hero-actions').getByRole('link', { name: /Wolt/i })).toBeVisible()
  await expect(page.locator('.delivery-chip')).toContainText('63')

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('key sections stay reachable on mobile', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.topbar .icon-action')).toBeVisible()
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

  await panel.locator('.language-option[data-language="tr"]').click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  await trigger.click()
  await expect(page.locator('.language-option[data-language="tr"]')).toHaveAttribute('aria-selected', 'true')

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})
