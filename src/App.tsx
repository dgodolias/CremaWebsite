import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  BookOpenText,
  Check,
  ChevronDown,
  Globe2,
  Phone,
} from 'lucide-react'
import { MotionConfig } from 'motion/react'
import clsx from 'clsx'

import { CremaMeltHero } from './components/CremaMeltHero'
import { CremaMeltSections } from './components/CremaMeltSections'
import { greekContent, supportedLanguages, type LanguageCode } from './content'

const baseUrl = import.meta.env.BASE_URL
const brandLogo = `${baseUrl}assets/generated/crema-logo-trimmed-512.png`
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
  const currentLanguage =
    supportedLanguages.find((item) => item.code === language) ?? supportedLanguages[0]

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
          <Globe2 size={15} aria-hidden="true" />
          <span>{currentLanguage.label}</span>
        </span>
        <span className={clsx('language-state-dot', `is-${state}`)} aria-hidden="true" />
        <ChevronDown
          className={clsx('language-chevron', isOpen && 'is-open')}
          size={15}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="language-panel notranslate"
          translate="no"
          role="listbox"
          aria-label={label}
        >
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
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
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
        element?.closest(
          'a, button, input, textarea, select, iframe, [role="button"], [role="option"]',
        ),
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

    const onPointerLeave = () => cursor.classList.remove('is-visible')
    const onPointerDown = () => cursor.classList.add('is-pressed')
    const onPointerUp = () => cursor.classList.remove('is-pressed')

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
    const root = rootRef.current
    const progress = root?.querySelector<HTMLElement>('.scroll-progress')
    const topbar = root?.querySelector<HTMLElement>('.topbar')
    if (!root || !progress || !topbar) return

    let rafId = 0
    const update = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      progress.style.transform = `scaleX(${ratio})`
      topbar.classList.toggle('is-scrolled', window.scrollY > 36)
      rafId = 0
    }

    const scheduleUpdate = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    root.classList.add('is-ready')
    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      root.classList.remove('is-ready')
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell melt-shell" ref={rootRef}>
        <div className="scroll-progress" />
        <GoogleTranslateBridge
          language={language}
          onStateChange={setTranslationState}
        />
        <CustomCursor />

        <header className="topbar">
          <a className="brand-lockup" href="#top" aria-label="Crema Gazi home">
            <img
              className="brand-logo"
              src={brandLogo}
              alt=""
              width="512"
              height="437"
              decoding="async"
            />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {content.nav.map((item, index) => (
              <a key={navTargets[index]} href={`#${navTargets[index]}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item}
              </a>
            ))}
          </nav>

          <div className="topbar-actions">
            <a
              className="topbar-menu-link"
              href="https://quar.gr/crema"
              target="_blank"
              rel="noreferrer"
              aria-label="Crema menu"
            >
              <BookOpenText size={16} aria-hidden="true" />
              <span>Μενού</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <LanguageMenu
              language={language}
              label={content.language.label}
              state={translationState}
              onChange={handleLanguageChange}
            />
            <a
              className="icon-action"
              href="tel:+302103467213"
              aria-label={content.meta.call}
            >
              <Phone size={18} aria-hidden="true" />
            </a>
          </div>
        </header>

        <main id="top">
          <CremaMeltHero content={content} />
          <CremaMeltSections content={content} />
        </main>

        <footer className="site-footer melt-footer">
          <div>
            <img src={brandLogo} alt="" width="512" height="437" loading="lazy" />
            <span translate="no">Melt / After dark</span>
          </div>
          <p>{content.footer.address}</p>
          <a
            href="https://www.instagram.com/crema_gazi/"
            target="_blank"
            rel="noreferrer"
            aria-label={content.meta.instagram}
          >
            @crema_gazi
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </MotionConfig>
  )
}

export default App
