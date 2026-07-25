import { useEffect, useRef } from 'react'

const frameCount = 120
const baseUrl = import.meta.env.BASE_URL
const releasedImageSource =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='

const frameUrl = (frame: number) =>
  `${baseUrl}assets/generated/signal-sequence-v4/frame-${String(frame).padStart(3, '0')}.webp`

const chapters = [
  {
    index: '01',
    eyebrow: 'Open the aperture',
    title: 'The whole night, on one table.',
    body: 'Coffee, pastry and crepes enter as a single scene. Scroll turns the spread into the interface.',
  },
  {
    index: '02',
    eyebrow: 'Pull the focus',
    title: 'One craving takes the frame.',
    body: 'The camera closes in while type and image trade places—editorial pacing instead of a product grid.',
  },
  {
    index: '03',
    eyebrow: 'Break the recipe',
    title: 'Every layer gets its own orbit.',
    body: 'Fruit, chocolate, coffee and flake separate long enough to explain the mix, then snap back into appetite.',
  },
  {
    index: '04',
    eyebrow: 'Resolve the signal',
    title: 'Back together. Ready to order.',
    body: 'The sequence returns to the table with one clear exit: choose the mood, then open the real menu.',
  },
]

type SignalScrollStoryProps = {
  reducedMotion: boolean
}

