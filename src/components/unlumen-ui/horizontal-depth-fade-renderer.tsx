"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { RefObject } from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { cn } from "@/lib/utils";

export interface HorizontalDepthFadeImage {
  src: string;
  alt?: string;
}

export interface HorizontalDepthFadeProps {
  /** Array of image sources to display in the strip. */
  images: HorizontalDepthFadeImage[];
  /** Horizontal travel amount in percent of the available strip overflow. @default 100 */
  travel?: number;
  /** Maximum blur amount (px) away from each image focus zone. @default 10 */
  blur?: number;
  /** Minimum brightness (%) away from each image focus zone. @default 20 */
  dim?: number;
  /** Extra brightness applied around the active focus zone. @default 45 */
  brightnessBoost?: number;
  /** Multiplier for out-of-focus darkening intensity. Values > 1 darken more aggressively. @default 1.35 */
  darknessStrength?: number;
  /** Minimum saturation (%) away from focus. Use `0` for full desaturation on edges. @default 0 */
  minSaturation?: number;
  /** Multiplier for desaturation intensity away from focus. Values > 1 desaturate faster. @default 1.35 */
  saturationStrength?: number;
  /** Focus zone width as normalized progress range. @default 0.16 */
  focusSpread?: number;
  /** Scale reduction amount away from focus. @default 0.09 */
  scaleEffect?: number;
  /** Scroll sensitivity multiplier. Lower values require longer scrolling. @default 0.6 */
  scrollSensitivity?: number;
  /** Gap between images. Accepts px number or CSS string. @default "1.5rem" */
  gap?: number | string;
  /** Image width in pixels. @default 360 */
  itemWidth?: number;
  /** Image height in pixels. @default 460 */
  itemHeight?: number;
  /** Height of the scroll section in viewport units. @default 280 */
  scrollLength?: number;
  /** Optional scrollable container element used as the animation scroller. */
  scrollContainerRef?: RefObject<HTMLElement | null>;
  /**
   * Use the non-pinned, horizontally scrollable presentation on mobile and
   * coarse pointers. Reduced-motion users always receive the static version.
   * @default true
   */
  staticOnMobile?: boolean;
  /** Additional class name on the root element. */
  className?: string;
}

const DEFAULT_TRAVEL = 100;
const DEFAULT_BLUR = 10;
const DEFAULT_DIM = 20;
const DEFAULT_BRIGHTNESS_BOOST = 45;
const DEFAULT_DARKNESS_STRENGTH = 1.35;
const DEFAULT_MIN_SATURATION = 0;
const DEFAULT_SATURATION_STRENGTH = 1.35;
const DEFAULT_FOCUS_SPREAD = 0.16;
const DEFAULT_SCALE_EFFECT = 0.09;
const DEFAULT_SCROLL_SENSITIVITY = 0.6;
const DEFAULT_ITEM_WIDTH = 360;
const DEFAULT_ITEM_HEIGHT = 460;
const DEFAULT_SCROLL_LENGTH = 280;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_OR_COARSE_QUERY =
  "(hover: none), (pointer: coarse), (max-width: 767px)";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toCssLength(value: number | string | undefined, fallback: string) {
  if (typeof value === "number") return `${value}px`;
  return value ?? fallback;
}

function computeFocusIntensity(
  progress: number,
  index: number,
  total: number,
  influence = 0.2,
) {
  if (total <= 1) return 0;
  const safeInfluence = clamp(influence, 0.04, 1);
  const center = index / (total - 1);
  return clamp(Math.abs(progress - center) / safeInfluence, 0, 1);
}

function applyScrollSensitivity(progress: number, sensitivity: number) {
  const safeSensitivity = clamp(sensitivity, 0.25, 1.6);
  const exponent = 1 / safeSensitivity;
  return Math.pow(clamp(progress, 0, 1), exponent);
}

function shouldUseStaticPresentation(staticOnMobile: boolean) {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia(REDUCED_MOTION_QUERY).matches ||
    (staticOnMobile && window.matchMedia(MOBILE_OR_COARSE_QUERY).matches)
  );
}

function useStaticPresentation(staticOnMobile: boolean) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const mobileOrCoarse = window.matchMedia(MOBILE_OR_COARSE_QUERY);

    reducedMotion.addEventListener("change", onStoreChange);
    mobileOrCoarse.addEventListener("change", onStoreChange);

    return () => {
      reducedMotion.removeEventListener("change", onStoreChange);
      mobileOrCoarse.removeEventListener("change", onStoreChange);
    };
  }, []);
  const getSnapshot = useCallback(
    () => shouldUseStaticPresentation(staticOnMobile),
    [staticOnMobile],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function useStripMetrics(
  viewportRef: RefObject<HTMLDivElement | null>,
  trackRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  const [maxShift, setMaxShift] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const update = () => {
      const overflow = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setMaxShift(overflow);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    observer.observe(track);

    return () => observer.disconnect();
  }, [enabled, viewportRef, trackRef]);

  return maxShift;
}

