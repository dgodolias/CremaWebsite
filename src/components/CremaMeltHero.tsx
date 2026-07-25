import {
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  MapPin,
  Phone,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'

import type { SiteContent } from '../content'
import { MagneticButton } from './unlumen-ui/magnetic-button'
import { PixelLiquidBg } from './unlumen-ui/pixel-liquid-bg'
import { TextReveal } from './unlumen-ui/text-reveal'

const baseUrl = import.meta.env.BASE_URL
const brandLogo = `${baseUrl}assets/generated/crema-logo-trimmed-512.png`
const foodPoster = `${baseUrl}assets/sourced/crema-scroll-cover.avif`

const woltUrl = 'https://wolt.com/en/grc/athens/restaurant/crema'
const efoodUrl = 'https://www.e-food.gr/delivery/menu/crema'
const mapUrl =
  'https://www.google.com/maps/search/?api=1&query=Crema%20Gazi%20Persefonis%2063%20Athens'
const phoneUrl = 'tel:+302103467213'

export interface CremaMeltHeroProps {
  content: SiteContent
}

export function CremaMeltHero({ content }: CremaMeltHeroProps) {
  const exploreSignatures = () => {
    document.querySelector('#signatures')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }

  return (
    <section
      className="melt-hero-shell"
      aria-labelledby="melt-hero-title"
      data-visual-direction="nocturnal-editorial-patisserie"
    >
      <PixelLiquidBg
        className="melt-hero-liquid"
        darkPalette={['#0d0907', '#2b1911', '#9b3f1d', '#e17738', '#a3a66e']}
        lightPalette={['#15100c', '#3b2115', '#a84720', '#e88a48', '#bdc08b']}
        pixelSize={22}
        resolution={0.34}
        mouseForce={7}
        cursorSize={125}
        autoDemo
      >
        <div className="melt-hero-scrim" aria-hidden="true" />
        <div className="melt-hero-grain" aria-hidden="true" />

        <div className="melt-hero-frame">
          <header className="melt-hero-header">
            <img
              className="melt-hero-logo"
              src={brandLogo}
              alt={content.story.logoAlt}
              width="512"
              height="437"
              decoding="async"
              fetchPriority="high"
            />

            <p className="melt-hero-edition" translate="no">
              <span>After dark</span>
              <span aria-hidden="true">/</span>
              <span>Athens · Gazi</span>
            </p>
          </header>

          <div className="melt-hero-layout">
            <div className="melt-hero-copy">
              <p className="melt-hero-eyebrow">
                <Sparkles size={15} aria-hidden="true" />
                {content.hero.eyebrow}
              </p>

              <h1 className="melt-hero-title" id="melt-hero-title">
                <span className="melt-hero-title-brand" translate="no">
                  Crema
                </span>
                <TextReveal
                  className="melt-hero-title-melt"
                  as="span"
                  text="Melt."
                  splitBy="characters"
                  staggerDelay={0.075}
                  duration={0.7}
                />
              </h1>

              <TextReveal
                className="melt-hero-deck"
                as="p"
                text={content.hero.headline.join(' ')}
                splitBy="words"
                staggerDelay={0.035}
                duration={0.55}
              />

              <p className="melt-hero-subcopy">{content.hero.subcopy}</p>

              <div className="melt-hero-actions" aria-label="Delivery options">
                <MagneticButton
                  className="melt-hero-order melt-hero-order-primary"
                  href={woltUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={content.meta.orderWolt}
                  radius={150}
                  strength={0.32}
                >
                  <ShoppingBag size={18} aria-hidden="true" />
                  <span>{content.hero.orderWolt}</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </MagneticButton>

                <MagneticButton
                  className="melt-hero-order melt-hero-order-secondary"
                  href={efoodUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={content.meta.orderEfood}
                  radius={150}
                  strength={0.32}
                  variant="outline"
                >
                  <span>{content.hero.orderEfood}</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </MagneticButton>
              </div>

              <MagneticButton
                className="melt-hero-explore"
                type="button"
                variant="ghost"
                radius={130}
                strength={0.36}
                onClick={exploreSignatures}
              >
                <span>{content.nav[1]}</span>
                <ArrowDownRight size={17} aria-hidden="true" />
              </MagneticButton>
            </div>

            <figure className="melt-hero-poster">
              <div className="melt-hero-poster-frame">
                <img
                  className="melt-hero-poster-image"
                  src={foodPoster}
                  alt={content.heroShots[0]}
                  width="1600"
                  height="2000"
                  decoding="async"
                  fetchPriority="high"
                />
                <div className="melt-hero-poster-shade" aria-hidden="true" />

                <figcaption className="melt-hero-poster-caption">
                  <span>01</span>
                  <span>{content.story.visualMain}</span>
                  <span>Gazi</span>
                </figcaption>
              </div>

              <div className="melt-hero-focus-mark" aria-hidden="true">
                <span>fluid</span>
                <span className="melt-hero-focus-line" />
                <span>focus</span>
              </div>

              <p className="melt-hero-poster-note">
                <Clock3 size={15} aria-hidden="true" />
                <span>{content.hero.footerOne}</span>
                <strong>{content.hero.footerTwo}</strong>
              </p>
            </figure>
          </div>

          <footer className="melt-hero-footer">
            <address className="melt-hero-contact">
              <a href={mapUrl} target="_blank" rel="noreferrer" aria-label={content.meta.map}>
                <MapPin size={16} aria-hidden="true" />
                <span>{content.hero.location}</span>
              </a>
              <a href={phoneUrl} aria-label={content.meta.call}>
                <Phone size={16} aria-hidden="true" />
                <span>{content.hero.phone}</span>
              </a>
            </address>

            <p className="melt-hero-microcopy" translate="no">
              Espresso · Vanilla · Burnt orange · Pistachio
            </p>
          </footer>
        </div>
      </PixelLiquidBg>
    </section>
  )
}

export default CremaMeltHero
