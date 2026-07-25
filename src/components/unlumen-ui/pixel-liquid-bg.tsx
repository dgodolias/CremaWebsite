"use client";

import * as React from "react";

import type { CSSProperties } from "react";
import type { PixelLiquidBgProps } from "./pixel-liquid-bg-renderer";

import { cn } from "@/lib/utils";

const PixelLiquidRenderer = React.lazy(() =>
  import("./pixel-liquid-bg-renderer").then((module) => ({
    default: module.PixelLiquidBg,
  })),
);

const STATIC_PRESENTATION_QUERY =
  "(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse), (max-width: 767px)";
const DEFAULT_DARK_PALETTE = [
  "#000000",
  "#2a0020",
  "#8c0f60",
  "#e8227a",
  "#ff85b3",
];
const DEFAULT_LIGHT_PALETTE = [
  "#ffffff",
  "#FD96E5",
  "#F36AC3",
  "#FE4396",
  "#ff85b3",
];

function requiresStaticPresentation() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(STATIC_PRESENTATION_QUERY).matches
  );
}

function getStaticSurfaceStyle(
  palette: string[],
  pixelSize: number,
): CSSProperties {
  const [base = "#000000", accent = base, highlight = accent] = palette;
  const gridSize = Math.max(8, Math.round(pixelSize));
  const gridLine = "color-mix(in srgb, currentColor 7%, transparent)";

  return {
    backgroundColor: base,
    backgroundImage: [
      `radial-gradient(circle at 18% 24%, ${highlight} 0, transparent 38%)`,
      `radial-gradient(circle at 82% 72%, ${accent} 0, transparent 42%)`,
      `linear-gradient(135deg, ${base}, ${accent})`,
      `linear-gradient(to right, ${gridLine} 1px, transparent 1px)`,
      `linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
    ].join(","),
    backgroundSize: `auto, auto, auto, ${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px`,
  };
}

function StaticPixelLiquidBg({
  darkPalette = DEFAULT_DARK_PALETTE,
  lightPalette = DEFAULT_LIGHT_PALETTE,
  pixelSize = 18,
  staticFallbackClassName,
  children,
  className,
  forceStatic: _forceStatic,
  autoDemo: _autoDemo,
  cursorSize: _cursorSize,
  mouseForce: _mouseForce,
  resolution: _resolution,
  ...props
}: PixelLiquidBgProps) {
  void _forceStatic;
  void _autoDemo;
  void _cursorSize;
  void _mouseForce;
  void _resolution;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-background",
        className,
      )}
      data-renderer="static"
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 dark:hidden",
          staticFallbackClassName,
        )}
        style={getStaticSurfaceStyle(lightPalette, pixelSize)}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 hidden dark:block",
          staticFallbackClassName,
        )}
        style={getStaticSurfaceStyle(darkPalette, pixelSize)}
      />
      {children && (
        <div className="relative z-10 h-full w-full">{children}</div>
      )}
    </div>
  );
}

export function PixelLiquidBg(props: PixelLiquidBgProps) {
  const [mediaRequiresStatic, setMediaRequiresStatic] = React.useState(
    requiresStaticPresentation,
  );
  const useStatic = Boolean(props.forceStatic) || mediaRequiresStatic;

  React.useEffect(() => {
    const media = window.matchMedia(STATIC_PRESENTATION_QUERY);
    const update = () => setMediaRequiresStatic(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (useStatic) return <StaticPixelLiquidBg {...props} />;

  return (
    <React.Suspense fallback={<StaticPixelLiquidBg {...props} />}>
      <PixelLiquidRenderer {...props} />
    </React.Suspense>
  );
}

export type { PixelLiquidBgProps };

export default PixelLiquidBg;
