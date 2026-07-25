import {
  ArrowUpRight,
  Bike,
  BookOpenText,
  Clock3,
  MapPin,
  Phone,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'

import { greekContent, type SiteContent } from '../content'
import { HorizontalDepthFade } from './unlumen-ui/horizontal-depth-fade'
import { HoverExpand, type HoverExpandItem } from './unlumen-ui/hover-expand'
import { MagneticButton } from './unlumen-ui/magnetic-button'
import { TextReveal } from './unlumen-ui/text-reveal'

const baseUrl = import.meta.env.BASE_URL
const sourcedAsset = (name: string) => `${baseUrl}assets/sourced/${name}`
const generatedAsset = (name: string) => `${baseUrl}assets/generated/${name}`

const categoryImages = [
  sourcedAsset('crema-scroll-cover.avif'),
  sourcedAsset('crema-waffle-14.jpg'),
  sourcedAsset('crema-dessert-20.jpg'),
  sourcedAsset('crema-crepe-05.jpg'),
]

const galleryImages = [
  'crema-waffle-13.jpg',
  'crema-dessert-19.jpg',
  'crema-dessert-21.jpg',
  'crema-dessert-22.jpg',
  'crema-dessert-23.jpg',
  'crema-dessert-24.jpg',
  'crema-dessert-26.jpg',
  'crema-dessert-27.jpg',
].map((name, index) => ({
  src: sourcedAsset(name),
  alt: `${greekContent.galleryAlt} ${index + 1}`,
}))

const menuUrl = 'https://quar.gr/crema'
const woltUrl = 'https://wolt.com/en/grc/athens/restaurant/crema'
const efoodUrl = 'https://www.e-food.gr/delivery/menu/crema'
const mapUrl =
  'https://www.google.com/maps/search/?api=1&query=Crema%20Gazi%20Persefonis%2063%20Athens'
const mapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.9302224576086!2d23.70753667644428!3d37.97875770038259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bcde73544fb5%3A0xd7ff0cdaf6903b86!2sCREMA!5e0!3m2!1sel!2sgr!4v1781330993571!5m2!1sel!2sgr'

export interface CremaMeltSectionsProps {
  content?: SiteContent
  className?: string
}

export function CremaMeltSections({
  content = greekContent,
  className,
}: CremaMeltSectionsProps) {
  const signatureItems: HoverExpandItem[] = content.signatures.items.map(
    (item, index) => ({
      label: item.title,
      sublabel: content.marquee[index] ?? content.signatures.eyebrow,
      description: item.detail,
      image: categoryImages[index],
      imageAlt: `${item.title} — ${item.detail}`,
    }),
  )

  const cinematicGallery = galleryImages.map((image) => ({
    ...image,
    alt: image.alt.replace(greekContent.galleryAlt, content.galleryAlt),
  }))

  return (
    <div className={`melt-sections ${className ?? ''}`.trim()}>
      <section
        className="melt-story relative overflow-hidden bg-[#f5eddf] px-5 py-24 text-[#12100e] sm:px-8 lg:px-[6vw] lg:py-40"
        id="story"
      >
        <div className="melt-story-index" aria-hidden="true">
          01 / MELT
        </div>

        <div className="melt-story-layout mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.58fr)] lg:gap-[8vw]">
          <div className="melt-story-manifesto">
            <p className="melt-kicker mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#c64810]">
              <Sparkles aria-hidden="true" size={16} />
              {content.story.eyebrow} / After dark
            </p>
            <TextReveal
              as="h2"
              className="melt-display melt-story-title max-w-[1050px] text-[clamp(3.25rem,8.7vw,9.5rem)] font-black uppercase leading-[0.86] tracking-[-0.07em]"
              duration={0.62}
              splitBy="words"
              staggerDelay={0.055}
              text={content.story.title}
            />
            <div className="melt-story-meta mt-12 grid gap-8 border-t border-[#12100e]/20 pt-7 sm:grid-cols-[auto_minmax(0,620px)] sm:items-start sm:gap-12">
              <p className="melt-story-stamp text-xs font-black uppercase tracking-[0.16em]">
                {content.story.visualMain}
                <br />
                {content.story.visualSub}
              </p>
              <p className="melt-story-body text-base leading-7 text-[#12100e]/70 sm:text-lg sm:leading-8">
                {content.story.body}
              </p>
            </div>
          </div>

          <figure className="melt-story-poster relative min-h-[500px] overflow-hidden bg-[#12100e]">
            <img
              className="melt-story-photo absolute inset-0 h-full w-full object-cover"
              src={sourcedAsset('crema-brand-large.jpg')}
              alt={content.story.visualMain}
              loading="lazy"
              decoding="async"
            />
            <div className="melt-story-poster-wash absolute inset-0" aria-hidden="true" />
            <figcaption className="melt-story-caption absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 text-[#fff9ef]">
              <span className="max-w-48 text-xs font-black uppercase tracking-[0.15em]">
                {content.hero.location}
              </span>
              <img
                className="melt-story-logo h-auto w-28"
                src={generatedAsset('crema-logo-trimmed-512.png')}
                alt={content.story.logoAlt}
                width="512"
                height="437"
                loading="lazy"
                decoding="async"
              />
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="melt-signatures bg-[#12100e] px-5 py-24 text-[#fff9ef] sm:px-8 lg:px-[6vw] lg:py-40"
        id="signatures"
      >
        <div className="melt-signatures-heading mx-auto mb-12 grid max-w-[1500px] gap-7 border-b border-white/15 pb-10 lg:grid-cols-[.35fr_1fr] lg:items-end">
          <p className="melt-kicker flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#f36a18]">
            <ShoppingBag aria-hidden="true" size={16} />
            02 / {content.signatures.eyebrow}
          </p>
          <TextReveal
            as="h2"
            className="melt-display melt-signatures-title text-[clamp(2.7rem,6.4vw,7.25rem)] font-black uppercase leading-[0.9] tracking-[-0.06em]"
            duration={0.52}
            splitBy="words"
            staggerDelay={0.042}
            text={content.signatures.title}
          />
        </div>

        <div className="melt-signatures-interactive mx-auto hidden max-w-[1500px] md:block">
          <HoverExpand
            className="melt-hover-expand"
            collapsedHeight={88}
            expandedHeight={440}
            items={signatureItems}
          />
        </div>

        <ol className="melt-signatures-mobile mx-auto grid max-w-[1500px] list-none gap-0 p-0 md:hidden">
          {signatureItems.map((item, index) => (
            <li
              className="melt-signature-mobile-item border-t border-white/15 py-6 last:border-b"
              key={item.label}
            >
              <div className="melt-signature-mobile-label flex items-baseline gap-4">
                <span className="text-xs tabular-nums text-white/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-2xl font-black uppercase tracking-[-0.04em]">
                  {item.label}
                </h3>
              </div>
              <p className="melt-signature-mobile-detail ml-9 mt-3 max-w-md text-sm leading-6 text-white/65">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div
        className="melt-gallery bg-[#0a0908] text-[#fff9ef]"
        role="region"
        aria-labelledby="melt-gallery-title"
      >
        <div className="melt-gallery-heading mx-auto grid max-w-[1500px] gap-7 px-5 pb-4 pt-24 sm:px-8 lg:grid-cols-[.35fr_1fr] lg:items-end lg:px-[6vw] lg:pt-40">
          <p className="melt-kicker text-xs font-black uppercase tracking-[0.18em] text-[#8ecf4f]">
            03 / Crema close-up
          </p>
          <h2
            className="melt-display melt-gallery-title text-[clamp(2.7rem,6.4vw,7.25rem)] font-black uppercase leading-[0.88] tracking-[-0.065em]"
            id="melt-gallery-title"
          >
            {content.products.title}
          </h2>
        </div>

        <HorizontalDepthFade
          blur={6}
          brightnessBoost={20}
          className="melt-gallery-depth"
          darknessStrength={1.18}
          dim={34}
          focusSpread={0.2}
          gap={18}
          images={cinematicGallery}
          itemHeight={510}
          itemWidth={370}
          minSaturation={26}
          saturationStrength={1.12}
          scaleEffect={0.055}
          scrollLength={220}
          scrollSensitivity={0.82}
          travel={100}
        />
      </div>

      <section
        className="melt-gazi bg-[#f5eddf] px-5 py-24 text-[#12100e] sm:px-8 lg:px-[6vw] lg:py-40"
        id="gazi"
      >
        <div className="melt-gazi-layout mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[minmax(340px,.9fr)_minmax(0,1fr)] lg:items-stretch lg:gap-[6vw]">
          <div className="melt-gazi-map relative min-h-[480px] overflow-hidden border border-black/15 bg-[#12100e] lg:min-h-[680px]">
            <iframe
              className="melt-gazi-iframe h-full min-h-[inherit] w-full border-0"
              src={mapEmbedUrl}
              title="Χάρτης CREMA στο Γκάζι"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span
              className="melt-gazi-map-label pointer-events-none absolute bottom-5 left-5 bg-[#8ecf4f] px-4 py-3 text-xs font-black uppercase tracking-[0.16em]"
              aria-hidden="true"
            >
              {content.location.mapWord} / 37.9788° N
            </span>
          </div>

          <div className="melt-gazi-copy flex flex-col justify-between py-1">
            <div>
              <p className="melt-kicker mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#c64810]">
                <MapPin aria-hidden="true" size={16} />
                04 / {content.location.eyebrow}
              </p>
              <TextReveal
                as="h2"
                className="melt-display melt-gazi-title text-[clamp(3rem,6.5vw,7.5rem)] font-black uppercase leading-[0.88] tracking-[-0.065em]"
                duration={0.54}
                splitBy="words"
                staggerDelay={0.044}
                text={content.location.title}
              />
              <p className="melt-gazi-body mt-8 max-w-xl text-base leading-7 text-black/65 sm:text-lg sm:leading-8">
                {content.location.body}
              </p>
            </div>

            <div className="melt-gazi-actions mt-12 flex flex-wrap gap-3">
              <MagneticButton
                className="melt-button melt-button-primary min-h-12 rounded-none bg-[#12100e] px-6 text-[#fff9ef]"
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                size="lg"
              >
                <MapPin aria-hidden="true" size={17} />
                {content.location.openMap}
                <ArrowUpRight aria-hidden="true" size={16} />
              </MagneticButton>
              <MagneticButton
                className="melt-button melt-button-outline min-h-12 rounded-none border-black/20 bg-transparent px-6 text-[#12100e]"
                href="tel:+302103467213"
                size="lg"
                variant="outline"
              >
                <Phone aria-hidden="true" size={17} />
                {content.location.callNow}
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <section
        className="melt-delivery relative overflow-hidden bg-[#f36a18] px-5 py-24 text-[#12100e] sm:px-8 lg:px-[6vw] lg:py-40"
        id="delivery"
      >
        <span className="melt-delivery-number" aria-hidden="true">
          {content.delivery.hours}
        </span>

        <div className="melt-delivery-layout relative z-10 mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.46fr)] lg:items-end">
          <div className="melt-delivery-copy">
            <p className="melt-kicker mb-7 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
              <Bike aria-hidden="true" size={17} />
              05 / {content.delivery.eyebrow}
            </p>
            <TextReveal
              as="h2"
              className="melt-display melt-delivery-title max-w-[1100px] text-[clamp(3.25rem,8vw,9rem)] font-black uppercase leading-[0.85] tracking-[-0.07em]"
              duration={0.54}
              splitBy="words"
              staggerDelay={0.04}
              text={content.delivery.title}
            />
          </div>

          <aside className="melt-delivery-convert border-t border-black/25 pt-7">
            <p className="melt-delivery-body text-base leading-7 text-black/70 sm:text-lg">
              {content.delivery.body}
            </p>
            <div className="melt-delivery-actions mt-8 grid gap-3">
              <MagneticButton
                className="melt-button melt-button-dark min-h-14 w-full justify-between rounded-none bg-[#12100e] px-6 text-[#fff9ef]"
                href={woltUrl}
                target="_blank"
                rel="noreferrer"
                size="lg"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag aria-hidden="true" size={18} />
                  {content.meta.orderWolt}
                </span>
                <ArrowUpRight aria-hidden="true" size={17} />
              </MagneticButton>
              <MagneticButton
                className="melt-button melt-button-light min-h-14 w-full justify-between rounded-none bg-[#fff9ef] px-6 text-[#12100e]"
                href={efoodUrl}
                target="_blank"
                rel="noreferrer"
                size="lg"
              >
                <span className="flex items-center gap-3">
                  <Bike aria-hidden="true" size={18} />
                  {content.meta.orderEfood}
                </span>
                <ArrowUpRight aria-hidden="true" size={17} />
              </MagneticButton>
              <MagneticButton
                className="melt-button melt-button-menu min-h-14 w-full justify-between rounded-none border-black/25 bg-transparent px-6 text-[#12100e]"
                href={menuUrl}
                target="_blank"
                rel="noreferrer"
                size="lg"
                variant="outline"
              >
                <span className="flex items-center gap-3">
                  <BookOpenText aria-hidden="true" size={18} />
                  Μενού
                </span>
                <ArrowUpRight aria-hidden="true" size={17} />
              </MagneticButton>
            </div>

            <p className="melt-delivery-hours mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em]">
              <Clock3 aria-hidden="true" size={16} />
              {content.delivery.hours} {content.delivery.hoursLabel} / {content.hero.phone}
            </p>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default CremaMeltSections
