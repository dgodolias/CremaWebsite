import { useEffect, useRef } from 'react'
import { ArrowDownRight, ArrowUpRight, Clock3, MapPin, Menu, Phone, Sparkles } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useReducedMotion } from 'motion/react'
import { FloatingPathsBackground } from './components/FloatingPathsBackground'
import './signal.css'

const baseUrl = import.meta.env.BASE_URL
const sourced = (name: string) => `${baseUrl}assets/sourced/${name}`
const generated = (name: string) => `${baseUrl}assets/generated/${name}`

const menuUrl = 'https://quar.gr/crema'
const woltUrl = 'https://wolt.com/en/grc/athens/restaurant/crema'
const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Crema%20Gazi%20Persefonis%2063%20Athens'

function OrderLink({
  href,
  children,
  tone = 'orange',
}: {
  href: string
  children: React.ReactNode
  tone?: 'orange' | 'ink'
}) {
  return (
    <a className={`signal-order-link signal-order-link-${tone}`} href={href} target="_blank" rel="noreferrer">
      <span className="signal-order-link-shadow" aria-hidden="true" />
      <span className="signal-order-link-face">
        {children}
        <ArrowUpRight size={17} strokeWidth={2.25} />
      </span>
    </a>
  )
}

function SignalPage() {
  const shellRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = Boolean(useReducedMotion())

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    const previousTitle = document.title
    document.title = 'Crema Signal — coffee, crepes & late-night Gazi'

    const move = (event: PointerEvent) => {
      shell.style.setProperty('--signal-pointer-x', `${(event.clientX / window.innerWidth) * 100}%`)
      shell.style.setProperty('--signal-pointer-y', `${(event.clientY / window.innerHeight) * 100}%`)
    }

    if (!prefersReducedMotion) window.addEventListener('pointermove', move, { passive: true })
    return () => {
      document.title = previousTitle
      window.removeEventListener('pointermove', move)
    }
  }, [prefersReducedMotion])

  return (
    <div
      className="signal-shell"
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      ref={shellRef}
    >
      <header className="signal-nav">
        <a className="signal-wordmark" href="#signal-top" aria-label="Crema Signal home">
          <img src={generated('crema-logo-trimmed.png')} alt="" />
          <span>Gazi / Athens</span>
        </a>
        <nav aria-label="Signal page">
          <a href="#menu">Menu</a>
          <a href="#ingredients">The mix</a>
          <a href="#visit">Visit</a>
        </nav>
        <a className="signal-nav-order" href={menuUrl} target="_blank" rel="noreferrer">
          <Menu size={15} />
          Open menu
        </a>
      </header>

      <main>
        <section className="signal-hero" id="signal-top">
          <FloatingPathsBackground className="signal-magic-paths" position={-1} />
          <div className="signal-hero-grid">
            <div className="signal-hero-copy">
              <p className="signal-kicker">
                <span />
                Crema Gazi — open around the clock
              </p>
              <h1>
                Sweet static.
                <em>Fresh signal.</em>
              </h1>
              <p className="signal-intro">
                Crepes, coffee and late-night cravings, broadcasting from Persefonis 63. A softer, stranger Crema for
                Gazi after dark.
              </p>
              <div className="signal-hero-actions">
                <OrderLink href={woltUrl}>Order on Wolt</OrderLink>
                <a className="signal-text-link" href={menuUrl} target="_blank" rel="noreferrer">
                  Browse the full menu
                  <ArrowDownRight size={18} />
                </a>
              </div>
              <div className="signal-hero-meta">
                <span>37.9788° N</span>
                <span>23.7075° E</span>
                <span>Persefonis 63</span>
              </div>
            </div>

            <div className="signal-orbit" role="img" aria-label="Animated Crema cup signal">
              <div className="signal-orbit-ring signal-orbit-ring-one" />
              <div className="signal-orbit-ring signal-orbit-ring-two" />
              <div className="signal-lottie-wrap">
                <DotLottieReact
                  src={generated('crema-signal.json')}
                  loop={!prefersReducedMotion}
                  autoplay={!prefersReducedMotion}
                />
              </div>
              <div className="signal-orbit-label signal-orbit-label-top">
                <Sparkles size={14} />
                Live taste signal
              </div>
              <div className="signal-orbit-label signal-orbit-label-bottom">04:00 loop / vector motion</div>
            </div>
          </div>
          <img className="signal-haikei-wave" src={generated('haikei-crema-waves.svg')} alt="" aria-hidden="true" />
        </section>

        <section className="signal-marquee" aria-label="Crema menu highlights">
          <div>
            <span>Crepes</span>
            <i>✦</i>
            <span>Waffles</span>
            <i>✦</i>
            <span>Coffee</span>
            <i>✦</i>
            <span>Pastry</span>
            <i>✦</i>
            <span>All night</span>
            <i>✦</i>
            <span>Crepes</span>
            <i>✦</i>
            <span>Waffles</span>
            <i>✦</i>
            <span>Coffee</span>
            <i>✦</i>
            <span>Pastry</span>
            <i>✦</i>
            <span>All night</span>
            <i>✦</i>
          </div>
        </section>

        <section className="signal-menu-section" id="menu">
          <div className="signal-section-heading">
            <p className="signal-kicker signal-kicker-dark">
              <span />
              Pick your frequency
            </p>
            <h2>
              One address.
              <br />
              Four moods.
            </h2>
            <p>
              Start with the craving, then make it yours. The menu moves from coffee to crepe to dessert without
              asking what time it is.
            </p>
          </div>

          <div className="signal-taste-grid">
            <article className="signal-taste-card signal-taste-card-tall">
              <img src={sourced('crema-crepe-05.jpg')} alt="Fresh Crema pastry" />
              <div>
                <span>01 / Flake</span>
                <h3>Pastry mode</h3>
                <p>Buttery, golden, and ready to go.</p>
              </div>
            </article>
            <article className="signal-taste-card signal-taste-card-copy">
              <span className="signal-card-index">02</span>
              <p className="signal-card-quote">“Life is uncertain. Eat dessert first.”</p>
              <a href={menuUrl} target="_blank" rel="noreferrer">
                Find your dessert <ArrowUpRight size={18} />
              </a>
            </article>
            <article className="signal-taste-card signal-taste-card-photo">
              <img src={sourced('crema-waffle-13.jpg')} alt="Crema espresso on marble" />
              <div>
                <span>03 / Shot</span>
                <h3>Espresso mode</h3>
              </div>
            </article>
            <article className="signal-taste-card signal-taste-card-dark">
              <div className="signal-pulse-disc" aria-hidden="true">
                <CoffeeGlyph />
              </div>
              <span>04 / Reset</span>
              <h3>Coffee mode</h3>
              <p>Hot, iced, quick, slow. Your call.</p>
            </article>
          </div>
        </section>

        <section className="signal-mix" id="ingredients">
          <div className="signal-mix-sticky">
            <p className="signal-kicker">
              <span />
              The experiment
            </p>
            <h2>Four tools. One visual language.</h2>
            <p>
              Each ingredient has one clear job. Motion carries the hero; procedural geometry gives the page rhythm;
              typography makes it feel editorial rather than templated.
            </p>
          </div>

          <div className="signal-recipe">
            <article>
              <span>01</span>
              <div>
                <h3>21st / Magic</h3>
                <p>Generative path choreography and layered CTA interaction.</p>
              </div>
              <strong>UI motion</strong>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Haikei</h3>
                <p>The layered orange–lime wave that carries the hero into the page.</p>
              </div>
              <strong>SVG geometry</strong>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>LottieFiles</h3>
                <p>A four-second, infinitely looping Crema cup signal made from vectors.</p>
              </div>
              <strong>Motion asset</strong>
            </article>
            <article>
              <span>04</span>
              <div>
                <h3>Fontjoy</h3>
                <p>Cormorant Garamond for appetite; Cairo and Open Sans for clarity.</p>
              </div>
              <strong>Type pairing</strong>
            </article>
          </div>
        </section>

        <section className="signal-visit" id="visit">
          <div className="signal-visit-image">
            <img src={sourced('crema-dessert-24.jpg')} alt="Crema espresso served on a marble table" />
            <span>Open / Gazi / Athens</span>
          </div>
          <div className="signal-visit-copy">
            <p className="signal-kicker signal-kicker-dark">
              <span />
              Find the source
            </p>
            <h2>Persefonis 63. Come hungry.</h2>
            <div className="signal-address-list">
              <a href={mapUrl} target="_blank" rel="noreferrer">
                <MapPin size={18} />
                Persefonis 63, Gazi
                <ArrowUpRight size={18} />
              </a>
              <a href="tel:+302103467213">
                <Phone size={18} />
                +30 210 346 7213
                <ArrowUpRight size={18} />
              </a>
              <span>
                <Clock3 size={18} />
                Coffee, crepes & delivery
              </span>
            </div>
            <OrderLink href={menuUrl} tone="ink">
              Open the menu
            </OrderLink>
          </div>
        </section>
      </main>

      <footer className="signal-footer">
        <span>Crema Signal / 2026</span>
        <p>Made for late nights in Gazi.</p>
        <a href="#signal-top">Back to signal ↑</a>
      </footer>
    </div>
  )
}

function CoffeeGlyph() {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="Coffee cup">
      <path d="M24 42h62v34c0 15-12 27-27 27h-8c-15 0-27-12-27-27V42Z" />
      <path d="M86 50h7c11 0 18 7 18 17s-7 17-18 17h-7" />
      <path d="M43 31c-7-7 7-12 0-19M66 31c-7-7 7-12 0-19" />
    </svg>
  )
}

export default SignalPage
