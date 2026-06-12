import { useEffect, useRef } from 'react'
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

const asset = (name: string) => `/assets/sourced/${name}`

const heroShots = [
  {
    src: asset('crema-dessert-18.jpg'),
    alt: 'Freddo drink photographed on marble',
    className: 'hero-shot hero-shot-one',
  },
  {
    src: asset('crema-crepe-05.jpg'),
    alt: 'Golden pastry photographed on marble',
    className: 'hero-shot hero-shot-two',
  },
  {
    src: asset('crema-waffle-13.jpg'),
    alt: 'Espresso cup photographed on marble',
    className: 'hero-shot hero-shot-three',
  },
]

const signatures = [
  {
    title: 'Espresso ritual',
    detail: 'illy shot, marble counter, clean finish',
    src: asset('crema-waffle-13.jpg'),
  },
  {
    title: 'Iced crema',
    detail: 'cold coffee, cinnamon foam, late-night energy',
    src: asset('crema-dessert-18.jpg'),
  },
  {
    title: 'Pastry hit',
    detail: 'warm, buttery, fast to your door',
    src: asset('crema-crepe-05.jpg'),
  },
  {
    title: 'Dessert first',
    detail: 'crepes, waffles, pastry shop mood',
    src: asset('crema-dessert-22.jpg'),
  },
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

const navItems = ['Story', 'Signatures', 'Gazi', 'Delivery']

function MagneticLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: React.ReactNode
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
          <img src={asset('crema-instagram-profile.jpg')} alt="" />
          <span>Crema</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <a className="icon-action" href="tel:+302103467213" aria-label="Call Crema Gazi">
          <Phone size={18} />
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-noise" />
          <div className="hero-copy">
            <p className="eyebrow">
              <Clock3 size={16} />
              24hr delivery · Gazi Athens
            </p>
            <h1 id="hero-title">
              <span className="line-mask">
                <span className="reveal-line script-word">Crema</span>
              </span>
              <span className="line-mask">
                <span className="reveal-line">Eat dessert</span>
              </span>
              <span className="line-mask">
                <span className="reveal-line accent-line">first.</span>
              </span>
            </h1>
            <p className="hero-subcopy">
              Crepes, waffles, coffee and pastry shop on Persefonis 63, built for
              the hour when Gazi still wants something warm, sweet and fast.
            </p>
            <div className="hero-actions">
              <MagneticLink href="https://wolt.com/en/grc/athens/restaurant/crema">
                <ShoppingBag size={18} />
                Order on Wolt
                <ArrowUpRight size={16} />
              </MagneticLink>
              <MagneticLink href="https://www.e-food.gr/delivery/menu/crema" variant="secondary">
                efood
                <ArrowUpRight size={16} />
              </MagneticLink>
            </div>
          </div>

          <div className="hero-stage" aria-hidden="true">
            <div className="stage-ring" />
            {heroShots.map((shot, index) => (
              <img
                key={shot.src}
                className={shot.className}
                src={shot.src}
                alt={shot.alt}
                data-float={index + 0.5}
              />
            ))}
            <div className="delivery-chip" data-float="0.8">
              <Bike size={20} />
              <span>Persefonis 63</span>
            </div>
          </div>

          <div className="hero-footer">
            <span>Life is uncertain.</span>
            <span>Eat dessert first.</span>
            <span>210 346 7213</span>
          </div>
        </section>

        <section className="marquee-band" aria-label="Crema signature categories">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="marquee-group" key={group}>
                <span>coffee</span>
                <Star size={18} />
                <span>crepes</span>
                <Star size={18} />
                <span>waffles</span>
                <Star size={18} />
                <span>pastry</span>
                <Star size={18} />
                <span>24hr delivery</span>
                <Star size={18} />
              </div>
            ))}
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="section-copy story-copy">
            <p className="eyebrow">
              <Coffee size={16} />
              Crema Gazi
            </p>
            <h2>Not a quiet coffee page. A late-night dessert signal.</h2>
            <p>
              The public brand cues are direct: black backdrop, green crema icon,
              orange delivery energy, white script logo. The website turns that into
              a sharper, premium storefront for the shop people already order from.
            </p>
          </div>
          <div className="story-visual image-reveal">
            <img src={asset('crema-instagram-profile.jpg')} alt="Crema Gazi logo from Instagram profile" />
            <div>
              <span>24hr delivery</span>
              <strong>crepes · waffles · coffee · pastry shop</strong>
            </div>
          </div>
        </section>

        <section className="signature-section" id="signatures">
          <div className="section-copy section-heading">
            <p className="eyebrow">
              <Star size={16} />
              Signatures
            </p>
            <h2>Marble, crema, heat, sugar. No generic delivery grid.</h2>
          </div>

          <div className="signature-grid">
            {signatures.map((item, index) => (
              <article className="signature-card image-reveal" key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <img src={item.src} alt="" />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section" aria-label="Crema product gallery">
          {gallery.map((src, index) => (
            <figure className="gallery-tile image-reveal" key={src}>
              <img src={src} alt={`Crema product detail ${index + 1}`} loading="lazy" />
            </figure>
          ))}
        </section>

        <section className="location-section" id="gazi">
          <div className="location-map image-reveal" aria-hidden="true">
            <span>Gazi</span>
            <div className="map-line map-line-one" />
            <div className="map-line map-line-two" />
            <div className="map-pin">
              <MapPin size={26} />
            </div>
          </div>
          <div className="section-copy location-copy">
            <p className="eyebrow">
              <MapPin size={16} />
              Persefonis 63
            </p>
            <h2>Made for the Gazi rhythm: coffee before, dessert after, delivery always.</h2>
            <p>
              Public listings place Crema at Persefonis 63, Gazi, Athens, with
              24-hour delivery and phone orders at 210 346 7213.
            </p>
            <div className="location-actions">
              <MagneticLink href="https://www.google.com/maps/search/?api=1&query=Crema%20Gazi%20Persefonis%2063%20Athens">
                <MapPin size={18} />
                Open map
                <ArrowUpRight size={16} />
              </MagneticLink>
              <MagneticLink href="tel:+302103467213" variant="secondary">
                <Phone size={18} />
                Call now
              </MagneticLink>
            </div>
          </div>
        </section>

        <section className="delivery-section" id="delivery">
          <div className="delivery-copy section-copy">
            <p className="eyebrow">
              <Bike size={16} />
              Open all day
            </p>
            <h2>When the city is still awake, Crema is still moving.</h2>
          </div>
          <div className="delivery-panel image-reveal">
            <div>
              <span>24</span>
              <small>hours</small>
            </div>
            <p>Order via Wolt or efood, or call the shop directly.</p>
            <div className="delivery-actions">
              <a href="https://www.instagram.com/crema_gazi/" target="_blank" rel="noreferrer" aria-label="Crema Gazi Instagram">
                <AtSign size={18} />
              </a>
              <a href="tel:+302103467213" aria-label="Call Crema Gazi">
                <Phone size={18} />
              </a>
              <a href="https://wolt.com/en/grc/athens/restaurant/crema" target="_blank" rel="noreferrer" aria-label="Order Crema on Wolt">
                <ShoppingBag size={18} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span className="script-word">Crema</span>
        <p>Persefonis 63, Gazi · 210 346 7213 · 24hr delivery</p>
      </footer>
    </div>
  )
}

export default App