export function SignalScrollStory({ reducedMotion }: SignalScrollStoryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameLabelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    const frameLabel = frameLabelRef.current
    if (!section || !stage || !canvas || !frameLabel) return

    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

    let alive = true
    let currentFrame = reducedMotion ? 61 : 1
    let activeChapter = -1
    let resizeFrame = 0
    let nativeScrollFrame = 0
    let renderedFrame = 0
    let requestCount = 0
    let loadQueue: number[] = []
    const images = new Map<number, HTMLImageElement>()
    const loading = new Map<number, HTMLImageElement>()
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const savesData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    )
    const isConstrained = isMobile || savesData
    const frameStep = isConstrained ? 4 : 1
    const cacheLimit = isConstrained ? 10 : 18
    const requestBudget = isConstrained ? 3 : 4

    const updateDiagnostics = () => {
      const values = {
        cacheLimit: String(cacheLimit),
        cacheSize: String(images.size),
        frameStep: String(frameStep),
        pendingRequests: String(loading.size),
        queuedRequests: String(loadQueue.length),
        requestBudget: String(requestBudget),
        requestBudgetKind: 'concurrent',
        requestCount: String(requestCount),
        saveData: savesData ? 'true' : 'false',
      }
      Object.assign(section.dataset, values)
      Object.assign(canvas.dataset, values)
    }

    const releaseImage = (image: HTMLImageElement) => {
      image.onload = null
      image.onerror = null
      image.src = releasedImageSource
    }

    const touchImage = (frame: number) => {
      const image = images.get(frame)
      if (!image) return undefined
      images.delete(frame)
      images.set(frame, image)
      return image
    }

    const trimCache = () => {
      while (images.size > cacheLimit) {
        const oldestFrame = images.keys().next().value as number | undefined
        if (oldestFrame === undefined) break

        if (oldestFrame === renderedFrame && images.size > 1) {
          const retained = images.get(oldestFrame)
          images.delete(oldestFrame)
          if (retained) images.set(oldestFrame, retained)
          continue
        }

        const evicted = images.get(oldestFrame)
        images.delete(oldestFrame)
        if (evicted) releaseImage(evicted)
      }
    }

    const nearestAvailableFrame = (target: number) => {
      if (images.has(target)) return target

      let nearestFrame = 0
      let nearestDistance = Number.POSITIVE_INFINITY
      for (const frame of images.keys()) {
        const distance = Math.abs(frame - target)
        if (distance < nearestDistance) {
          nearestFrame = frame
          nearestDistance = distance
        }
      }
      return nearestFrame
    }

    const draw = (requestedFrame = currentFrame) => {
      if (!alive) return
      const availableFrame = nearestAvailableFrame(requestedFrame)
      if (!availableFrame) return
      const image = touchImage(availableFrame)
      if (!image?.naturalWidth || !image.naturalHeight) return

      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      const x = (width - drawWidth) / 2
      const y = (height - drawHeight) / 2

      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0)
      context.clearRect(0, 0, width, height)
      context.drawImage(image, x, y, drawWidth, drawHeight)
      renderedFrame = availableFrame
      canvas.dataset.frame = String(requestedFrame)
      canvas.dataset.renderedFrame = String(availableFrame)
    }

    const settleLoadedFrame = async (frame: number, image: HTMLImageElement) => {
      try {
        await image.decode()
      } catch {
        if (!image.complete || !image.naturalWidth) {
          if (loading.get(frame) === image) loading.delete(frame)
          releaseImage(image)
          updateDiagnostics()
          pumpQueue()
          return
        }
      }

      if (!alive || loading.get(frame) !== image) return
      loading.delete(frame)
      image.onload = null
      image.onerror = null
      images.delete(frame)
      images.set(frame, image)
      trimCache()
      updateDiagnostics()
      if (Math.abs(frame - currentFrame) <= frameStep * 2 || images.size === 1) draw()
      pumpQueue()
    }

    const startRequest = (frame: number) => {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => {
        void settleLoadedFrame(frame, image)
      }
      image.onerror = () => {
        if (loading.get(frame) !== image) return
        loading.delete(frame)
        releaseImage(image)
        updateDiagnostics()
        pumpQueue()
      }
      loading.set(frame, image)
      requestCount += 1
      image.src = frameUrl(frame)
      updateDiagnostics()
    }

    function pumpQueue() {
      if (!alive) return
      while (loading.size < requestBudget && loadQueue.length > 0) {
        const frame = loadQueue.shift()
        if (frame === undefined || images.has(frame) || loading.has(frame)) continue
        startRequest(frame)
      }
      updateDiagnostics()
    }

    const requestAround = (frame: number, direction = 1) => {
      const offsets =
        direction >= 0
          ? [0, frameStep, -frameStep, frameStep * 2, -frameStep * 2]
          : [0, -frameStep, frameStep, -frameStep * 2, frameStep * 2]
      const desiredFrames = [
        ...new Set(
          offsets
            .map((offset) => frame + offset)
            .filter((candidate) => candidate >= 1 && candidate <= frameCount),
        ),
      ]
      const desiredSet = new Set(desiredFrames)

      for (const [loadingFrame, image] of loading) {
        if (
          !desiredSet.has(loadingFrame) &&
          Math.abs(loadingFrame - frame) > frameStep * 3
        ) {
          loading.delete(loadingFrame)
          releaseImage(image)
        }
      }

      loadQueue = desiredFrames.filter(
        (candidate) => !images.has(candidate) && !loading.has(candidate),
      )
      pumpQueue()
    }

    const resize = () => {
      window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, isConstrained ? 1 : 1.5)
        const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
        const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }
        draw()
      })
    }

    const setChapter = (chapter: number) => {
      if (chapter === activeChapter) return
      activeChapter = chapter
      stage.dataset.chapter = String(chapter)
      stage.querySelectorAll<HTMLElement>('.signal-story-chapter').forEach((item, index) => {
        item.dataset.active = index === chapter ? 'true' : 'false'
      })
    }

    const setProgress = (progress: number) => {
      const bounded = Math.max(0, Math.min(1, progress))
      const previousFrame = currentFrame
      const requestedFrame = Math.max(
        1,
        Math.min(frameCount, 1 + Math.round((frameCount - 1) * bounded)),
      )
      const snappedFrame =
        requestedFrame === frameCount
          ? frameCount
          : 1 + Math.round((requestedFrame - 1) / frameStep) * frameStep
      currentFrame = Math.min(frameCount, snappedFrame)
      const chapter = Math.min(chapters.length - 1, Math.floor(bounded * chapters.length))
      const burst = Math.max(0, 1 - Math.abs(bounded - 0.6) / 0.18)
      const zoom = 1 + Math.sin(Math.min(1, bounded * 1.16) * Math.PI) * 0.1

      stage.style.setProperty('--story-progress', bounded.toFixed(4))
      stage.style.setProperty('--story-burst', burst.toFixed(4))
      stage.style.setProperty('--story-zoom', zoom.toFixed(4))
      frameLabel.textContent = String(currentFrame).padStart(3, '0')
      setChapter(chapter)
      requestAround(currentFrame, currentFrame - previousFrame)
      draw()
    }

    const syncNativeProgress = () => {
      window.cancelAnimationFrame(nativeScrollFrame)
      nativeScrollFrame = window.requestAnimationFrame(() => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY
        const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight)
        setProgress((window.scrollY - sectionTop) / scrollDistance)
      })
    }

    let nativeScrollAttached = false
    const attachNativeScroll = () => {
      if (nativeScrollAttached) return
      nativeScrollAttached = true
      section.dataset.scrollEngine = 'native'
      window.addEventListener('scroll', syncNativeProgress, { passive: true })
      window.addEventListener('resize', syncNativeProgress)
      syncNativeProgress()
    }
    const detachNativeScroll = () => {
      if (!nativeScrollAttached) return
      nativeScrollAttached = false
      window.removeEventListener('scroll', syncNativeProgress)
      window.removeEventListener('resize', syncNativeProgress)
      window.cancelAnimationFrame(nativeScrollFrame)
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    updateDiagnostics()
    resize()
    setChapter(0)

    let storyTrigger: { kill: () => void } | undefined
    let activationObserver: IntersectionObserver | undefined
    let runtimeObserver: IntersectionObserver | undefined

    if (reducedMotion) {
      section.dataset.storyActive = 'true'
      loadQueue = [61]
      pumpQueue()
      stage.style.setProperty('--story-progress', '0.5')
      stage.style.setProperty('--story-burst', '0')
      stage.style.setProperty('--story-zoom', '1')
      frameLabel.textContent = '061'
      canvas.dataset.frame = '61'
    } else {
      const activateStory = () => {
        activationObserver?.disconnect()
        section.dataset.storyActive = 'true'
        requestAround(currentFrame)
        attachNativeScroll()
      }
      activationObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) activateStory()
        },
        { rootMargin: '320px 0px', threshold: 0.01 },
      )
      activationObserver.observe(section)

      if (!isConstrained) {
        const loadDesktopScrollRuntime = () => {
          runtimeObserver?.disconnect()
          void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
            .then(([{ gsap }, { ScrollTrigger }]) => {
              if (!alive) return
              gsap.registerPlugin(ScrollTrigger)
              detachNativeScroll()
              section.dataset.scrollEngine = 'gsap'
              storyTrigger = ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.18,
                onUpdate: (self) => setProgress(self.progress),
              })
              ScrollTrigger.refresh()
            })
            .catch(() => {
              section.dataset.scrollEngine = 'native-fallback'
            })
        }
        runtimeObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) loadDesktopScrollRuntime()
          },
          { rootMargin: '120px 0px', threshold: 0.01 },
        )
        runtimeObserver.observe(section)
      }
    }

    return () => {
      alive = false
      window.cancelAnimationFrame(resizeFrame)
      window.cancelAnimationFrame(nativeScrollFrame)
      resizeObserver.disconnect()
      activationObserver?.disconnect()
      runtimeObserver?.disconnect()
      detachNativeScroll()
      storyTrigger?.kill()
      loadQueue = []
      for (const image of loading.values()) releaseImage(image)
      for (const image of images.values()) releaseImage(image)
      loading.clear()
      images.clear()
    }
  }, [reducedMotion])

  return (
    <section
      className="signal-story"
      id="story"
      ref={sectionRef}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
      aria-labelledby="signal-story-title"
    >
      <div className="signal-story-sticky" ref={stageRef} data-chapter="0">
        <div className="signal-story-canvas-shell" aria-hidden="true">
          <canvas className="signal-story-canvas" ref={canvasRef} data-frame="1" />
          <div className="signal-story-shade" />
        </div>

        <div className="signal-story-parts" aria-hidden="true">
          <span className="signal-story-part signal-story-part-one">coffee</span>
          <span className="signal-story-part signal-story-part-two">berry</span>
          <span className="signal-story-part signal-story-part-three">flake</span>
          <span className="signal-story-part signal-story-part-four">cacao</span>
        </div>

        <div className="signal-story-topline" aria-hidden="true">
          <span>Crema motion study / 120 frames</span>
          <span>
            Frame <b ref={frameLabelRef}>001</b> / 120
          </span>
        </div>

        <div className="signal-story-chapters">
          {chapters.map((chapter, index) => (
            <article
              className="signal-story-chapter"
              data-active={index === 0 ? 'true' : 'false'}
              key={chapter.index}
            >
              <span>{chapter.index}</span>
              <p>{chapter.eyebrow}</p>
              <h2 id={index === 0 ? 'signal-story-title' : undefined}>{chapter.title}</h2>
              <div>{chapter.body}</div>
            </article>
          ))}
        </div>

        <div className="signal-story-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}
