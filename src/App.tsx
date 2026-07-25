import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  AtSign,
  Bike,
  BookOpenText,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Globe2,
  MapPin,
  Phone,
  ShoppingBag,
  Star,
} from 'lucide-react'
import clsx from 'clsx'
import { greekContent, supportedLanguages, type LanguageCode } from './content'

const baseUrl = import.meta.env.BASE_URL
const asset = (name: string) => `${baseUrl}assets/sourced/${name}`
const generatedAsset = (name: string) => `${baseUrl}assets/generated/${name}`
const heroPoster = asset('crema-scroll-cover.avif')
const heroSequenceFrameCount = 120
const heroSequenceFrame = (frame: number) =>
  generatedAsset(`hero-sequence/frame-${String(frame).padStart(3, '0')}.webp`)
const brandLogo = generatedAsset('crema-logo-trimmed-512.png')

const signatureImages = [
  heroPoster,
  asset('crema-waffle-13.jpg'),
  asset('crema-dessert-18.jpg'),
  asset('crema-crepe-05.jpg'),
]

const gallery = [
  asset('crema-dessert-18.jpg'),
  asset('crema-dessert-19.jpg'),
  asset('crema-dessert-20.jpg'),
  asset('crema-dessert-21.jpg'),
  asset('crema-dessert-23.jpg'),
  asset('crema-dessert-24.jpg'),
  asset('crema-dessert-26.jpg'),
  asset('crema-dessert-27.jpg'),
]

const productImages = [
  heroPoster,
  asset('crema-crepe-05.jpg'),
  asset('crema-waffle-13.jpg'),
  asset('crema-dessert-18.jpg'),
  asset('crema-dessert-22.jpg'),
  asset('crema-cover.jpg'),
]

const navTargets = ['story', 'signatures', 'gazi', 'delivery']
type TranslationState = 'idle' | 'loading' | 'ready' | 'error'
type GoogleTranslateOptions = {
  pageLanguage: string
  includedLanguages: string
  autoDisplay: boolean
  layout?: string | number
}
type GoogleTranslateElement = {
  new (options: GoogleTranslateOptions, elementId: string): void
  InlineLayout?: {
    SIMPLE?: string | number
  }
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: {
        TranslateElement?: GoogleTranslateElement
      }
    }
  }
}

const GOOGLE_TRANSLATE_SCRIPT_ID = 'google-translate-widget-script'
const LANGUAGE_STORAGE_KEY = 'crema-gazi-language'
const googleTranslateLanguages = supportedLanguages
  .filter((item) => item.code !== 'el')
  .map((item) => item.code)
  .join(',')

function isLanguageCode(value: string | null): value is LanguageCode {
  return supportedLanguages.some((item) => item.code === value)
}

function getInitialLanguage(): LanguageCode {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return isLanguageCode(stored) ? stored : 'el'
}

function MagneticLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
}) {
  const ref = useRef<HTMLAnchorElement>(null)

  return (
    <a
      ref={ref}
      href={href}
      className={clsx('magnetic-link', `magnetic-link-${variant}`)}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      onPointerMove={(event) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
        el.style.setProperty('--my', `${event.clientY - rect.top}px`)
      }}
    >
      {children}
    </a>
  )
}

