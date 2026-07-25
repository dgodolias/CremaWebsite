import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const signalTitle = 'Crema Signal — coffee, crepes & late-night Gazi'
const signalDescription =
  'Crema Signal is an experimental, motion-led story for coffee, crepes and late-night delivery from Gazi, Athens.'
const signalCanonical = 'https://dgodolias.github.io/CremaWebsite/signal/'

test('built signal entry ships route-correct metadata before hydration', async () => {
  const indexHtml = await readFile(resolve('dist/index.html'), 'utf8')
  const signalHtml = await readFile(resolve('dist/signal/index.html'), 'utf8')
  const fallbackHtml = await readFile(resolve('dist/404.html'), 'utf8')
  const entryScript = indexHtml.match(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/i)?.[1]

  expect(signalHtml).toContain('<html lang="en">')
  expect(signalHtml).toContain(`<title>${signalTitle}</title>`)
  expect(signalHtml).toContain(`<meta name="description" content="${signalDescription}" />`)
  expect(signalHtml).toContain('<meta name="theme-color" content="#100c0a" />')
  expect(signalHtml).toContain(`<link rel="canonical" href="${signalCanonical}" />`)
  expect(signalHtml.match(/\brel="canonical"/g)).toHaveLength(1)

  expect(entryScript).toBeTruthy()
  expect(fallbackHtml).toContain('<html lang="el">')
  expect(fallbackHtml).toContain('<div id="root"></div>')
  expect(fallbackHtml).toContain(`src="${entryScript}"`)
  expect(fallbackHtml).not.toContain(signalTitle)
  expect(fallbackHtml).not.toContain(signalCanonical)
})

test('signal route renders the expanded motion lab without overflow', async ({ page }) => {
  const prohibitedCdnRequests: string[] = []
  page.on('request', (request) => {
    if (/^https:\/\/(?:cdn\.jsdelivr\.net|unpkg\.com)\//i.test(request.url())) {
      prohibitedCdnRequests.push(request.url())
    }
  })

  await page.goto('signal')
  await page.waitForLoadState('networkidle')

  await expect(page).toHaveTitle(signalTitle)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /motion-led story/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sweet static.')
  await expect(page.locator('.signal-story-chapter')).toHaveCount(4)
  await expect(page.locator('.signal-palette-controls button')).toHaveCount(4)
  await expect(page.locator('.signal-recipe article')).toHaveCount(6)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)

  const unsafeExternalLinks = await page
    .locator('a[target="_blank"]')
    .evaluateAll((links) => links.filter((link) => !link.relList.contains('noreferrer')).length)
  expect(unsafeExternalLinks).toBe(0)
  expect(prohibitedCdnRequests).toEqual([])
})