export function HorizontalDepthFade({
  images,
  travel = DEFAULT_TRAVEL,
  blur = DEFAULT_BLUR,
  dim = DEFAULT_DIM,
  brightnessBoost = DEFAULT_BRIGHTNESS_BOOST,
  darknessStrength = DEFAULT_DARKNESS_STRENGTH,
  minSaturation = DEFAULT_MIN_SATURATION,
  saturationStrength = DEFAULT_SATURATION_STRENGTH,
  focusSpread = DEFAULT_FOCUS_SPREAD,
  scaleEffect = DEFAULT_SCALE_EFFECT,
  scrollSensitivity = DEFAULT_SCROLL_SENSITIVITY,
  gap = "1.5rem",
  itemWidth = DEFAULT_ITEM_WIDTH,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  scrollLength = DEFAULT_SCROLL_LENGTH,
  scrollContainerRef,
  staticOnMobile = true,
  className,
}: HorizontalDepthFadeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const boundedTravel = clamp(travel, 0, 100);
  const boundedBlur = clamp(blur, 0, 48);
  const boundedDim = clamp(dim, 0, 100);
  const boundedBrightnessBoost = clamp(brightnessBoost, 0, 120);
  const boundedDarknessStrength = clamp(darknessStrength, 0.2, 3);
  const boundedMinSaturation = clamp(minSaturation, 0, 100);
  const boundedSaturationStrength = clamp(saturationStrength, 0.2, 3);
  const boundedFocusSpread = clamp(focusSpread, 0.04, 1);
  const boundedScaleEffect = clamp(scaleEffect, 0, 0.25);
  const boundedScrollSensitivity = clamp(scrollSensitivity, 0.25, 1.6);
  const boundedScrollLength = clamp(scrollLength, 140, 600);
  const stripGap = toCssLength(gap, "1.5rem");
  const isStatic = useStaticPresentation(staticOnMobile);

  const maxShift = useStripMetrics(viewportRef, trackRef, !isStatic);
  const effectiveShift = maxShift * (boundedTravel / 100);

  useEffect(() => {
    if (isStatic || shouldUseStaticPresentation(staticOnMobile)) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>(".hbs-item"),
      );

      const applyState = (rawProgress: number) => {
        const p = applyScrollSensitivity(rawProgress, boundedScrollSensitivity);

        gsap.set(track, {
          x: -effectiveShift * p,
        });

        cards.forEach((card, index) => {
          const intensity = computeFocusIntensity(
            p,
            index,
            cards.length,
            boundedFocusSpread,
          );
          const boostedIntensity = clamp(
            intensity * boundedDarknessStrength,
            0,
            1,
          );
          const currentBlur = boostedIntensity * boundedBlur;
          const peakBrightness = clamp(100 + boundedBrightnessBoost, 100, 220);
          const currentBrightness =
            boundedDim + (1 - boostedIntensity) * (peakBrightness - boundedDim);
          const boostedSaturationIntensity = clamp(
            intensity * boundedSaturationStrength,
            0,
            1,
          );
          const currentSaturation =
            boundedMinSaturation +
            (1 - boostedSaturationIntensity) * (100 - boundedMinSaturation);
          const currentScale = 1 - boostedIntensity * boundedScaleEffect;

          gsap.set(card, {
            filter: `blur(${currentBlur}px) brightness(${currentBrightness}%) saturate(${currentSaturation}%)`,
            scale: currentScale,
          });
        });
      };

      applyState(0);

      ScrollTrigger.create({
        trigger: section,
        scroller: scrollContainerRef?.current ?? undefined,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          applyState(self.progress);
        },
      });
    }, sectionRef);

    ScrollTrigger.refresh();

    return () => context.revert();
  }, [
    scrollContainerRef,
    images,
    effectiveShift,
    boundedBlur,
    boundedDim,
    boundedBrightnessBoost,
    boundedDarknessStrength,
    boundedMinSaturation,
    boundedSaturationStrength,
    boundedFocusSpread,
    boundedScaleEffect,
    boundedScrollSensitivity,
    isStatic,
    staticOnMobile,
  ]);

  if (isStatic) {
    return (
      <section
        className={cn("relative w-full", className)}
        data-presentation="static"
      >
        <div
          className="flex w-full snap-x snap-mandatory items-center overflow-x-auto overscroll-x-contain px-[6vw] py-8"
          style={{ gap: stripGap }}
        >
          {images.map((image, index) => (
            <figure
              key={`${image.src}-${index}`}
              className="relative m-0 shrink-0 snap-center overflow-hidden rounded-xl"
              style={{
                width: `min(${Math.max(1, itemWidth)}px, 82vw)`,
                height: `min(${Math.max(1, itemHeight)}px, 68vh)`,
              }}
            >
              <img
                src={image.src}
                alt={image.alt ?? ""}
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full", className)}
      style={{ height: `${boundedScrollLength}vh` }}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <div className="flex h-full w-full items-center">
          <div
            ref={trackRef}
            className="hbs-track flex w-max items-center px-[8vw]"
            style={{ gap: stripGap }}
          >
            {images.map((img, i) => (
              <figure
                key={`${img.src}-${i}`}
                className="hbs-item relative z-10 m-0 shrink-0 overflow-hidden rounded-xl"
                style={{ width: itemWidth, height: itemHeight }}
              >
                <div
                  className="absolute inset-0 h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${img.src})` }}
                  role="img"
                  aria-label={img.alt ?? `Image ${i + 1}`}
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HorizontalDepthFade;
