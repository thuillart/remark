"use client";

import { animate } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";

interface GlowProps {
  spread?: number;
  disabled?: boolean;
  proximity?: number;
  className?: string;
  borderWidth?: number;
  inactiveZone?: number;
}

const GlowEffect = React.memo(
  ({
    spread = 40,
    disabled = false,
    proximity = 60,
    borderWidth = 3,
    inactiveZone = 0.01,
    className,
  }: GlowProps) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const lastPosition = React.useRef({ x: 0, y: 0 });

    const updateGlowPosition = React.useCallback(
      (
        element: HTMLDivElement,
        mouseX: number,
        mouseY: number,
        { left, top, width, height }: DOMRect,
        inactiveZone: number,
        proximity: number,
      ) => {
        const center = [left + width * 0.5, top + height * 0.5];
        const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;
        const distanceFromCenter = Math.hypot(
          mouseX - center[0],
          mouseY - center[1],
        );

        if (distanceFromCenter < inactiveRadius) {
          element.style.setProperty("--active", "0");
          return;
        }

        const isActive =
          mouseX > left - proximity &&
          mouseX < left + width + proximity &&
          mouseY > top - proximity &&
          mouseY < top + height + proximity;

        element.style.setProperty("--active", isActive ? "1" : "0");
        return isActive ? { center, mouseX, mouseY } : null;
      },
      [],
    );

    const animateGlow = React.useCallback(
      (
        element: HTMLDivElement,
        mouseX: number,
        mouseY: number,
        center: number[],
      ) => {
        // Get angle between mouse and element center for glow rotation
        const currentAngle =
          Number.parseFloat(element.style.getPropertyValue("--start")) || 0;
        const targetAngle =
          (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI +
          90;

        // Rotation will always take the shortest path
        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + angleDiff;

        animate(currentAngle, newAngle, {
          ease: [0.16, 1, 0.3, 1],
          duration: 2,
          onUpdate: (value) =>
            element.style.setProperty("--start", String(value)),
        });
      },
      [],
    );

    type GlowEvent = PointerEvent | Event;
    type Position = { x: number; y: number };

    const handleMove = React.useCallback(
      (event?: GlowEvent) => {
        const element = containerRef.current;

        if (!element) {
          return;
        }

        // Type guard for pointer events
        function isPointerEvent(event?: GlowEvent): event is PointerEvent {
          return event != null && "x" in event && "y" in event;
        }

        // Use last known position for scroll events, current position for pointer events
        const position: Position = isPointerEvent(event)
          ? { x: event.x, y: event.y }
          : lastPosition.current;

        // Update last known position for future scroll events
        if (isPointerEvent(event)) {
          lastPosition.current = position;
        }

        const rect = element.getBoundingClientRect();

        const result = updateGlowPosition(
          element,
          position.x,
          position.y,
          rect,
          inactiveZone,
          proximity,
        );

        if (result) {
          animateGlow(element, result.mouseX, result.mouseY, result.center);
        }
      },
      [inactiveZone, proximity, updateGlowPosition, animateGlow],
    );

    React.useEffect(() => {
      if (disabled) {
        return;
      }

      let frameId: number;

      // Throttle events with requestAnimationFrame for performance
      function scheduleUpdate(event?: GlowEvent) {
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => handleMove(event));
      }

      // Handle pointer movements
      const onPointerMove = (event: PointerEvent) => scheduleUpdate(event);
      // Handle scroll events
      const onScroll = () => scheduleUpdate();

      document.body.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        cancelAnimationFrame(frameId);
        document.body.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
      };
    }, [disabled, handleMove]);

    return (
      <>
        <div
          className={cn(
            "-inset-px pointer-events-none absolute hidden rounded-[inherit] border border-white opacity-100 transition-opacity",
            disabled && "!block",
          )}
        />

        <div
          ref={containerRef}
          style={
            {
              "--start": "0",
              "--active": "0",
              "--spread": spread,
              "--gradient": `repeating-conic-gradient(
                  from 236.84deg at 50% 50%,
                  var(--color-muted-foreground),
                  var(--color-muted-foreground) calc(25% / var(--repeating-conic-gradient-times))
                )`,
              "--border-width": `${borderWidth}px`,
              "--repeating-conic-gradient-times": "5",
            } as React.CSSProperties
          }
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity",
            className,
            disabled && "!hidden",
          )}
        >
          <div
            className={cn(
              "glow rounded-[inherit] after:absolute after:inset-[calc(-1*var(--border-width))] after:rounded-[inherit] after:opacity-[var(--active)] after:transition-opacity after:duration-300 after:content-[''] after:[background-attachment:fixed] after:[background:var(--gradient)] after:[border:var(--border-width)_solid_transparent] after:[mask-clip:padding-box,border-box] after:[mask-composite:intersect] after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]",
            )}
          />
        </div>
      </>
    );
  },
);

GlowEffect.displayName = "GlowEffect";

export { GlowEffect };
