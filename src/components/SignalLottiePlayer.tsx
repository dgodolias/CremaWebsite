import { useEffect, useRef, useState } from 'react'
import {
  DotLottieReact,
  setWasmUrl,
  type DotLottie,
} from '@lottiefiles/dotlottie-react'
import dotLottieWasmUrl from '@lottiefiles/dotlottie-web/dotlottie-player.wasm?url'
import { SignalCupStill } from './SignalCupStill'

const baseUrl = import.meta.env.BASE_URL

setWasmUrl(dotLottieWasmUrl)

export default function SignalLottiePlayer() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [player, setPlayer] = useState<DotLottie | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const host = hostRef.current
    if (!host || !player) return

    let isVisible = true
    const syncPlayback = () => {
      if (isVisible && !document.hidden) {
        player.play()
      } else {
        player.pause()
      }
    }
    const onLoad = () => {
      setStatus('ready')
      syncPlayback()
    }
    const onError = () => {
      setStatus('error')
      player.pause()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting)
        syncPlayback()
      },
      { rootMargin: '180px 0px', threshold: 0.01 },
    )

    player.addEventListener('load', onLoad)
    player.addEventListener('loadError', onError)
    player.addEventListener('renderError', onError)
    document.addEventListener('visibilitychange', syncPlayback)
    observer.observe(host)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      player.removeEventListener('load', onLoad)
      player.removeEventListener('loadError', onError)
      player.removeEventListener('renderError', onError)
      player.pause()
    }
  }, [player])

  return (
    <div className="signal-lottie-player" data-status={status} ref={hostRef}>
      <SignalCupStill />
      {status !== 'error' ? (
        <DotLottieReact
          aria-hidden="true"
          autoplay
          dotLottieRefCallback={setPlayer}
          loop
          renderConfig={{ autoResize: true, devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5) }}
          src={`${baseUrl}assets/generated/crema-signal.json`}
          useFrameInterpolation={false}
        />
      ) : null}
    </div>
  )
}
