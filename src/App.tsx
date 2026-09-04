import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
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
import { greekContent, supportedLanguages } from './content'
import type { LanguageCode } from './content'

const baseUrl = import.meta.env.BASE_URL
const asset = (name: string) => `${baseUrl}assets/sourced/${name}`
const generatedAsset = (name: string) => `${baseUrl}assets/generated/${name}`
const heroPoster = asset('crema-scroll-cover.avif')
const heroVideo = generatedAsset('crema-hero-crepe.mp4')
const dimelloCoffee = asset('dimello-coffee.avif')
const brandLogo = generatedAsset('crema-logo-optimized.webp')
const provioLogo = asset('provio-logo-reference.png')
const heroScrollScreens = 4

const signatureImages = [
  dimelloCoffee,
  asset('crema-oat-bar-strawberry.avif'),
  asset('crema-arabic-wrap-wolt.avif'),
  asset('crema-club-xl-wolt.avif'),
]

const gallery = [
  dimelloCoffee,
  asset('crema-oat-bar-strawberry.avif'),
  asset('crema-arabic-wrap-wolt.avif'),
  asset('crema-club-xl-wolt.avif'),
  asset('crema-ice-cream-wolt.avif'),
  asset('provio-amarena-wolt.avif'),
]

const productImages = [
  dimelloCoffee,
  asset('crema-oat-bar-strawberry.avif'),
  asset('crema-arabic-wrap-wolt.avif'),
  asset('crema-club-xl-wolt.avif'),
  asset('provio-amarena-wolt.avif'),
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
  return (
    <a
      href={href}
      className={clsx('magnetic-link', `magnetic-link-${variant}`)}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
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
    if (language === 'el') {
      onStateChange('idle')
      return
    }

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
      script.onerror = () => {
        onStateChange('error')
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
  const videoRef = useRef<HTMLVideoElement>(null)
  const sinceRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const sinceMark = sinceRef.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frameId = 0

    const syncVideoToScroll = () => {
      frameId = 0

      const fadeRange = Math.max(window.innerHeight * 0.72, 1)
      const fadeProgress = Math.min(1, Math.max(0, window.scrollY / fadeRange))
      const easedFade = fadeProgress * fadeProgress * (3 - 2 * fadeProgress)

      if (sinceMark) {
        sinceMark.style.opacity = String(1 - easedFade)
        sinceMark.style.transform = `translate3d(0, ${-18 * easedFade}px, 0)`
      }

      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return

      const scrollRange = Math.max(window.innerHeight * heroScrollScreens, 1)
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollRange))
      const targetTime = progress * Math.max(video.duration - 0.04, 0)

      if (Math.abs(video.currentTime - targetTime) > 0.015) {
        video.currentTime = targetTime
      }
    }

    const requestSync = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(syncVideoToScroll)
    }

    video?.pause()
    video?.addEventListener('loadedmetadata', requestSync)
    window.addEventListener('scroll', requestSync, { passive: true })
    window.addEventListener('resize', requestSync, { passive: true })
    requestSync()

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      video?.removeEventListener('loadedmetadata', requestSync)
      window.removeEventListener('scroll', requestSync)
      window.removeEventListener('resize', requestSync)
    }
  }, [])

  return (
    <>
      <div className="hero-media" aria-hidden="true">
        <img className="hero-poster" src={heroPoster} alt="" decoding="async" fetchPriority="high" />
        <video
          ref={videoRef}
          className="hero-video"
          src={heroVideo}
          poster={heroPoster}
          muted
          playsInline
          preload="auto"
        />
        <div className="hero-media-shade" />
      </div>
      <p ref={sinceRef} className="since-scroll-mark" aria-label="Crema, since 2009">
        <span>Since</span>
        <strong>2009</strong>
      </p>
    </>
  )
}

function useRevealEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    const targets = document.querySelectorAll<HTMLElement>('.image-reveal, .section-copy, .delivery-panel')
    root.classList.add('reveal-effects')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    targets.forEach((target, index) => {
      target.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`)
      observer.observe(target)
    })

    return () => {
      observer.disconnect()
      root.classList.remove('reveal-effects')
    }
  }, [])
}

function App() {
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage)
  const [translationState, setTranslationState] = useState<TranslationState>('idle')
  const content = greekContent
  useRevealEffects()

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


  return (
    <div className="site-shell">
      <HeroScrollMedia />
      <GoogleTranslateBridge language={language} onStateChange={setTranslationState} />

      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Crema Gazi home">
          <img className="brand-logo" src={brandLogo} alt="" width="400" height="342" decoding="async" fetchPriority="high" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {content.nav.map((item, index) => (
            <a key={navTargets[index]} href={`#${navTargets[index]}`}>
              {item}
            </a>
          ))}
          <a className="nav-menu-link" href="https://www.e-food.gr/delivery/menu/crema" target="_blank" rel="noreferrer" aria-label="Crema menu">
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
          <a className="icon-action menu-icon-action" href="https://www.e-food.gr/delivery/menu/crema" target="_blank" rel="noreferrer" aria-label="Crema menu">
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
            <div className="hero-kickers">
              <p className="eyebrow">
                <Clock3 size={16} />
                {content.hero.eyebrow}
              </p>
            </div>
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
              <MagneticLink href="https://wolt.com/el/grc/athens/restaurant/crema">
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

          <div className="delivery-chip hero-delivery-chip" aria-hidden="true">
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
            <div className="marquee-group">
              <span>{content.marquee[0]}</span>
              <Star size={18} />
              <span>{content.marquee[1]}</span>
              <Star size={18} />
              <span>{content.marquee[2]}</span>
              <Star size={18} />
              <span>{content.marquee[3]}</span>
              <Star size={18} />
              <span>{content.marquee[4]}</span>
            </div>
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
            <img className="story-logo" src={brandLogo} alt={content.story.logoAlt} width="400" height="342" loading="lazy" decoding="async" />
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
                <img src={signatureImages[index]} alt="" width="960" height="540" loading="lazy" decoding="async" />
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
                <img src={productImages[index]} alt="" width="960" height="540" loading="lazy" decoding="async" />
                <div className="product-card-copy">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                  <a href="https://wolt.com/el/grc/athens/restaurant/crema" target="_blank" rel="noreferrer">
                    {content.products.cta}
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="provio-spotlight" aria-labelledby="provio-title">
          <div className="provio-mark image-reveal">
            <img src={provioLogo} alt={content.provio.logoAlt} width="150" height="151" loading="lazy" decoding="async" />
          </div>
          <div className="provio-copy section-copy">
            <p className="eyebrow">
              <Star size={16} />
              {content.provio.eyebrow}
            </p>
            <h2 id="provio-title">{content.provio.title}</h2>
            <p>{content.provio.body}</p>
          </div>
        </section>

        <section className="gallery-section" aria-label="Crema product gallery">
          {gallery.map((src, index) => (
            <figure className="gallery-tile image-reveal" key={src}>
              <img src={src} alt={`${content.galleryAlt} ${index + 1}`} width="960" height="540" loading="lazy" decoding="async" />
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
              <a href="https://wolt.com/el/grc/athens/restaurant/crema" target="_blank" rel="noreferrer" aria-label={content.meta.orderWolt}>
                <ShoppingBag size={18} />
              </a>
              <a href="https://www.e-food.gr/delivery/menu/crema" target="_blank" rel="noreferrer" aria-label={content.meta.orderEfood}>
                <BookOpenText size={18} />
              </a>
              <a href="https://box.gr/delivery/gkazi/crema-gkazi" target="_blank" rel="noreferrer" aria-label={content.meta.orderBox}>
                <Bike size={18} />
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
