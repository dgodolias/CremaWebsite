import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'

const baseUrl = import.meta.env.BASE_URL
const sequence = (frame: number) =>
  `${baseUrl}assets/generated/signal-sequence-v4/frame-${String(frame).padStart(3, '0')}.webp`

const palettes = [
  {
    id: 'orange',
    label: 'Crema orange',
    accent: '#ff5a18',
    secondary: '#a8e95a',
    ink: '#100c0a',
    image: sequence(1),
    imageAlt: 'Original still life with espresso, crepe, pastry and fruit',
    eyebrow: '01 / house frequency',
    title: 'Orange crush',
    note: 'Warm crepe, green spark, one unapologetic Crema hit.',
  },
  {
    id: 'berry',
    label: 'Berry afterimage',
    accent: '#ff3f78',
    secondary: '#ffd7e4',
    ink: '#2a0715',
    image: sequence(31),
    imageAlt: 'Close crop of espresso and chocolate crepe with berries',
    eyebrow: '02 / soft frequency',
    title: 'Berry afterimage',
    note: 'A colder pink field for chocolate, cream and late-night sweetness.',
  },
  {
    id: 'espresso',
    label: 'Espresso metal',
    accent: '#d7ff45',
    secondary: '#8c6a55',
    ink: '#0d0b0a',
    image: sequence(61),
    imageAlt: 'Cinematic espresso, crepe and pastry arrangement',
    eyebrow: '03 / dark frequency',
    title: 'Espresso metal',
    note: 'Sharp lime telemetry around a slow, dark coffee core.',
  },
  {
    id: 'cream',
    label: 'Cream channel',
    accent: '#ff6a35',
    secondary: '#fff1d6',
    ink: '#34160b',
    image: sequence(91),
    imageAlt: 'Wide late-night food still life on a dark stone table',
    eyebrow: '04 / quiet frequency',
    title: 'Cream channel',
    note: 'The same appetite with the volume pulled down and the texture left on.',
  },
]

type SignalPaletteLabProps = {
  reducedMotion: boolean
}

export function SignalPaletteLab({ reducedMotion }: SignalPaletteLabProps) {
  const [activeId, setActiveId] = useState(palettes[0].id)
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const tiltFrameRef = useRef(0)
  const hasAnimatedPaletteRef = useRef(false)
  const active = palettes.find((palette) => palette.id === activeId) ?? palettes[0]

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return

    let preloadTimer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        preloadTimer = window.setTimeout(() => {
          palettes.slice(1).forEach((palette) => {
            const image = new Image()
            image.decoding = 'async'
            image.src = palette.image
          })
        }, 250)
      },
      { rootMargin: '500px 0px', threshold: 0.01 },
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      window.clearTimeout(preloadTimer)
      window.cancelAnimationFrame(tiltFrameRef.current)
    }
  }, [reducedMotion])

  useEffect(() => {
    const card = stageRef.current?.querySelector<HTMLElement>('.signal-palette-card')
    if (!card || reducedMotion) return
    if (!hasAnimatedPaletteRef.current) {
      hasAnimatedPaletteRef.current = true
      return
    }

    const animation = card.animate(
      [
        { clipPath: 'inset(42% 0% 42% 0% round 50%)', opacity: 0 },
        { clipPath: 'inset(0% 0% 0% 0% round 2.2rem)', opacity: 1 },
      ],
      { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )
    return () => animation.cancel()
  }, [activeId, reducedMotion])

  const updateTilt = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    window.cancelAnimationFrame(tiltFrameRef.current)
    tiltFrameRef.current = window.requestAnimationFrame(() => {
      stage.style.setProperty('--lab-tilt-x', `${(-y * 7).toFixed(2)}deg`)
      stage.style.setProperty('--lab-tilt-y', `${(x * 9).toFixed(2)}deg`)
      stage.style.setProperty('--lab-pointer-x', `${((x + 0.5) * 100).toFixed(2)}%`)
      stage.style.setProperty('--lab-pointer-y', `${((y + 0.5) * 100).toFixed(2)}%`)
    })
  }

  const resetTilt = () => {
    const stage = stageRef.current
    if (!stage) return
    stage.style.setProperty('--lab-tilt-x', '0deg')
    stage.style.setProperty('--lab-tilt-y', '0deg')
    stage.style.setProperty('--lab-pointer-x', '50%')
    stage.style.setProperty('--lab-pointer-y', '50%')
  }

  const paletteStyle = {
    '--lab-accent': active.accent,
    '--lab-secondary': active.secondary,
    '--lab-ink': active.ink,
  } as CSSProperties

  return (
    <section
      className="signal-palette-lab"
      id="colorways"
      style={paletteStyle}
      aria-labelledby="palette-title"
      data-motion-region
      ref={sectionRef}
    >
      <div className="signal-palette-copy">
        <p className="signal-kicker signal-kicker-dark">
          <span />
          Change the frequency
        </p>
        <h2 id="palette-title">One product. Four atmospheres.</h2>
        <p>
          The reference changes finishes on demand. Crema changes appetite: the content stays legible while color,
          image and material respond as one system.
        </p>

        <div className="signal-palette-controls" role="group" aria-label="Choose a Crema color atmosphere">
          {palettes.map((palette, index) => (
            <button
              type="button"
              key={palette.id}
              aria-pressed={active.id === palette.id}
              onClick={() => setActiveId(palette.id)}
            >
              <span style={{ background: palette.accent }} aria-hidden="true" />
              <b>{String(index + 1).padStart(2, '0')}</b>
              {palette.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="signal-palette-stage"
        ref={stageRef}
        onPointerMove={updateTilt}
        onPointerLeave={resetTilt}
        data-reduced-motion={reducedMotion ? 'true' : 'false'}
      >
        <div className="signal-palette-orbit signal-palette-orbit-one" aria-hidden="true" />
        <div className="signal-palette-orbit signal-palette-orbit-two" aria-hidden="true" />
        <figure className="signal-palette-card" key={active.id}>
          <img
            src={active.image}
            alt={active.imageAlt}
            decoding="async"
            height="648"
            loading="lazy"
            width="1152"
          />
          <figcaption>
            <span>{active.eyebrow}</span>
            <h3>{active.title}</h3>
            <p>{active.note}</p>
          </figcaption>
        </figure>

        <div className="signal-palette-readout" aria-live="polite">
          <span>Live colorway</span>
          <strong>{active.label}</strong>
        </div>
      </div>
    </section>
  )
}
