import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type FloatingPathsBackgroundProps = {
  position: number
  className?: string
  children?: ReactNode
}

export function FloatingPathsBackground({
  position,
  className = '',
  children,
}: FloatingPathsBackgroundProps) {
  const prefersReducedMotion = Boolean(useReducedMotion())
  const paths = Array.from({ length: 36 }, (_, index) => ({
    id: index,
    d: `M-${380 - index * 5 * position} -${189 + index * 6}C-${
      380 - index * 5 * position
    } -${189 + index * 6} -${312 - index * 5 * position} ${216 - index * 6} ${
      152 - index * 5 * position
    } ${343 - index * 6}C${616 - index * 5 * position} ${470 - index * 6} ${
      684 - index * 5 * position
    } ${875 - index * 6} ${684 - index * 5 * position} ${875 - index * 6}`,
    width: 0.5 + index * 0.03,
    duration: 20 + (index % 7) * 1.45,
  }))

  return (
    <div className={`floating-paths-background ${className}`.trim()} data-source="21st-floating-paths">
      <div className="floating-paths-canvas" aria-hidden="true">
        <svg viewBox="0 0 696 316" fill="none">
          {paths.map((path) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={0.1 + path.id * 0.02}
              initial={prefersReducedMotion ? false : { pathLength: 0.3, opacity: 0.6 }}
              animate={
                prefersReducedMotion
                  ? { pathLength: 0.72, opacity: 0.24, pathOffset: 0 }
                  : {
                      pathLength: 1,
                      opacity: [0.22, 0.62, 0.22],
                      pathOffset: [0, 1, 0],
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: path.duration,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'linear',
                    }
              }
            />
          ))}
        </svg>
      </div>
      {children}
    </div>
  )
}
