"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface HoverExpandItem {
  /** Stable identifier used for keys and accessible relationships. */
  id?: string;
  label: string;
  /** e.g. country, year, category */
  sublabel?: string;
  image: string;
  imageAlt?: string;
  /** Short descriptor shown when expanded. */
  description?: string;
  /** When provided, the row is rendered as a semantic anchor. */
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

export interface HoverExpandProps {
  items: HoverExpandItem[];
  /**
   * Row height when collapsed, in pixels.
   * @default 68
   */
  collapsedHeight?: number;
  /**
   * Row height when expanded, in pixels.
   * @default 320
   */
  expandedHeight?: number;
  /** Item expanded before the first interaction. */
  defaultExpandedIndex?: number | null;
  /** Called when a row is activated by click, tap, or keyboard. */
  onItemSelect?: (item: HoverExpandItem, index: number) => void;
  className?: string;
}

export function HoverExpand({
  items,
  collapsedHeight = 68,
  expandedHeight = 320,
  defaultExpandedIndex = null,
  onItemSelect,
  className,
}: HoverExpandProps) {
  const prefersReducedMotion = useReducedMotion();
  const baseId = React.useId();
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(
    defaultExpandedIndex,
  );
  const activeIndex = hoveredIndex ?? focusedIndex ?? selectedIndex;

  const toggleSelected = React.useCallback((index: number) => {
    setSelectedIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div className="w-full border-t border-current opacity-15" />

      {items.map((item, index) => {
        const itemKey = item.id ?? `${item.label}-${item.image}`;
        const panelId = `${baseId}-${item.id ?? index}-panel`;
        const descriptionId = item.description
          ? `${baseId}-${item.id ?? index}-description`
          : undefined;
        const isExpanded = activeIndex === index;
        const isOtherExpanded = activeIndex !== null && !isExpanded;
        const transition = prefersReducedMotion
          ? { duration: 0 }
          : {
              height: {
                type: "spring" as const,
                stiffness: 280,
                damping: 32,
                mass: 0.9,
              },
              opacity: { duration: 0.22, ease: "easeOut" as const },
            };

        const content = (
          <>
            <motion.div
              id={panelId}
              aria-hidden={!isExpanded}
              className="absolute inset-0 h-full w-full"
              initial={false}
              animate={{
                opacity: isExpanded ? 1 : 0,
                scale: prefersReducedMotion || isExpanded ? 1 : 1.06,
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      opacity: {
                        duration: 0.45,
                        ease: [0.23, 1, 0.32, 1],
                      },
                      scale: {
                        duration: 0.55,
                        ease: [0.23, 1, 0.32, 1],
                      },
                    }
              }
            >
              <img
                src={item.image}
                alt={item.imageAlt ?? ""}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
            </motion.div>

            <div className="absolute inset-0 flex items-end px-5 pb-4">
              <div className="flex w-full items-end justify-between gap-4">
                <div className="flex min-w-0 items-baseline gap-3">
                  <motion.span
                    className="shrink-0 text-xs tabular-nums opacity-40"
                    animate={{
                      color: isExpanded ? "#ffffff" : "currentColor",
                      opacity: isExpanded ? 0.5 : 0.4,
                    }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </motion.span>

                  <motion.span
                    className="truncate font-semibold tracking-tight"
                    style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}
                    animate={{
                      color: isExpanded ? "#ffffff" : "currentColor",
                    }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  >
                    {item.label}
                  </motion.span>

                  {item.description && (
                    <motion.span
                      id={descriptionId}
                      className="hidden truncate text-sm text-white/70 sm:block"
                      initial={false}
                      animate={{
                        opacity: isExpanded ? 1 : 0,
                        x: prefersReducedMotion || isExpanded ? 0 : -8,
                      }}
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : {
                              duration: 0.3,
                              delay: isExpanded ? 0.12 : 0,
                              ease: [0.23, 1, 0.32, 1],
                            }
                      }
                    >
                      — {item.description}
                    </motion.span>
                  )}
                </div>

                {item.sublabel && (
                  <motion.span
                    className="shrink-0 text-xs uppercase tracking-widest"
                    animate={{
                      color: isExpanded
                        ? "rgba(255,255,255,0.55)"
                        : "currentColor",
                      opacity: isExpanded ? 1 : 0.45,
                    }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  >
                    {item.sublabel}
                  </motion.span>
                )}
              </div>
            </div>
          </>
        );

        const sharedClassName =
          "relative block w-full cursor-pointer overflow-hidden text-left focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-inset";
        const handlePointerEnter = (
          event: React.PointerEvent<HTMLElement>,
        ) => {
          if (event.pointerType !== "touch") setHoveredIndex(index);
        };
        const handlePointerLeave = () => setHoveredIndex(null);
        const handleFocus = () => setFocusedIndex(index);
        const handleBlur = () => setFocusedIndex(null);

        const row = item.href ? (
          <motion.a
            href={item.href}
            target={item.target}
            rel={
              item.rel ??
              (item.target === "_blank" ? "noopener noreferrer" : undefined)
            }
            aria-expanded={isExpanded}
            aria-controls={panelId}
            aria-describedby={descriptionId}
            className={sharedClassName}
            animate={{
              height: isExpanded ? expandedHeight : collapsedHeight,
              opacity: isOtherExpanded ? 0.38 : 1,
            }}
            transition={transition}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={(event) => {
              const isCoarsePointer = window.matchMedia(
                "(hover: none), (pointer: coarse)",
              ).matches;

              if (isCoarsePointer && selectedIndex !== index) {
                event.preventDefault();
                setSelectedIndex(index);
                return;
              }

              onItemSelect?.(item, index);
            }}
          >
            {content}
          </motion.a>
        ) : (
          <motion.button
            type="button"
            aria-expanded={isExpanded}
            aria-controls={panelId}
            aria-describedby={descriptionId}
            className={sharedClassName}
            animate={{
              height: isExpanded ? expandedHeight : collapsedHeight,
              opacity: isOtherExpanded ? 0.38 : 1,
            }}
            transition={transition}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={() => {
              toggleSelected(index);
              onItemSelect?.(item, index);
            }}
          >
            {content}
          </motion.button>
        );

        return (
          <React.Fragment key={itemKey}>
            {row}
            <div className="w-full border-t border-current opacity-15" />
          </React.Fragment>
        );
      })}
    </div>
  );
}