test('scroll story advances frames with a bounded responsive sequence budget', async ({ page }, testInfo) => {
  const requestedFrames = new Set<number>()
  const frameResponses: Promise<{ contentType: string; ok: boolean; sameOrigin: boolean }>[] = []
  const failedFrameRequests: string[] = []

  page.on('request', (request) => {
    const match = request.url().match(/signal-sequence-v4\/frame-(\d{3})\.webp/)
    if (match) requestedFrames.add(Number(match[1]))
  })
  page.on('requestfailed', (request) => {
    if (request.url().includes('/signal-sequence-v4/')) failedFrameRequests.push(request.url())
  })
  page.on('response', (response) => {
    if (!response.url().includes('/signal-sequence-v4/')) return

    frameResponses.push(
      Promise.resolve({
        contentType: response.headers()['content-type'] ?? '',
        ok: response.status() >= 200 && response.status() < 400,
        sameOrigin: new URL(response.url()).origin === new URL(page.url()).origin,
      }),
    )
  })

  await page.goto('signal')
  await page.waitForLoadState('networkidle')

  const storyTop = await page
    .locator('#story')
    .evaluate((node) => node.getBoundingClientRect().top + window.scrollY)
  await page.evaluate(
    (top) => window.scrollTo({ top: top + window.innerHeight * 1.7, behavior: 'instant' }),
    storyTop,
  )

  await expect
    .poll(
      async () => Number(await page.locator('.signal-story-canvas').getAttribute('data-frame')),
      { timeout: 10_000 },
    )
    .toBeGreaterThan(20)
  await expect
    .poll(
      async () => Number(await page.locator('.signal-story-canvas').getAttribute('data-rendered-frame')),
      { timeout: 10_000 },
    )
    .toBeGreaterThan(0)
  await expect(page.locator('.signal-story-chapter[data-active="true"]')).toHaveCount(1)

  const cacheDiagnostics = await page.locator('.signal-story-canvas').evaluate((canvas) => ({
    cacheLimit: Number((canvas as HTMLCanvasElement).dataset.cacheLimit),
    cacheSize: Number((canvas as HTMLCanvasElement).dataset.cacheSize),
    frame: Number((canvas as HTMLCanvasElement).dataset.frame),
    frameStep: Number((canvas as HTMLCanvasElement).dataset.frameStep),
    pendingRequests: Number((canvas as HTMLCanvasElement).dataset.pendingRequests),
    requestBudget: Number((canvas as HTMLCanvasElement).dataset.requestBudget),
    requestBudgetKind: (canvas as HTMLCanvasElement).dataset.requestBudgetKind,
  }))
  const completedFrameResponses = await Promise.all(frameResponses)
  expect(requestedFrames.size).toBeGreaterThan(0)
  expect(requestedFrames.size).toBeLessThanOrEqual(testInfo.project.name === 'mobile-safari' ? 31 : 120)
  expect(failedFrameRequests).toEqual([])
  expect(completedFrameResponses.length).toBeGreaterThan(0)
  expect(completedFrameResponses.every(({ ok }) => ok)).toBe(true)
  expect(completedFrameResponses.every(({ sameOrigin }) => sameOrigin)).toBe(true)
  expect(completedFrameResponses.every(({ contentType }) => contentType.startsWith('image/webp'))).toBe(true)
  expect(cacheDiagnostics.requestBudgetKind).toBe('concurrent')
  expect(cacheDiagnostics.cacheSize).toBeLessThanOrEqual(cacheDiagnostics.cacheLimit)
  expect(cacheDiagnostics.pendingRequests).toBeLessThanOrEqual(cacheDiagnostics.requestBudget)
  if (testInfo.project.name === 'mobile-safari') {
    expect(cacheDiagnostics.cacheLimit).toBe(10)
    expect(cacheDiagnostics.frameStep).toBe(4)
    expect(cacheDiagnostics.frame === 120 || (cacheDiagnostics.frame - 1) % 4 === 0).toBe(true)
  } else {
    expect(cacheDiagnostics.cacheLimit).toBe(18)
    expect(cacheDiagnostics.frameStep).toBe(1)
  }
})

test('320px and short-landscape layouts keep interactive content inside the viewport', async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 844, height: 390 },
  ]

  for (const viewport of viewports) {
    await page.setViewportSize(viewport)
    await page.goto('signal')
    await page.waitForLoadState('networkidle')

    const layout = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - window.innerWidth
      const clippedControls = [...document.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
        .filter((element) => {
          const style = getComputedStyle(element)
          if (style.display === 'none' || style.visibility === 'hidden') return false

          const rect = element.getBoundingClientRect()
          return rect.width > 0 && (rect.left < -2 || rect.right > window.innerWidth + 2)
        })
        .map((element) => element.getAttribute('aria-label') || element.textContent?.trim() || element.tagName)

      return { clippedControls, overflow }
    })

    expect(layout.overflow, `${viewport.width}x${viewport.height} document overflow`).toBeLessThanOrEqual(2)
    expect(layout.clippedControls, `${viewport.width}x${viewport.height} clipped controls`).toEqual([])
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('.signal-palette-controls button').first()).toBeVisible()
  }
})

test('keyboard traversal follows the primary navigation and activates in-page links', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Desktop keyboard traversal')

  await page.goto('signal')
  await page.waitForLoadState('networkidle')

  const expectedFocusOrder = [
    { href: '#signal-top', name: 'Crema Signal home' },
    { href: '#story', name: 'Story' },
    { href: '#menu', name: 'Menu' },
    { href: '#colorways', name: 'Colorways' },
    { href: '#ingredients', name: 'Stack' },
  ]

  for (const expected of expectedFocusOrder) {
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')

    await expect(focused).toHaveAttribute('href', expected.href)
    await expect(focused).toHaveAccessibleName(expected.name)
    expect(
      await focused.evaluate((element) => {
        const style = getComputedStyle(element)
        return style.outlineStyle !== 'none' && style.outlineWidth !== '0px'
      }),
    ).toBe(true)
  }

  await page.goto('signal')
  await page.waitForLoadState('networkidle')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toHaveAccessibleName('Story')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#story$/)
})

