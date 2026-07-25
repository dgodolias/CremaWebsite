import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Clock3, MapPin, Menu, Phone, Sparkles } from 'lucide-react'
import type Lenis from 'lenis'
import { SignalPathField } from './components/SignalPathField'
import { SignalPaletteLab } from './components/SignalPaletteLab'
import { SignalScrollStory } from './components/SignalScrollStory'
import { SignalCupStill } from './components/SignalCupStill'
import { useReducedMotionPreference } from './hooks/useReducedMotionPreference'
import './signal.css'
import './signal-motion-lab.css'

const baseUrl = import.meta.env.BASE_URL
const generated = (name: string) => `${baseUrl}assets/generated/${name}`
const sequence = (frame: number) =>
  generated(`signal-sequence-v4/frame-${String(frame).padStart(3, '0')}.webp`)
const SignalLottiePlayer = lazy(() => import('./components/SignalLottiePlayer'))

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
  const prefersReducedMotion = useReducedMotionPreference()
  const [allowRichMedia, setAllowRichMedia] = useState(false)
  const [heroMotionActive, setHeroMotionActive] = useState(false)
  const shouldRenderLottie = allowRichMedia && heroMotionActive && !prefersReducedMotion

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const update = () => {
      setAllowRichMedia(!prefersReducedMotion && media.matches && !connection?.saveData)
    }
    const timer = window.setTimeout(update, 600)
    media.addEventListener('change', update)

    return () => {
      window.clearTimeout(timer)
      media.removeEventListener('change', update)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    const previousTitle = document.title
    const previousLanguage = document.documentElement.lang
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = description?.content
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const previousThemeColor = themeColor?.content
    document.title = 'Crema Signal — coffee, crepes & late-night Gazi'
    document.documentElement.lang = 'en'
    description?.setAttribute(
      'content',
      'Crema Signal is an experimental, motion-led story for coffee, crepes and late-night delivery from Gazi, Athens.',
    )
    themeColor?.setAttribute('content', '#100c0a')

    let pointerFrame = 0
    let alive = true
    let lenis: Lenis | undefined
    let ticker:
      | {
          add: (callback: (time: number) => void) => void
          remove: (callback: (time: number) => void) => void
        }
      | undefined
    let tickSmoothScroll: ((time: number) => void) | undefined
    let tickerAttached = false
    let motionObserver: IntersectionObserver | undefined

    const move = (event: PointerEvent) => {
      window.cancelAnimationFrame(pointerFrame)
      pointerFrame = window.requestAnimationFrame(() => {
        shell.style.setProperty('--signal-pointer-x', `${(event.clientX / window.innerWidth) * 100}%`)
        shell.style.setProperty('--signal-pointer-y', `${(event.clientY / window.innerHeight) * 100}%`)
      })
    }

    const syncDocumentVisibility = () => {
      const visible = !document.hidden
      shell.dataset.documentVisible = visible ? 'true' : 'false'
      if (visible) {
        lenis?.start()
        if (ticker && tickSmoothScroll && !tickerAttached) {
          ticker.add(tickSmoothScroll)
          tickerAttached = true
        }
      } else {
        lenis?.stop()
        if (ticker && tickSmoothScroll && tickerAttached) {
          ticker.remove(tickSmoothScroll)
          tickerAttached = false
        }
      }
    }

    if (!prefersReducedMotion) {
      const finePointer = window.matchMedia('(pointer: fine)').matches
      const savesData = Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
      )
      if (finePointer) {
        window.addEventListener('pointermove', move, { passive: true })
      }
      if (finePointer && !savesData) {
        void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(
          ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
            if (!alive) return
            lenis = new Lenis({
              anchors: true,
              lerp: 0.09,
              smoothWheel: true,
              wheelMultiplier: 0.9,
            })
            lenis.on('scroll', ScrollTrigger.update)
            ticker = gsap.ticker
            tickSmoothScroll = (time: number) => lenis?.raf(time * 1000)
            syncDocumentVisibility()
          },
        )
      }

      motionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const region = entry.target as HTMLElement
            region.dataset.motionActive = entry.isIntersecting ? 'true' : 'false'
            if (region.id === 'signal-top') setHeroMotionActive(entry.isIntersecting)
          })
        },
        { rootMargin: '160px 0px', threshold: 0.01 },
      )
      shell.querySelectorAll<HTMLElement>('[data-motion-region]').forEach((region) => {
        region.dataset.motionActive = 'false'
        motionObserver?.observe(region)
      })
    }
    document.addEventListener('visibilitychange', syncDocumentVisibility)
    syncDocumentVisibility()

    return () => {
      alive = false
      document.title = previousTitle
      document.documentElement.lang = previousLanguage
      if (description) description.content = previousDescription ?? ''
      if (themeColor) themeColor.content = previousThemeColor ?? ''
      window.removeEventListener('pointermove', move)
      document.removeEventListener('visibilitychange', syncDocumentVisibility)
      window.cancelAnimationFrame(pointerFrame)
      motionObserver?.disconnect()
      if (ticker && tickSmoothScroll && tickerAttached) ticker.remove(tickSmoothScroll)
      lenis?.destroy()
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
          <img src={generated('crema-logo-transparent-512.png')} alt="" />
          <span>Gazi / Athens</span>
        </a>
        <nav aria-label="Signal page">
          <a href="#story">Story</a>
          <a href="#menu">Menu</a>
          <a href="#colorways">Colorways</a>
          <a href="#ingredients">Stack</a>
        </nav>
        <a className="signal-nav-order" href={menuUrl} target="_blank" rel="noreferrer">
          <Menu size={15} />
          Open menu
        </a>
      </header>

      <main>
        <section className="signal-hero" id="signal-top" data-motion-region>
          <SignalPathField className="signal-magic-paths" reducedMotion={prefersReducedMotion} />
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
              <a className="signal-scroll-cue" href="#story">
                Enter the scroll story
                <ArrowDownRight size={17} />
              </a>
            </div>

            <div
              className="signal-orbit"
              role="img"
              aria-label={shouldRenderLottie ? 'Animated Crema cup signal' : 'Crema cup signal'}
            >
              <div className="signal-orbit-ring signal-orbit-ring-one" />
              <div className="signal-orbit-ring signal-orbit-ring-two" />
              <div className="signal-lottie-wrap">
                {!shouldRenderLottie ? (
                  <div className="signal-lottie-player" data-status="static">
                    <SignalCupStill />
                  </div>
                ) : (
                  <Suspense
                    fallback={
                      <div className="signal-lottie-player" data-status="loading">
                        <SignalCupStill />
                      </div>
                    }
                  >
                    <SignalLottiePlayer />
                  </Suspense>
                )}
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

        <section className="signal-marquee" aria-label="Crema menu highlights" data-motion-region>
          <p className="signal-sr-only">Crepes, waffles, coffee, pastry and all-night service.</p>
          <div aria-hidden="true">
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

        <SignalScrollStory reducedMotion={prefersReducedMotion} />

        <section className="signal-menu-section" id="menu" data-motion-region>
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
              <img
                src={sequence(24)}
                alt="Original still life with espresso, crepe and pastry"
                decoding="async"
                height="648"
                loading="lazy"
                width="1152"
              />
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
              <img
                src={sequence(68)}
                alt="Espresso and chocolate crepe on a dark tabletop"
                decoding="async"
                height="648"
                loading="lazy"
                width="1152"
              />
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

        <SignalPaletteLab reducedMotion={prefersReducedMotion} />

        <section className="signal-mix" id="ingredients">
          <div className="signal-mix-sticky">
            <p className="signal-kicker">
              <span />
              The experiment
            </p>
            <h2>Six systems. One visual language.</h2>
            <p>
              Each system earns its place. Scroll choreography carries the story; small component transitions explain
              state; native fallbacks keep the page useful when motion steps away.
            </p>
          </div>

          <div className="signal-recipe">
            <article>
              <span>01</span>
              <div>
                <h3>GSAP / ScrollTrigger</h3>
                <p>The 120-frame table sequence and its four editorial story states.</p>
              </div>
              <strong>Scroll direction</strong>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Lenis</h3>
                <p>Desktop fine-pointer pacing; touch, save-data and reduced-motion paths stay native.</p>
              </div>
              <strong>Scroll feel</strong>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Web Animations API</h3>
                <p>A small interruptible transition for the live colorway lab—no extra UI runtime.</p>
              </div>
              <strong>UI states</strong>
            </article>
            <article>
              <span>04</span>
              <div>
                <h3>LottieFiles</h3>
                <p>The self-authored four-second cup loop, static when motion is reduced.</p>
              </div>
              <strong>Brand motion</strong>
            </article>
            <article>
              <span>05</span>
              <div>
                <h3>Procedural SVG + Haikei</h3>
                <p>An original path field and the lightweight vector wave that frame the opening signal.</p>
              </div>
              <strong>Graphic rhythm</strong>
            </article>
            <article>
              <span>06</span>
              <div>
                <h3>Native CSS</h3>
                <p>Grid, color interpolation, tilt fallbacks and the complete static reading order.</p>
              </div>
              <strong>Resilience</strong>
            </article>
          </div>
        </section>

        <section className="signal-visit" id="visit">
          <div className="signal-visit-image">
            <img
              src={sequence(100)}
              alt="Late-night espresso, crepe and pastry still life"
              decoding="async"
              height="648"
              loading="lazy"
              width="1152"
            />
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
