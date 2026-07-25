import { useEffect, useRef, useState, type CSSProperties } from 'react'

type SignalPathFieldProps = {
  className?: string
  reducedMotion: boolean
}

const curves = Array.from({ length: 28 }, (_, index) => {
  const rise = index * 13
  const drift = (index % 5) * 18
  return {
    id: index,
    d: `M ${-180 - drift} ${34 + rise} C ${110 + drift} ${-80 + rise}, ${
      430 - drift
    } ${390 - rise * 0.18}, ${690 + drift} ${170 + rise * 0.42} S ${
      1040 + drift
    } ${80 + rise * 0.74}, ${1240 + drift} ${250 + rise * 0.2}`,
    opacity: 0.08 + index * 0.012,
    width: 0.55 + index * 0.035,
    duration: 14 + (index % 8) * 1.7,
    delay: index * -0.64,
  }
})

export function SignalPathField({ className = '', reducedMotion }: SignalPathFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isMotionActive, setIsMotionActive] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return

    let isIntersecting = false
    const sync = () => setIsMotionActive(isIntersecting && !document.hidden)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = Boolean(entry?.isIntersecting)
        sync()
      },
      { rootMargin: '180px 0px', threshold: 0.01 },
    )
    observer.observe(root)
    document.addEventListener('visibilitychange', sync)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [reducedMotion])

  return (
    <div
      className={`signal-path-field ${className}`.trim()}
      data-motion-active={isMotionActive && !reducedMotion ? 'true' : 'false'}
      data-source="crema-procedural-paths"
      ref={rootRef}
    >
      <svg className="signal-path-canvas" viewBox="0 0 1000 520" fill="none" aria-hidden="true">
        {curves.map((curve) => (
          <path
            d={curve.d}
            key={curve.id}
            pathLength="1"
            stroke="currentColor"
            strokeLinecap="round"
            strokeOpacity={curve.opacity}
            strokeWidth={curve.width}
            style={
              {
                '--signal-path-delay': `${curve.delay}s`,
                '--signal-path-duration': `${curve.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </svg>
    </div>
  )
}
