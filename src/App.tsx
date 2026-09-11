import { useEffect, useRef, useState } from 'react'
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
  Plus,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import { greekContent, supportedLanguages } from './content'
import type { LanguageCode } from './content'

const baseUrl = import.meta.env.BASE_URL
const asset = (name: string) => `${baseUrl}assets/sourced/${name}`
const generatedAsset = (name: string) => `${baseUrl}assets/generated/${name}`
const heroPoster = asset('crema-scroll-cover.avif')
const dimelloCoffee = asset('dimello-coffee.avif')
const brandLogo = generatedAsset('crema-logo-optimized.webp')
const heroBrandLogo = generatedAsset('crema-hero-logo-coffee-crepes-pastry-shop.png')
const heroHeritageLine = generatedAsset('crema-hero-athens-since-2009.png')
const heroDessertQuote = generatedAsset('crema-hero-dessert-quote.png')
const provioStrawberryChocolateCup = generatedAsset('provio-strawberry-chocolate-cup.avif')
const crepeImages = [
  generatedAsset('crema-crepe-savory-generated.avif'),
  generatedAsset('crema-crepe-sweet-generated.avif'),
]
const heroImageBaseScale = 1.015
const heroImageZoomScale = 1.1
const heroImageMaxBlur = 2.25
const heroImageSmoothingTimeConstant = 120
const heroImageSettleThreshold = 0.001
const orderPlatforms = [
  { id: 'efood', label: 'e-food', href: 'https://www.e-food.gr/delivery/menu/crema', logo: asset('efood-logo-official.svg') },
  { id: 'box', label: 'BOX', href: 'https://box.gr/delivery/gkazi/crema-gkazi', logo: asset('box-logo-official.svg') },
  { id: 'wolt', label: 'Wolt', href: 'https://wolt.com/el/grc/athens/restaurant/crema', logo: asset('wolt-logo-official.png') },
] as const

const signatureImages = [
  dimelloCoffee,
  asset('crema-oat-bar-strawberry.avif'),
  asset('crema-arabic-wrap-wolt.avif'),
  provioStrawberryChocolateCup,
]

const galleryImages = [
  asset('crema-cheesecake-wolt.avif'),
  asset('crema-milkshake-wolt.avif'),
  asset('crema-yogurt-bowl-wolt.avif'),
  asset('crema-mousse-cookies-wolt.avif'),
  asset('crema-lemon-pie-wolt.avif'),
  asset('crema-donut-bueno-wolt.avif'),
]

const productImages = [
  asset('crema-waffle-wolt.avif'),
  asset('crema-caesar-wolt.avif'),
  asset('crema-banoffee-wolt.avif'),
  asset('crema-fruit-salad-wolt.avif'),
  asset('crema-mixed-juice-wolt.avif'),
]

const navTargets = ['story', 'signatures', 'gazi']
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

