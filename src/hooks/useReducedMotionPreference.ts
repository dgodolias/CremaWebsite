import { useEffect, useState } from 'react'

export function useReducedMotionPreference() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(media.matches)
    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [])

  return prefersReducedMotion
}
