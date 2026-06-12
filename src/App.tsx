import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  AtSign,
  Bike,
  Clock3,
  Coffee,
  MapPin,
  Phone,
  ShoppingBag,
  Star,
} from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import clsx from 'clsx'
import { greekContent, supportedLanguages, type LanguageCode, type SiteContent } from './content'
import { translateContent } from './lib/googleTranslate'

const asset = (name: string) => `/assets/sourced/${name}`

const heroShots = [
  {
    src: asset('crema-dessert-18.jpg'),
    className: 'hero-shot hero-shot-one',
  },
  {
    src: asset('crema-crepe-05.jpg'),
    className: 'hero-shot hero-shot-two',
  },
  {
    src: asset('crema-waffle-13.jpg'),
    className: 'hero-shot hero-shot-three',
  },
]

const signatureImages = [
  asset('crema-waffle-13.jpg'),
  asset('crema-dessert-18.jpg'),
  asset('crema-crepe-05.jpg'),
  asset('crema-dessert-22.jpg'),
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
  asset('crema-dessert-18.jpg'),
  asset('crema-crepe-05.jpg'),
  asset('crema-waffle-13.jpg'),
  asset('crema-dessert-23.jpg'),
  asset('crema-dessert-24.jpg'),
  asset('crema-dessert-27.jpg'),
]

const navTargets = ['story', 'signatures', 'gazi', 'delivery']

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

function App() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState<LanguageCode>('el')
  const [content, setContent] = useState<SiteContent>(greekContent)
  const [translationState, setTranslationState] = useState<'idle' | 'loading' | 'ready' | 'missing-key' | 'error'>('idle')

  useEffect(() => {
    let ignore = false

    async function updateLanguage() {
      if (language === 'el') {
        setContent(greekContent)
        setTranslationState('idle')
        return
      }

      setTranslationState('loading')

      try {
        const translated = await translateContent<SiteContent>(greekContent, language)
        if (!ignore) {
          setContent(translated)
          setTranslationState('ready')
        }
      } catch (error) {
        if (!ignore) {
          setContent(greekContent)
          setTranslationState(
            error instanceof Error && error.message.includes('VITE_GOOGLE_TRANSLATE_API_KEY')
              ? 'missing-key'
              : 'error',
          )
        }
      }
    }

    void updateLanguage()

    return () => {
      ignore = true
    }
  }, [language])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !rootRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.1,
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const context = gsap.context(() => {
      gsap.set('.reveal-line', { yPercent: 112, rotate: 2 })
      gsap.to('.reveal-line', {
        yPercent: 0,
        rotate: 0,
        duration: 1.25,
        stagger: 0.1,
        ease: 'power4.out',
      })

      gsap.from('.hero-shot', {
        y: 80,
        opacity: 0,
        scale: 0.92,
        rotate: -3,
        duration: 1.15,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
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
      lenis.destroy()
      context.revert()
    }
  }, [])

  return (
    <div className="site-shell" ref={rootRef}>
      <div className="scroll-progress" />

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
        </nav>
        <div className="topbar-actions">
          <label className="language-picker">
            <span>{content.language.label}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as LanguageCode)}
              aria-label={content.language.label}
            >
              {supportedLanguages.map((item) => (
                <option value={item.code} key={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
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
            {translationState !== 'idle' && (
              <p className="translation-status" role="status">
                {translationState === 'loading' && content.language.loading}
                {translationState === 'ready' && content.language.ready}
                {translationState === 'missing-key' && content.language.apiMissing}
                {translationState === 'error' && content.language.fallback}
              </p>
            )}
          </div>

          <div className="hero-stage" aria-hidden="true">
            <div className="stage-ring" />
            {heroShots.map((shot, index) => (
              <img
                key={shot.src}
                className={shot.className}
                src={shot.src}
                alt={content.heroShots[index]}
                data-float={index + 0.5}
              />
            ))}
            <div className="delivery-chip" data-float="0.8">
              <Bike size={20} />
              <span>{content.hero.location}</span>
            </div>
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
          <div className="location-map image-reveal" aria-hidden="true">
            <span>{content.location.mapWord}</span>
            <div className="map-line map-line-one" />
            <div className="map-line map-line-two" />
            <div className="map-pin">
              <MapPin size={26} />
            </div>
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