function OrderMenu({ label }: { label: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !menuRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <div className="order-picker" ref={menuRef}>
      <button
        ref={triggerRef}
        className="magnetic-link magnetic-link-primary order-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="hero-order-options"
        onClick={() => setIsOpen((value) => !value)}
      >
        <ShoppingBag size={18} />
        <span>{label}</span>
        <ChevronDown className={clsx('order-chevron', isOpen && 'is-open')} size={16} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="order-panel" id="hero-order-options">
          {orderPlatforms.map((platform) => (
            <a
              className="order-option"
              data-platform={platform.id}
              href={platform.href}
              target="_blank"
              rel="noreferrer"
              key={platform.id}
              onClick={() => setIsOpen(false)}
            >
              <span className={clsx('order-platform-mark', `is-${platform.id}`)} aria-hidden="true">
                <img className="order-platform-logo" src={platform.logo} alt="" width="64" height="40" decoding="async" />
              </span>
              <span className="order-platform-copy">
                <strong>{platform.label}</strong>
                <small>Παράγγειλε μέσω {platform.label}</small>
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </div>
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

function HeroScrollImage() {
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const heroImage = imageRef.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frameId = 0
    let targetEffectProgress = 0
    let renderedEffectProgress = 0
    let lastFrameTimestamp = 0

    const renderImageEffect = (timestamp: number) => {
      frameId = 0
      if (!heroImage) return

      const progressDelta = targetEffectProgress - renderedEffectProgress
      const frameDuration = lastFrameTimestamp ? Math.min(timestamp - lastFrameTimestamp, 160) : 1000 / 60
      const interpolationAlpha = 1 - Math.exp(-frameDuration / heroImageSmoothingTimeConstant)
      lastFrameTimestamp = timestamp
      renderedEffectProgress = Math.abs(progressDelta) <= heroImageSettleThreshold
        ? targetEffectProgress
        : renderedEffectProgress + progressDelta * interpolationAlpha

      const scale = heroImageBaseScale + (heroImageZoomScale - heroImageBaseScale) * renderedEffectProgress
      const blur = heroImageMaxBlur * renderedEffectProgress
      heroImage.style.setProperty('--hero-image-scale', scale.toFixed(4))
      heroImage.style.setProperty('--hero-image-blur', `${blur.toFixed(2)}px`)

      if (Math.abs(targetEffectProgress - renderedEffectProgress) > heroImageSettleThreshold) {
        frameId = window.requestAnimationFrame(renderImageEffect)
      } else {
        heroImage.classList.remove('is-transforming')
        lastFrameTimestamp = 0
      }
    }

    const requestAnimation = () => {
      if (frameId || Math.abs(targetEffectProgress - renderedEffectProgress) <= heroImageSettleThreshold) return
      heroImage?.classList.add('is-transforming')
      frameId = window.requestAnimationFrame(renderImageEffect)
    }

    const syncScrollTargets = () => {
      const signatureSection = document.querySelector<HTMLElement>('.signature-section')
      const reverseStart = Math.max(
        (signatureSection?.offsetTop ?? window.innerHeight * 2) - window.innerHeight,
        window.innerHeight * 0.65,
      )
      const reverseEnd = Math.max(signatureSection?.offsetTop ?? reverseStart + window.innerHeight, reverseStart + 1)

      targetEffectProgress = window.scrollY <= reverseStart
        ? Math.min(1, Math.max(0, window.scrollY / reverseStart))
        : 1 - Math.min(1, Math.max(0, (window.scrollY - reverseStart) / (reverseEnd - reverseStart)))
      requestAnimation()
    }

    window.addEventListener('scroll', syncScrollTargets, { passive: true })
    window.addEventListener('resize', syncScrollTargets, { passive: true })
    syncScrollTargets()

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', syncScrollTargets)
      window.removeEventListener('resize', syncScrollTargets)
    }
  }, [])

  return (
    <div className="hero-media" aria-hidden="true">
      <img ref={imageRef} className="hero-poster" src={heroPoster} alt="" decoding="async" fetchPriority="high" />
      <div className="hero-media-shade" />
    </div>
  )
}

function useRevealEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    const targets = document.querySelectorAll<HTMLElement>('.image-reveal, .section-copy')
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

interface CrepeCardProps {
  card: (typeof greekContent.crepes.cards)[number]
  closeLabel: string
  hint: string
  image: string
  scrollHint: string
}

function CrepeCard({ card, closeLabel, hint, image, scrollHint }: CrepeCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const ingredientsId = `crepe-${card.id}-ingredients`

  return (
    <article
      className={clsx('crepe-card', `crepe-card--${card.id}`, isOpen && 'is-open')}
      data-crepe={card.id}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) setIsOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return
        setIsOpen(false)
        triggerRef.current?.focus()
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setIsOpen(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse' && !event.currentTarget.contains(document.activeElement)) setIsOpen(false)
      }}
    >
      <img src={image} alt={card.imageAlt} width="1024" height="1536" loading="lazy" decoding="async" />
      <div className="crepe-card-shade" aria-hidden="true" />

      <div className="crepe-card-intro">
        <span className="crepe-card-number">{card.number}</span>
        <div>
          <h3>{card.title}</h3>
          <p>{hint}</p>
        </div>
      </div>

      <button
        ref={triggerRef}
        className="crepe-card-trigger"
        type="button"
        aria-controls={ingredientsId}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? closeLabel : hint}: ${card.title}`}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>

      <div
        className="crepe-ingredients"
        id={ingredientsId}
        role="region"
        aria-hidden={!isOpen}
        aria-label={`Υλικά για ${card.title}`}
      >
        <div className="crepe-ingredients-heading">
          <span>{card.number} / Υλικά</span>
          <h3>{card.title}</h3>
          <p>{scrollHint}</p>
        </div>

        <div className="crepe-ingredients-scroll" tabIndex={isOpen ? 0 : -1}>
          {card.categories.map((category) => (
            <section className="crepe-ingredient-group" key={category.title}>
              <div>
                <h4>{category.title}</h4>
                <span>{category.items.length}</span>
              </div>
              <ul>
                {category.items.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </article>
  )
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
      <HeroScrollImage />
      <GoogleTranslateBridge language={language} onStateChange={setTranslationState} />

      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Crema Gazi home">
          <img className="brand-logo" src={brandLogo} alt="" width="400" height="342" decoding="async" fetchPriority="high" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navTargets.map((target, index) => (
            <a key={target} href={`#${target}`}>
              {content.nav[index]}
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
            <h1 className="hero-title" id="hero-title">
              <span className="hero-title-logo-wrap">
                <img
                  className="hero-title-logo"
                  src={heroBrandLogo}
                  alt={content.hero.brand}
                  width="1473"
                  height="1068"
                  decoding="async"
                  fetchPriority="high"
                />
                <span className="hero-heritage-line-wrap">
                  <img
                    className="hero-heritage-line"
                    src={heroHeritageLine}
                    alt="Από το 2009, στην καρδιά της Αθήνας"
                    width="2170"
                    height="725"
                    decoding="async"
                  />
                </span>
                <span className="hero-dessert-quote-wrap">
                  <span
                    className="hero-dessert-quote"
                    role="img"
                    aria-label="LIFE IS UNCERTAIN. EAT DESSERT FIRST."
                  >
                    <span className="hero-dessert-quote-part is-life" aria-hidden="true">
                      <img src={heroDessertQuote} alt="" width="2172" height="724" decoding="async" />
                    </span>
                    <span className="hero-dessert-quote-part is-eat" aria-hidden="true">
                      <img src={heroDessertQuote} alt="" width="2172" height="724" decoding="async" />
                    </span>
                  </span>
                </span>
              </span>
            </h1>
            <div className="hero-actions">
              <OrderMenu label={content.hero.order} />
            </div>
          </div>

          <div className="delivery-chip hero-delivery-chip" aria-hidden="true">
            <Bike size={20} />
            <span>{content.hero.location}</span>
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
            </div>
          </div>
        </section>

        <section className="crepe-explorer" id="crepes" aria-labelledby="crepes-title">
          <div className="crepe-explorer-heading">
            <div>
              <p className="eyebrow">
                <Star size={16} />
                {content.crepes.eyebrow}
              </p>
              <h2 id="crepes-title">{content.crepes.title}</h2>
            </div>
            <p className="crepe-slogan">{content.crepes.slogan}</p>
          </div>

          <div className="crepe-grid">
            {content.crepes.cards.map((card, index) => (
              <CrepeCard
                card={card}
                closeLabel={content.crepes.close}
                hint={content.crepes.hint}
                image={crepeImages[index]}
                key={card.id}
                scrollHint={content.crepes.scrollHint}
              />
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

        <section className="gallery-section" aria-label={content.gallery.label}>
          {galleryImages.map((src, index) => (
            <figure className="gallery-tile image-reveal" key={src}>
              <img src={src} alt={content.gallery.items[index]} width="960" height="540" loading="lazy" decoding="async" />
              <figcaption>{content.gallery.items[index]}</figcaption>
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
            <div className="location-hours">
              <Clock3 size={18} aria-hidden="true" />
              <span>{content.location.hours}</span>
            </div>
            <div className="location-actions">
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
        <a
          className="footer-instagram"
          href="https://www.instagram.com/crema_gazi/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram @crema_gazi"
        >
          <span className="footer-instagram-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.25">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span>@crema_gazi</span>
        </a>
      </footer>
    </div>
  )
}

export default App