test('200% zoom preserves horizontal reflow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Chromium CSS zoom regression check')

  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('signal')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2'
  })

  const zoomLayout = await page.evaluate(() => ({
    computedZoom: getComputedStyle(document.documentElement).zoom,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }))

  expect(zoomLayout.computedZoom).toBe('2')
  expect(zoomLayout.overflow).toBeLessThanOrEqual(2)
})

test('colorway lab changes content through semantic controls', async ({ page }) => {
  await page.goto('signal')
  await page.waitForLoadState('networkidle')

  const berry = page.getByRole('button', { name: 'Berry afterimage' })
  await berry.click()

  await expect(berry).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.signal-palette-readout strong')).toHaveText('Berry afterimage')
  await expect(page.locator('.signal-palette-card img')).toHaveAttribute(
    'alt',
    'Close crop of espresso and chocolate crepe with berries',
  )

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(2)
})

test('signal preserves a complete reduced-motion presentation', async ({ page }) => {
  const richMediaRequests: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (/dotlottie|lottie|\.wasm(?:$|\?)/i.test(url) || /^https:\/\/(?:cdn\.jsdelivr\.net|unpkg\.com)\//i.test(url)) {
      richMediaRequests.push(url)
    }
  })

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('signal')
  await page.waitForLoadState('networkidle')

  await expect(page.locator('.signal-shell')).toHaveAttribute('data-reduced-motion', 'true')
  await expect(page.locator('.signal-story')).toHaveAttribute('data-reduced-motion', 'true')
  await expect(page.locator('.signal-story-chapter')).toHaveCount(4)
  await expect(page.locator('.signal-story-chapter[data-active="true"]')).toHaveCount(1)
  await expect(page.locator('.signal-story-canvas')).toHaveAttribute('data-frame', '61')
  await expect(page.locator('.signal-palette-stage')).toHaveAttribute('data-reduced-motion', 'true')

  const orbitAnimation = await page
    .locator('.signal-palette-orbit-one')
    .evaluate((element) => getComputedStyle(element).animationName)
  const storyRequestCount = Number(await page.locator('.signal-story-canvas').getAttribute('data-request-count'))
  expect(orbitAnimation).toBe('none')
  expect(storyRequestCount).toBeLessThanOrEqual(1)
  expect(richMediaRequests).toEqual([])
})

test('desktop save-data mode keeps the native low-budget story path', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Desktop save-data regression check')

  const enhancedRuntimeRequests: string[] = []
  page.on('request', (request) => {
    if (/gsap|ScrollTrigger|lenis|SignalLottiePlayer|dotlottie|\.wasm(?:$|\?)/i.test(request.url())) {
      enhancedRuntimeRequests.push(request.url())
    }
  })
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    })
  })

  await page.goto('signal')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(800)
  const storyTop = await page
    .locator('#story')
    .evaluate((node) => node.getBoundingClientRect().top + window.scrollY)
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), storyTop)
  await page.waitForTimeout(800)

  await expect(page.locator('.signal-lottie-player')).toHaveAttribute('data-status', 'static')
  await expect(page.locator('.signal-story')).toHaveAttribute('data-scroll-engine', 'native')
  await expect(page.locator('.signal-story-canvas')).toHaveAttribute('data-save-data', 'true')
  await expect(page.locator('.signal-story-canvas')).toHaveAttribute('data-cache-limit', '10')
  await expect(page.locator('.signal-story-canvas')).toHaveAttribute('data-frame-step', '4')
  expect(enhancedRuntimeRequests).toEqual([])
})

test('signal has no automatically detectable axe violations', async ({ page }) => {
  await page.goto('signal')
  await page.waitForLoadState('networkidle')

  const scan = await new AxeBuilder({ page }).analyze()
  const violations = scan.violations.map(({ help, id, impact, nodes }) => ({
    help,
    id,
    impact,
    targets: nodes.flatMap((node) => node.target),
  }))

  expect(violations).toEqual([])
})
