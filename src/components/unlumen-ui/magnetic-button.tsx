"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import type { VariantProps } from "class-variance-authority";
import type {
  HTMLMotionProps,
  MotionStyle,
  SpringOptions,
} from "motion/react";

import { cn } from "@/lib/utils";

const magneticButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface MagneticButtonBaseProps
  extends VariantProps<typeof magneticButtonVariants> {
  /** Activation radius in pixels. @default 100 */
  radius?: number;
  springOptions?: SpringOptions;
  /** Pull strength multiplier from 0 to 1. @default 0.5 */
  strength?: number;
  className?: string;
  children?: React.ReactNode;
  style?: MotionStyle;
}

type MagneticAnchorProps = MagneticButtonBaseProps &
  Omit<HTMLMotionProps<"a">, keyof MagneticButtonBaseProps | "href"> & {
    /** Renders the component as a semantic anchor. */
    href: string;
  };

type MagneticNativeButtonProps = MagneticButtonBaseProps &
  Omit<HTMLMotionProps<"button">, keyof MagneticButtonBaseProps> & {
    href?: never;
  };

export type MagneticButtonProps =
  | MagneticAnchorProps
  | MagneticNativeButtonProps;

function isMagneticAnchor(
  props: MagneticButtonProps,
): props is MagneticAnchorProps {
  return typeof props.href === "string";
}

const DEFAULT_SPRING = {
  stiffness: 150,
  damping: 15,
  mass: 0.1,
} satisfies SpringOptions;

export function MagneticButton(props: MagneticButtonProps) {
  const radius = Math.max(1, props.radius ?? 100);
  const strength = Math.min(1, Math.max(0, props.strength ?? 0.5));
  const prefersReducedMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, props.springOptions ?? DEFAULT_SPRING);
  const y = useSpring(rawY, props.springOptions ?? DEFAULT_SPRING);

  const resetPosition = React.useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  React.useEffect(() => {
    if (prefersReducedMotion) resetPosition();
  }, [prefersReducedMotion, resetPosition]);

  const moveTowardPointer = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (
        prefersReducedMotion ||
        event.pointerType === "touch" ||
        window.matchMedia("(pointer: coarse)").matches
      ) {
        resetPosition();
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance >= radius) {
        resetPosition();
        return;
      }

      const pull = (1 - distance / radius) * strength;
      rawX.set(deltaX * pull);
      rawY.set(deltaY * pull);
    },
    [
      prefersReducedMotion,
      radius,
      rawX,
      rawY,
      resetPosition,
      strength,
    ],
  );

  const motionStyle = {
    ...props.style,
    x: prefersReducedMotion ? 0 : x,
    y: prefersReducedMotion ? 0 : y,
  } satisfies MotionStyle;

  if (isMagneticAnchor(props)) {
    const anchorProps = { ...props };
    delete anchorProps.children;
    delete anchorProps.className;
    delete anchorProps.radius;
    delete anchorProps.size;
    delete anchorProps.springOptions;
    delete anchorProps.strength;
    delete anchorProps.style;
    delete anchorProps.variant;

    return (
      <motion.a
        {...anchorProps}
        href={props.href}
        target={props.target}
        rel={
          props.rel ??
          (props.target === "_blank" ? "noopener noreferrer" : undefined)
        }
        style={motionStyle}
        className={cn(
          magneticButtonVariants({
            variant: props.variant,
            size: props.size,
          }),
          props.className,
        )}
        onPointerMove={(event) => {
          moveTowardPointer(event);
          props.onPointerMove?.(event);
        }}
        onPointerLeave={(event) => {
          resetPosition();
          props.onPointerLeave?.(event);
        }}
        onBlur={(event) => {
          resetPosition();
          props.onBlur?.(event);
        }}
      >
        {props.children}
      </motion.a>
    );
  }

  const buttonProps = { ...props };
  delete buttonProps.children;
  delete buttonProps.className;
  delete buttonProps.radius;
  delete buttonProps.size;
  delete buttonProps.springOptions;
  delete buttonProps.strength;
  delete buttonProps.style;
  delete buttonProps.variant;

  return (
    <motion.button
      {...buttonProps}
      type={props.type ?? "button"}
      style={motionStyle}
      className={cn(
        magneticButtonVariants({
          variant: props.variant,
          size: props.size,
        }),
        props.className,
      )}
      onPointerMove={(event) => {
        moveTowardPointer(event);
        props.onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        resetPosition();
        props.onPointerLeave?.(event);
      }}
      onBlur={(event) => {
        resetPosition();
        props.onBlur?.(event);
      }}
    >
      {props.children}
    </motion.button>
  );
}

// The variants are part of the public styling API.
// eslint-disable-next-line react-refresh/only-export-components
export { magneticButtonVariants };