function LanguageMenu({
  language,
  label,
  state,
  onChange,
}: {
  language: LanguageCode
  label: string
  state: TranslationState
  onChange: (language: LanguageCode) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const currentLanguage = supportedLanguages.find((item) => item.code === language) ?? supportedLanguages[0]

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !menuRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <div className="language-picker" ref={menuRef}>
      <button
        className="language-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="language-kicker">{label}</span>
        <span className="language-current notranslate" translate="no">
          <Globe2 size={15} />
          <span>{currentLanguage.label}</span>
        </span>
        <span className={clsx('language-state-dot', `is-${state}`)} aria-hidden="true" />
        <ChevronDown className={clsx('language-chevron', isOpen && 'is-open')} size={15} />
      </button>

      {isOpen && (
        <div className="language-panel notranslate" translate="no" role="listbox" aria-label={label}>
          {supportedLanguages.map((item) => {
            const isSelected = item.code === language

            return (
              <button
                className={clsx('language-option', isSelected && 'is-selected')}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-language={item.code}
                key={item.code}
                onClick={() => {
                  onChange(item.code)
                  setIsOpen(false)
                }}
              >
                <span className="language-name">{item.label}</span>
                <span className="language-code">{item.displayCode}</span>
                {isSelected && <Check size={15} aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function clearGoogleTranslateCookie() {
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie = `googtrans=; ${expires}; path=/`
  document.cookie = `googtrans=; ${expires}; path=/; domain=${window.location.hostname}`
}

function setGoogleTranslateCookie(language: Exclude<LanguageCode, 'el'>) {
  const value = `/el/${language}`
  const maxAge = 'max-age=31536000'
  document.cookie = `googtrans=${value}; ${maxAge}; path=/`
  document.cookie = `googtrans=${value}; ${maxAge}; path=/; domain=${window.location.hostname}`
}

function GoogleTranslateBridge({
  language,
  onStateChange,
}: {
  language: LanguageCode
  onStateChange: (state: TranslationState) => void
}) {
  useEffect(() => {
    if (language === 'el') return

    const initWidget = () => {
      const host = document.getElementById('google_translate_element')
      const TranslateElement = window.google?.translate?.TranslateElement
      if (!host || !TranslateElement) return
      if (host.dataset.ready === 'true') {
        onStateChange('ready')
        return
      }

      try {
        new TranslateElement(
          {
            pageLanguage: 'el',
            includedLanguages: googleTranslateLanguages,
            autoDisplay: false,
            layout: TranslateElement.InlineLayout?.SIMPLE,
          },
          'google_translate_element',
        )
        host.dataset.ready = 'true'
        onStateChange('ready')
      } catch {
        onStateChange('error')
      }
    }

    window.googleTranslateElementInit = initWidget

    if (window.google?.translate?.TranslateElement) {
      initWidget()
      return
    }

    if (!document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = GOOGLE_TRANSLATE_SCRIPT_ID
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      script.onerror = () => onStateChange('error')
      document.head.appendChild(script)
    }
  }, [language, onStateChange])

  return (
    <div className="google-translate-bridge" aria-hidden="true">
      <div id="google_translate_element" />
    </div>
  )
}

function HeroScrollMedia() {
  return (
    <div className="hero-media" aria-hidden="true">
      <img className="hero-poster" src={heroPoster} alt="" decoding="async" fetchPriority="high" />
      <canvas className="hero-sequence-canvas" data-frame="0" />
      <div className="hero-media-shade" />
    </div>
  )
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const supportsCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cursor = cursorRef.current
    const dot = dotRef.current
    const ring = ringRef.current

    if (!supportsCursor || reduceMotion || !cursor || !dot || !ring) return

    let rafId = 0
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let ringX = targetX
    let ringY = targetY
    let isInteractive = false

    document.body.classList.add('has-custom-cursor')
    cursor.classList.add('is-enabled')

    const paint = () => {
      ringX += (targetX - ringX) * 0.22
      ringY += (targetY - ringY) * 0.22
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`

      if (Math.abs(targetX - ringX) > 0.1 || Math.abs(targetY - ringY) > 0.1) {
        rafId = requestAnimationFrame(paint)
      } else {
        rafId = 0
      }
    }

    const schedulePaint = () => {
      if (!rafId) rafId = requestAnimationFrame(paint)
    }

    const setInteractiveState = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const nextIsInteractive = Boolean(
        element?.closest('a, button, input, textarea, select, iframe, [role="button"], [role="option"]'),
      )
      if (nextIsInteractive === isInteractive) return
      isInteractive = nextIsInteractive
      cursor.classList.toggle('is-interactive', isInteractive)
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      cursor.classList.add('is-visible')
      setInteractiveState(event.target)
      schedulePaint()
    }

    const onPointerLeave = () => {
      cursor.classList.remove('is-visible')
    }

    const onPointerDown = () => {
      cursor.classList.add('is-pressed')
    }

    const onPointerUp = () => {
      cursor.classList.remove('is-pressed')
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('pointerup', onPointerUp, { passive: true })

    return () => {
      document.body.classList.remove('has-custom-cursor')
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  return (
    <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
      <span className="custom-cursor-ring" ref={ringRef} />
      <span className="custom-cursor-dot" ref={dotRef} />
    </div>
  )
}

function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage)
  const [translationState, setTranslationState] = useState<TranslationState>('idle')
  const content = greekContent

  const handleLanguageChange = (nextLanguage: LanguageCode) => {
    if (nextLanguage === language) return

    setLanguage(nextLanguage)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
    setTranslationState(nextLanguage === 'el' ? 'idle' : 'loading')

    if (nextLanguage === 'el') {
      clearGoogleTranslateCookie()
    } else {
      setGoogleTranslateCookie(nextLanguage)
    }

    window.setTimeout(() => window.location.reload(), 80)
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = rootRef.current
    if (!root) return

    const revealTargets = Array.from(root.querySelectorAll<HTMLElement>('.image-reveal, .section-copy'))

    if (reduceMotion) {
      root.classList.add('is-ready')
      revealTargets.forEach((element) => element.classList.add('is-revealed'))
      return
    }

    root.classList.add('has-motion')
    const readyRaf = requestAnimationFrame(() => root.classList.add('is-ready'))

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
    )
    revealTargets.forEach((element) => revealObserver.observe(element))

    const useStaticHero = window.matchMedia('(hover: none), (pointer: coarse)').matches
    if (useStaticHero) {
      return () => {
        revealObserver.disconnect()
        cancelAnimationFrame(readyRaf)
        root.classList.remove('has-motion', 'is-ready')
      }
    }

    const heroCanvas = root.querySelector<HTMLCanvasElement>('.hero-sequence-canvas')
    const heroMedia = root.querySelector<HTMLElement>('.hero-media')
    const hero = root.querySelector<HTMLElement>('.hero')
    const signatureSection = root.querySelector<HTMLElement>('.signature-section')
    const deliverySection = root.querySelector<HTMLElement>('.delivery-section')
    const heroCopy = root.querySelector<HTMLElement>('.hero-copy')
    const heroChip = root.querySelector<HTMLElement>('.hero-delivery-chip')
    const scrollProgress = root.querySelector<HTMLElement>('.scroll-progress')
    const heroContext = heroCanvas?.getContext('2d', { alpha: false, desynchronized: true })

    const loadedFrames = new Map<number, HTMLImageElement>()
    const loadingFrames = new Map<number, HTMLImageElement>()
    const queuedFrames = new Set<number>()
    let frameQueue: number[] = []
    let activeHeroFrame = -1
    let targetHeroFrame = 0
    let previousTargetHeroFrame = 0
    let canvasWidth = Math.max(1, window.innerWidth)
    let canvasHeight = Math.max(1, window.innerHeight)
    let scrollRaf = 0
    let resizeRaf = 0
    let isCancelled = false
    const frameCacheSize = 18
    const maxConcurrentFrameLoads = 3

    const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
    const elementTop = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY
    const regions = {
      heroTop: 0,
      heroEnd: 1,
      signatureStart: 1,
      signatureEnd: 2,
      deliveryStart: 2,
      deliveryEnd: 3,
    }

    const drawHeroFrame = (requestedFrame = targetHeroFrame, force = false) => {
      if (!heroCanvas || !heroContext || !heroMedia || loadedFrames.size === 0) return

      let selectedFrame = loadedFrames.get(requestedFrame)
      let selectedIndex = requestedFrame

      if (!selectedFrame) {
        let shortestDistance = Number.POSITIVE_INFINITY
        loadedFrames.forEach((image, frameIndex) => {
          const distance = Math.abs(frameIndex - requestedFrame)
          if (distance < shortestDistance) {
            shortestDistance = distance
            selectedFrame = image
            selectedIndex = frameIndex
          }
        })
      }

      if (!selectedFrame?.naturalWidth || (!force && selectedIndex === activeHeroFrame)) return

      const scale = Math.max(canvasWidth / selectedFrame.naturalWidth, canvasHeight / selectedFrame.naturalHeight)
      const width = selectedFrame.naturalWidth * scale
      const height = selectedFrame.naturalHeight * scale

      heroContext.globalAlpha = 1
      heroContext.drawImage(selectedFrame, (canvasWidth - width) / 2, (canvasHeight - height) / 2, width, height)
      activeHeroFrame = selectedIndex
      heroCanvas.dataset.frame = String(selectedIndex)
      heroCanvas.dataset.frameProgress = String(requestedFrame)
      heroMedia.classList.add('is-canvas-ready')
    }

    const trimFrameCache = () => {
      if (loadedFrames.size <= frameCacheSize) return

      const removableFrames = [...loadedFrames.keys()]
        .filter((frameIndex) => frameIndex !== activeHeroFrame)
        .toSorted((a, b) => Math.abs(b - targetHeroFrame) - Math.abs(a - targetHeroFrame))

      while (loadedFrames.size > frameCacheSize && removableFrames.length) {
        const frameIndex = removableFrames.shift()
        if (frameIndex === undefined) break
        const image = loadedFrames.get(frameIndex)
        loadedFrames.delete(frameIndex)
        if (image) image.src = ''
      }
    }

    const pumpFrameQueue = () => {
      while (!isCancelled && loadingFrames.size < maxConcurrentFrameLoads && frameQueue.length) {
        const frameIndex = frameQueue.shift()
        if (frameIndex === undefined) break
        queuedFrames.delete(frameIndex)
        if (loadedFrames.has(frameIndex) || loadingFrames.has(frameIndex)) continue

        const image = new Image()
        image.decoding = 'async'
        image.fetchPriority = Math.abs(frameIndex - targetHeroFrame) <= 1 ? 'high' : 'low'
        loadingFrames.set(frameIndex, image)

        let settled = false
        const finish = () => {
          if (settled) return
          settled = true
          loadingFrames.delete(frameIndex)
          if (!isCancelled && image.naturalWidth) {
            loadedFrames.set(frameIndex, image)
            trimFrameCache()
            if (activeHeroFrame === -1 || Math.abs(frameIndex - targetHeroFrame) <= 1) {
              drawHeroFrame(targetHeroFrame, true)
            }
          }
          pumpFrameQueue()
        }

        image.onerror = finish
        image.src = heroSequenceFrame(frameIndex + 1)
        image.decode().catch(() => undefined).then(finish)
      }
    }

    const requestHeroFrame = (frameIndex: number, urgent = false) => {
      if (frameIndex < 0 || frameIndex >= heroSequenceFrameCount || loadedFrames.has(frameIndex) || loadingFrames.has(frameIndex)) {
        return
      }

      if (queuedFrames.has(frameIndex)) {
        if (urgent) {
          frameQueue = frameQueue.filter((queuedFrame) => queuedFrame !== frameIndex)
          frameQueue.unshift(frameIndex)
        }
      } else {
        queuedFrames.add(frameIndex)
        if (urgent) frameQueue.unshift(frameIndex)
        else frameQueue.push(frameIndex)
      }
      pumpFrameQueue()
    }

    const queueHeroFrame = (frameProgress: number) => {
      previousTargetHeroFrame = targetHeroFrame
      targetHeroFrame = Math.round(clamp(frameProgress, 0, heroSequenceFrameCount - 1))
      const direction = targetHeroFrame >= previousTargetHeroFrame ? 1 : -1

      frameQueue = frameQueue.filter((frameIndex) => {
        const keep = Math.abs(frameIndex - targetHeroFrame) <= 6
        if (!keep) queuedFrames.delete(frameIndex)
        return keep
      })

      requestHeroFrame(targetHeroFrame, true)
      requestHeroFrame(targetHeroFrame + direction, true)
      requestHeroFrame(targetHeroFrame - direction)
      requestHeroFrame(targetHeroFrame + direction * 2)
      requestHeroFrame(targetHeroFrame + direction * 3)
      drawHeroFrame(targetHeroFrame)
    }

    const resizeHeroCanvas = () => {
      if (!heroCanvas || !heroContext) return

      canvasWidth = Math.max(1, heroMedia?.clientWidth || window.innerWidth)
      canvasHeight = Math.max(1, heroMedia?.clientHeight || window.innerHeight)
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      const width = Math.max(1, Math.round(canvasWidth * dpr))
      const height = Math.max(1, Math.round(canvasHeight * dpr))

      if (heroCanvas.width !== width || heroCanvas.height !== height) {
        heroCanvas.width = width
        heroCanvas.height = height
      }

      heroContext.setTransform(dpr, 0, 0, dpr, 0, 0)
      heroContext.imageSmoothingEnabled = true
      heroContext.imageSmoothingQuality = 'medium'
      drawHeroFrame(targetHeroFrame, true)
    }

    const refreshRegions = () => {
      if (!hero || !signatureSection || !deliverySection) return
      regions.heroTop = elementTop(hero)
      regions.heroEnd = regions.heroTop + hero.offsetHeight
      regions.signatureStart = elementTop(signatureSection) - window.innerHeight
      regions.signatureEnd = elementTop(signatureSection) + signatureSection.offsetHeight
      regions.deliveryStart = elementTop(deliverySection) - window.innerHeight
      regions.deliveryEnd = elementTop(deliverySection) + deliverySection.offsetHeight
    }

    const revealThenFadeDarken = (progress: number) => {
      const value = clamp(progress)
      if (value < 0.42) return 0.92 - (value / 0.42) * 0.56
      if (value > 0.82) return 0.36 + ((value - 0.82) / 0.18) * 0.48
      return 0.36
    }

    const updateScroll = () => {
      scrollRaf = 0
      const scrollY = window.scrollY
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const heroProgress = clamp((scrollY - regions.heroTop) / Math.max(1, regions.heroEnd - regions.heroTop))

      if (scrollProgress) scrollProgress.style.transform = `scaleX(${(scrollY / scrollRange).toFixed(4)})`
      if (heroCopy) {
        heroCopy.style.transform = `translate3d(0, ${(-36 * heroProgress).toFixed(2)}px, 0)`
        heroCopy.style.opacity = String(1 - heroProgress * 0.64)
      }
      if (heroChip) {
        heroChip.style.transform = `translate3d(0, ${(-64 * heroProgress).toFixed(2)}px, 0) rotate(${(1.6 * heroProgress).toFixed(2)}deg)`
      }

      let frameProgress = 45
      let darken = 0.8
      let canvasOpacity = 0.94
      let shadeOpacity = 1
      let imageScale = 1.045 + heroProgress * 0.035

      if (scrollY <= regions.heroEnd) {
        frameProgress = heroProgress * 45
        darken = heroProgress * 0.8
      } else if (scrollY >= regions.signatureStart && scrollY <= regions.signatureEnd) {
        const progress = clamp((scrollY - regions.signatureStart) / Math.max(1, regions.signatureEnd - regions.signatureStart))
        frameProgress = 45 + progress * 39
        darken = revealThenFadeDarken(progress)
        canvasOpacity = 0.9
        shadeOpacity = 0.82
        imageScale = 1.08
      } else if (scrollY > regions.signatureEnd && scrollY < regions.deliveryStart) {
        frameProgress = 84
        darken = 0.84
        canvasOpacity = 0.9
        shadeOpacity = 0.82
        imageScale = 1.08
      } else if (scrollY >= regions.deliveryStart) {
        const progress = clamp((scrollY - regions.deliveryStart) / Math.max(1, regions.deliveryEnd - regions.deliveryStart))
        frameProgress = 84 + progress * (heroSequenceFrameCount - 1 - 84)
        darken = revealThenFadeDarken(progress)
        canvasOpacity = 0.88
        shadeOpacity = 0.74
        imageScale = 1.08
      }

      root.style.setProperty('--hero-scroll-darken', darken.toFixed(3))
      root.style.setProperty('--sequence-canvas-opacity', String(canvasOpacity))
      root.style.setProperty('--sequence-shade-opacity', String(shadeOpacity))
      root.style.setProperty('--sequence-image-scale', String(imageScale))
      queueHeroFrame(frameProgress)
    }

    const scheduleScrollUpdate = () => {
      if (!scrollRaf) scrollRaf = requestAnimationFrame(updateScroll)
    }

    const onResize = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        refreshRegions()
        resizeHeroCanvas()
        scheduleScrollUpdate()
      })
    }

    refreshRegions()
    resizeHeroCanvas()
    requestHeroFrame(0, true)
    requestHeroFrame(1)
    requestHeroFrame(2)
    scheduleScrollUpdate()

    const regionObserver = new ResizeObserver(onResize)
    if (hero) regionObserver.observe(hero)
    if (signatureSection) regionObserver.observe(signatureSection)
    if (deliverySection) regionObserver.observe(deliverySection)

    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.fonts.ready.then(() => {
      if (!isCancelled) onResize()
    })

    return () => {
      isCancelled = true
      revealObserver.disconnect()
      regionObserver.disconnect()
      window.removeEventListener('scroll', scheduleScrollUpdate)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(scrollRaf)
      cancelAnimationFrame(resizeRaf)
      cancelAnimationFrame(readyRaf)
      loadedFrames.forEach((image) => {
        image.src = ''
      })
      loadingFrames.forEach((image) => {
        image.src = ''
      })
      root.classList.remove('has-motion', 'is-ready')
    }
  }, [])

  return (
    <div className="site-shell" ref={rootRef}>
      <div className="scroll-progress" />
      <HeroScrollMedia />
      <GoogleTranslateBridge language={language} onStateChange={setTranslationState} />
      <CustomCursor />

      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Crema Gazi home">
          <img className="brand-logo" src={brandLogo} alt="" width="512" height="437" decoding="async" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {content.nav.map((item, index) => (
            <a key={navTargets[index]} href={`#${navTargets[index]}`}>
              {item}
            </a>
          ))}
          <a className="nav-menu-link" href="https://quar.gr/crema" target="_blank" rel="noreferrer" aria-label="Crema menu">
            <BookOpenText size={15} />
            Μενού
            <ArrowUpRight size={14} />
          </a>
        </nav>
        <div className="topbar-actions">
          <LanguageMenu
            language={language}
            label={content.language.label}
            state={translationState}
            onChange={handleLanguageChange}
          />
          <a className="icon-action menu-icon-action" href="https://quar.gr/crema" target="_blank" rel="noreferrer" aria-label="Crema menu">
            <BookOpenText size={18} />
          </a>
          <a className="icon-action" href="tel:+302103467213" aria-label={content.meta.call}>
            <Phone size={18} />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-noise" />
          <div className="hero-copy">
            <p className="eyebrow">
              <Clock3 size={16} />
              {content.hero.eyebrow}
            </p>
            <h1 id="hero-title">
              <span className="line-mask">
                <span className="reveal-line script-word">{content.hero.brand}</span>
              </span>
              {content.hero.headline.map((line, index) => (
                <span className="line-mask" key={line}>
                  <span className={clsx('reveal-line', index === content.hero.headline.length - 1 && 'accent-line')}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p className="hero-subcopy">
              {content.hero.subcopy}
            </p>
            <div className="hero-actions">
              <MagneticLink href="https://wolt.com/en/grc/athens/restaurant/crema">
                <ShoppingBag size={18} />
                {content.hero.orderWolt}
                <ArrowUpRight size={16} />
              </MagneticLink>
              <MagneticLink href="https://www.e-food.gr/delivery/menu/crema" variant="secondary">
                {content.hero.orderEfood}
                <ArrowUpRight size={16} />
              </MagneticLink>
            </div>
          </div>

          <div className="delivery-chip hero-delivery-chip" data-float="0.8" aria-hidden="true">
            <Bike size={20} />
            <span>{content.hero.location}</span>
          </div>

          <div className="hero-footer">
            <span>{content.hero.footerOne}</span>
            <span>{content.hero.footerTwo}</span>
            <span>{content.hero.phone}</span>
          </div>
        </section>

        <section className="marquee-band" aria-label="Crema signature categories">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="marquee-group" key={group}>
                <span>{content.marquee[0]}</span>
                <Star size={18} />
                <span>{content.marquee[1]}</span>
                <Star size={18} />
                <span>{content.marquee[2]}</span>
                <Star size={18} />
                <span>{content.marquee[3]}</span>
                <Star size={18} />
                <span>{content.marquee[4]}</span>
                <Star size={18} />
              </div>
            ))}
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="section-copy story-copy">
            <p className="eyebrow">
              <Coffee size={16} />
              {content.story.eyebrow}
            </p>
            <h2>{content.story.title}</h2>
            <p>{content.story.body}</p>
          </div>
          <div className="story-visual image-reveal">
            <img
              className="story-logo"
              src={brandLogo}
              alt={content.story.logoAlt}
              width="512"
              height="437"
              loading="lazy"
              decoding="async"
            />
            <div>
              <span>{content.story.visualMain}</span>
              <strong>{content.story.visualSub}</strong>
            </div>
          </div>
        </section>

        <section className="signature-section" id="signatures">
          <div className="section-copy section-heading">
            <p className="eyebrow">
              <Star size={16} />
              {content.signatures.eyebrow}
            </p>
            <h2>{content.signatures.title}</h2>
          </div>

          <div className="signature-grid">
            {content.signatures.items.map((item, index) => (
              <article className="signature-card image-reveal" key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <img src={signatureImages[index]} alt="" loading="lazy" decoding="async" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="products-section" aria-labelledby="products-title">
          <div className="section-copy section-heading">
            <p className="eyebrow">
              <ShoppingBag size={16} />
              {content.products.eyebrow}
            </p>
            <h2 id="products-title">{content.products.title}</h2>
          </div>

          <div className="products-rail">
            {content.products.items.map((item, index) => (
              <article className="product-card image-reveal" key={item.name}>
                <img src={productImages[index]} alt="" loading="lazy" decoding="async" />
                <div className="product-card-copy">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                  <a href="https://wolt.com/en/grc/athens/restaurant/crema" target="_blank" rel="noreferrer">
                    {content.products.cta}
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section" aria-label="Crema product gallery">
          {gallery.map((src, index) => (
            <figure className="gallery-tile image-reveal" key={src}>
              <img src={src} alt={`${content.galleryAlt} ${index + 1}`} loading="lazy" decoding="async" />
            </figure>
          ))}
        </section>

        <section className="location-section" id="gazi">
          <div className="location-map image-reveal">
            <iframe
              className="location-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.9302224576086!2d23.70753667644428!3d37.97875770038259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bcde73544fb5%3A0xd7ff0cdaf6903b86!2sCREMA!5e0!3m2!1sel!2sgr!4v1781330993571!5m2!1sel!2sgr"
              title="Χάρτης CREMA στο Γκάζι"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="section-copy location-copy">
            <p className="eyebrow">
              <MapPin size={16} />
              {content.location.eyebrow}
            </p>
            <h2>{content.location.title}</h2>
            <p>{content.location.body}</p>
            <div className="location-actions">
              <MagneticLink href="https://www.google.com/maps/search/?api=1&query=Crema%20Gazi%20Persefonis%2063%20Athens">
                <MapPin size={18} />
                {content.location.openMap}
                <ArrowUpRight size={16} />
              </MagneticLink>
              <MagneticLink href="tel:+302103467213" variant="secondary">
                <Phone size={18} />
                {content.location.callNow}
              </MagneticLink>
            </div>
          </div>
        </section>

        <section className="delivery-section" id="delivery">
          <div className="delivery-copy section-copy">
            <p className="eyebrow">
              <Bike size={16} />
              {content.delivery.eyebrow}
            </p>
            <h2>{content.delivery.title}</h2>
          </div>
          <div className="delivery-panel image-reveal">
            <div>
              <span>{content.delivery.hours}</span>
              <small>{content.delivery.hoursLabel}</small>
            </div>
            <p>{content.delivery.body}</p>
            <div className="delivery-actions">
              <a href="https://www.instagram.com/crema_gazi/" target="_blank" rel="noreferrer" aria-label={content.meta.instagram}>
                <AtSign size={18} />
              </a>
              <a href="tel:+302103467213" aria-label={content.meta.call}>
                <Phone size={18} />
              </a>
              <a href="https://wolt.com/en/grc/athens/restaurant/crema" target="_blank" rel="noreferrer" aria-label={content.meta.orderWolt}>
                <ShoppingBag size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span className="script-word">Crema</span>
        <p>{content.footer.address}</p>
      </footer>
    </div>
  )
}

export default App
