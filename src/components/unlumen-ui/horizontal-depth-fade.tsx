"use client";

import * as React from "react";

import type {
  HorizontalDepthFadeImage,
  HorizontalDepthFadeProps,
} from "./horizontal-depth-fade-renderer";

import { cn } from "@/lib/utils";

const HorizontalDepthFadeRenderer = React.lazy(() =>
  import("./horizontal-depth-fade-renderer").then((module) => ({
    default: module.HorizontalDepthFade,
  })),
);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_OR_COARSE_QUERY =
  "(hover: none), (pointer: coarse), (max-width: 767px)";

function shouldUseStaticPresentation(staticOnMobile: boolean) {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(REDUCED_MOTION_QUERY).matches ||
    (staticOnMobile && window.matchMedia(MOBILE_OR_COARSE_QUERY).matches)
  );
}

function toCssLength(value: number | string | undefined, fallback: string) {
  if (typeof value === "number") return `${value}px`;
  return value ?? fallback;
}

function StaticStrip({
  images,
  gap,
  itemWidth,
  itemHeight,
}: {
  images: HorizontalDepthFadeImage[];
  gap: number | string | undefined;
  itemWidth: number | undefined;
  itemHeight: number | undefined;
}) {
  return (
    <div
      className="flex w-full snap-x snap-mandatory items-center overflow-x-auto overscroll-x-contain px-[6vw] py-8"
      style={{ gap: toCssLength(gap, "1.5rem") }}
    >
      {images.map((image, index) => (
        <figure
          key={`${image.src}-${index}`}
          className="relative m-0 shrink-0 snap-center overflow-hidden rounded-xl"
          style={{
            width: `min(${Math.max(1, itemWidth ?? 360)}px, 82vw)`,
            height: `min(${Math.max(1, itemHeight ?? 460)}px, 68vh)`,
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
  );
}

function StaticHorizontalDepthFade(props: HorizontalDepthFadeProps) {
  return (
    <section
      className={cn("relative w-full", props.className)}
      data-presentation="static"
    >
      <StaticStrip
        images={props.images}
        gap={props.gap}
        itemWidth={props.itemWidth}
        itemHeight={props.itemHeight}
      />
    </section>
  );
}

function DeferredHorizontalDepthFade({
  rootRef,
  ...props
}: HorizontalDepthFadeProps & {
  rootRef: React.RefObject<HTMLElement | null>;
}) {
  const scrollLength = Math.min(600, Math.max(140, props.scrollLength ?? 280));

  return (
    <section
      ref={rootRef}
      className={cn("relative w-full", props.className)}
      data-presentation="deferred"
      style={{ height: `${scrollLength}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <StaticStrip
          images={props.images.slice(0, 4)}
          gap={props.gap}
          itemWidth={props.itemWidth}
          itemHeight={props.itemHeight}
        />
      </div>
    </section>
  );
}

export function HorizontalDepthFade(props: HorizontalDepthFadeProps) {
  const staticOnMobile = props.staticOnMobile ?? true;
  const rootRef = React.useRef<HTMLElement>(null);
  const [isStatic, setIsStatic] = React.useState(() =>
    shouldUseStaticPresentation(staticOnMobile),
  );
  const [shouldLoadRenderer, setShouldLoadRenderer] = React.useState(false);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const mobileOrCoarse = window.matchMedia(MOBILE_OR_COARSE_QUERY);
    const update = () =>
      setIsStatic(
        reducedMotion.matches ||
          (staticOnMobile && mobileOrCoarse.matches),
      );

    update();
    reducedMotion.addEventListener("change", update);
    mobileOrCoarse.addEventListener("change", update);
    return () => {
      reducedMotion.removeEventListener("change", update);
      mobileOrCoarse.removeEventListener("change", update);
    };
  }, [staticOnMobile]);

  React.useEffect(() => {
    if (isStatic || shouldLoadRenderer) return;
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) {
      setShouldLoadRenderer(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadRenderer(true);
        observer.disconnect();
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [isStatic, shouldLoadRenderer]);

  if (isStatic) return <StaticHorizontalDepthFade {...props} />;

  if (!shouldLoadRenderer) {
    return <DeferredHorizontalDepthFade {...props} rootRef={rootRef} />;
  }

  return (
    <React.Suspense
      fallback={<DeferredHorizontalDepthFade {...props} rootRef={rootRef} />}
    >
      <HorizontalDepthFadeRenderer {...props} />
    </React.Suspense>
  );
}

export type { HorizontalDepthFadeImage, HorizontalDepthFadeProps };

export default HorizontalDepthFade;
