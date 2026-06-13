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
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import clsx from 'clsx'
import { greekContent, supportedLanguages, type LanguageCode } from './content'

const asset = (name: string) => `/assets/sourced/${name}`
const heroPoster = asset('crema-scroll-cover.avif')
const heroSequenceFrameCount = 120
const heroSequenceFrame = (frame: number) =>
  `/assets/generated/hero-sequence/frame-${String(frame).padStart(3, '0')}.webp`

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
  const statusLabel: Record<TranslationState, string> = {
    idle: 'Ελληνικό πρωτότυπο',
    loading: 'Google Translate φορτώνει',
    ready: 'Google Translate ενεργό',
    error: 'Μετάφραση μη διαθέσιμη',
  }

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
        <span className={clsx('language-state-dot', `is-${state}`)} title={statusLabel[state]} />
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
                <span className="language-code">{item.code.toUpperCase()}</span>
                {isSelected && <Check size={15} aria-hidden="true" />}
              </button>
            )
          })}
          {state !== 'idle' && (
            <p className="language-panel-status" role="status">
              <span className={clsx('language-state-dot', `is-${state}`)} />
              {statusLabel[state]}
            </p>
          )}
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
    const initWidget = () => {
      const host = document.getElementById('google_translate_element')
      const TranslateElement = window.google?.translate?.TranslateElement
      if (!host || !TranslateElement) return
      if (host.dataset.ready === 'true') {
        onStateChange(language === 'el' ? 'idle' : 'ready')
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
        onStateChange(language === 'el' ? 'idle' : 'ready')
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
      script.onerror = () => {
        if (language !== 'el') {
          onStateChange('error')
        }
      }
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
      <img className="hero-poster" src={heroPoster} alt="" />
      <canvas className="hero-sequence-canvas" data-frame="0" />
      <div className="hero-media-shade" />
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
    if (reduceMotion || !rootRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.1,
    })
    lenis.on('scroll', ScrollTrigger.update)

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    let cleanupHeroSequence: (() => void) | undefined
    let heroSequenceRaf = 0

    const context = gsap.context(() => {
      gsap.set('.reveal-line', { yPercent: 112, rotate: 2 })
      gsap.set('.story-section', { opacity: 0, y: 64 })
      gsap.set(rootRef.current, {
        '--hero-scroll-darken': 0,
        '--sequence-canvas-opacity': 0.94,
        '--sequence-shade-opacity': 1,
      })
      gsap.to('.reveal-line', {
        yPercent: 0,
        rotate: 0,
        duration: 1.25,
        stagger: 0.1,
        ease: 'power4.out',
      })

      gsap.from('.hero-media', {
        opacity: 0.72,
        scale: 1.08,
        duration: 1.5,
        ease: 'power3.out',
      })

      gsap.from('.hero-delivery-chip', {
        y: 34,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        delay: 0.35,
      })

      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.2,
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el) => {
        const depth = Number(el.dataset.float ?? 1)
        gsap.to(el, {
          y: -80 * depth,
          rotate: depth * 2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      const heroCanvas = document.querySelector<HTMLCanvasElement>('.hero-sequence-canvas')
      const heroMedia = document.querySelector<HTMLElement>('.hero-media')
      const heroContext = heroCanvas?.getContext('2d', { alpha: false })
      const heroFrames: Array<HTMLImageElement | undefined> = []
      let activeHeroFrame = -1
      let targetHeroFrame = 0
      let targetHeroFrameProgress = 0
      let heroPreloadTimer = 0
      let heroPreloadCursor = 1
      let heroSequenceCancelled = false

      const paintCoverFrame = (image: HTMLImageElement) => {
        if (!heroCanvas || !heroContext || !image.naturalWidth || !image.naturalHeight) return

        const rect = heroCanvas.getBoundingClientRect()
        const scale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
        const width = image.naturalWidth * scale
        const height = image.naturalHeight * scale
        const x = (rect.width - width) / 2
        const y = (rect.height - height) / 2

        heroContext.drawImage(image, x, y, width, height)
      }

      const drawHeroFrame = (frameProgress: number, force = false) => {
        if (!heroCanvas || !heroContext || !heroMedia) return

        const clampedProgress = Math.min(heroSequenceFrameCount - 1, Math.max(0, frameProgress))
        const lowerFrameIndex = Math.floor(clampedProgress)
        const upperFrameIndex = Math.min(heroSequenceFrameCount - 1, lowerFrameIndex + 1)
        const mix = clampedProgress - lowerFrameIndex
        const lowerFrame = heroFrames[lowerFrameIndex]
        const upperFrame = heroFrames[upperFrameIndex]

        if (!lowerFrame?.complete || !lowerFrame.naturalWidth) return
        if (!force && Math.abs(activeHeroFrame - clampedProgress) < 0.001) return

        const rect = heroCanvas.getBoundingClientRect()
        heroContext.globalAlpha = 1
        heroContext.clearRect(0, 0, rect.width, rect.height)
        paintCoverFrame(lowerFrame)

        if (mix > 0 && upperFrame?.complete && upperFrame.naturalWidth) {
          heroContext.globalAlpha = mix
          paintCoverFrame(upperFrame)
          heroContext.globalAlpha = 1
        }

        activeHeroFrame = clampedProgress
        heroCanvas.dataset.frame = String(Math.round(clampedProgress))
        heroCanvas.dataset.frameProgress = clampedProgress.toFixed(3)
        heroMedia.classList.add('is-canvas-ready')
      }

      const loadHeroFrame = (frameIndex: number) => {
        if (heroFrames[frameIndex]) return heroFrames[frameIndex]

        const image = new Image()
        image.decoding = 'async'
        ;(image as HTMLImageElement & { fetchPriority?: string }).fetchPriority = frameIndex < 10 ? 'high' : 'low'
        image.src = heroSequenceFrame(frameIndex + 1)
        image.onload = () => {
          if (heroSequenceCancelled) return
          if (
            frameIndex === Math.floor(targetHeroFrameProgress) ||
            frameIndex === Math.ceil(targetHeroFrameProgress) ||
            activeHeroFrame === -1
          ) {
            drawHeroFrame(activeHeroFrame === -1 ? frameIndex : targetHeroFrameProgress, true)
          }
        }
        heroFrames[frameIndex] = image
        return image
      }

      const resizeHeroCanvas = () => {
        if (!heroCanvas || !heroContext) return

        const rect = heroCanvas.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const width = Math.max(1, Math.round(rect.width * dpr))
        const height = Math.max(1, Math.round(rect.height * dpr))

        if (heroCanvas.width !== width || heroCanvas.height !== height) {
          heroCanvas.width = width
          heroCanvas.height = height
        }

        heroContext.setTransform(dpr, 0, 0, dpr, 0, 0)
        drawHeroFrame(activeHeroFrame >= 0 ? activeHeroFrame : 0, true)
      }

      const queueHeroFrame = (progress: number) => {
        targetHeroFrameProgress = Math.min(heroSequenceFrameCount - 1, Math.max(0, progress * (heroSequenceFrameCount - 1)))
        targetHeroFrame = Math.round(targetHeroFrameProgress)

        if (!heroSequenceRaf) {
          heroSequenceRaf = requestAnimationFrame(() => {
            heroSequenceRaf = 0
            loadHeroFrame(Math.floor(targetHeroFrameProgress))
            loadHeroFrame(Math.ceil(targetHeroFrameProgress))
            drawHeroFrame(targetHeroFrameProgress)

            for (let offset = 1; offset <= 5; offset += 1) {
              if (targetHeroFrame + offset < heroSequenceFrameCount) loadHeroFrame(targetHeroFrame + offset)
              if (targetHeroFrame - offset >= 0) loadHeroFrame(targetHeroFrame - offset)
            }
          })
        }
      }

      const preloadHeroFrames = () => {
        if (heroSequenceCancelled) return

        const batchSize = heroPreloadCursor < 18 ? 2 : 1
        for (let count = 0; count < batchSize && heroPreloadCursor < heroSequenceFrameCount; count += 1) {
          loadHeroFrame(heroPreloadCursor)
          heroPreloadCursor += 1
        }

        if (heroPreloadCursor < heroSequenceFrameCount) {
          heroPreloadTimer = window.setTimeout(preloadHeroFrames, heroPreloadCursor < 18 ? 120 : 190)
        }
      }

      loadHeroFrame(0)
      resizeHeroCanvas()
      heroPreloadTimer = window.setTimeout(preloadHeroFrames, 850)
      window.addEventListener('resize', resizeHeroCanvas)

      const sequenceFrameForRange = (progress: number, startFrame: number, endFrame: number) =>
        startFrame + Math.min(1, Math.max(0, progress)) * (endFrame - startFrame)

      const revealThenFadeDarken = (progress: number) => {
        const clamped = Math.min(1, Math.max(0, progress))
        if (clamped < 0.42) return 0.92 - (clamped / 0.42) * 0.56
        if (clamped > 0.82) return 0.36 + ((clamped - 0.82) / 0.18) * 0.48
        return 0.36
      }

      const sequenceTriggers = [
        ScrollTrigger.create({
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            queueHeroFrame(sequenceFrameForRange(self.progress, 0, 45) / (heroSequenceFrameCount - 1))
            gsap.set(rootRef.current, {
              '--hero-scroll-darken': self.progress * 0.8,
              '--sequence-canvas-opacity': 0.94,
              '--sequence-shade-opacity': 1,
            })
          },
        }),
        ScrollTrigger.create({
          trigger: '.signature-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            queueHeroFrame(sequenceFrameForRange(self.progress, 45, 84) / (heroSequenceFrameCount - 1))
            gsap.set(rootRef.current, {
              '--hero-scroll-darken': revealThenFadeDarken(self.progress),
              '--sequence-canvas-opacity': 0.9,
              '--sequence-shade-opacity': 0.82,
            })
          },
        }),
        ScrollTrigger.create({
          trigger: '.delivery-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            queueHeroFrame(sequenceFrameForRange(self.progress, 84, heroSequenceFrameCount - 1) / (heroSequenceFrameCount - 1))
            gsap.set(rootRef.current, {
              '--hero-scroll-darken': revealThenFadeDarken(self.progress),
              '--sequence-canvas-opacity': 0.88,
              '--sequence-shade-opacity': 0.74,
            })
          },
        }),
      ]

      const resetSequenceTrigger = ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onLeaveBack: () => {
          queueHeroFrame(0)
          gsap.set(rootRef.current, {
            '--hero-scroll-darken': 0,
            '--sequence-canvas-opacity': 0.94,
            '--sequence-shade-opacity': 1,
          })
        },
      })

      cleanupHeroSequence = () => {
        heroSequenceCancelled = true
        cancelAnimationFrame(heroSequenceRaf)
        window.clearTimeout(heroPreloadTimer)
        window.removeEventListener('resize', resizeHeroCanvas)
        sequenceTriggers.forEach((trigger) => trigger.kill())
        resetSequenceTrigger.kill()
      }

      gsap.to('.hero-media', {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-copy', {
        y: -36,
        opacity: 0.36,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.story-section', {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.story-section',
          start: 'top 92%',
          end: 'top 68%',
          scrub: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('.image-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(16% 12% 16% 12%)', scale: 1.08 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('.section-copy').forEach((el) => {
        gsap.from(el, {
          y: 42,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
          },
        })
      })

    }, rootRef)

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5
      const y = event.clientY / window.innerHeight - 0.5
      rootRef.current?.style.setProperty('--pointer-x', x.toFixed(3))
      rootRef.current?.style.setProperty('--pointer-y', y.toFixed(3))
    }

    window.addEventListener('pointermove', onPointerMove)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(rafId)
      cancelAnimationFrame(heroSequenceRaf)
      cleanupHeroSequence?.()
      lenis.destroy()
      context.revert()
    }
  }, [])

  return (
    <div className="site-shell" ref={rootRef}>
      <div className="scroll-progress" />
      <HeroScrollMedia />
      <GoogleTranslateBridge language={language} onStateChange={setTranslationState} />

      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Crema Gazi home">
          <img className="brand-logo" src="/assets/generated/crema-logo-trimmed.png" alt="" />
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
            {language !== 'el' && translationState !== 'idle' && (
              <p className="translation-status" role="status">
                {translationState === 'loading' && content.language.loading}
                {translationState === 'ready' && content.language.ready}
                {translationState === 'error' && content.language.fallback}
              </p>
            )}
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
            <img className="story-logo" src="/assets/generated/crema-logo-trimmed.png" alt={content.story.logoAlt} />
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
                <img src={signatureImages[index]} alt="" />
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
                <img src={productImages[index]} alt="" loading="lazy" />
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
              <img src={src} alt={`${content.galleryAlt} ${index + 1}`} loading="lazy" />
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
