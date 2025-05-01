"use client";

import { useAnimate } from "framer-motion";
import React from "react";

export function LogIcon({ isHovering }: { isHovering: boolean }) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const [logNew, animateLogNew] = useAnimate();
  const [logBack, animateLogBack] = useAnimate();
  const [logFront, animateLogFront] = useAnimate();
  const [logBackOverlay, animateLogBackOverlay] = useAnimate();

  React.useEffect(() => {
    const animate = async () => {
      if (isHovering && !isAnimating) {
        setIsAnimating(true);

        Promise.all([
          animateLogFront(
            logFront.current,
            {
              y: [0, 9.25],
              height: [9.25, 0],
              rx: [2.625, 1],
            },
            { duration: 0.2 },
          ),
          animateLogBack(
            logBack.current,
            {
              x: [0, -2],
              y: [0, 4],
              width: [9.25, 13.25],
            },
            { delay: 0.1, duration: 0.2 },
          ),
          animateLogBackOverlay(
            logBackOverlay.current,
            { fillOpacity: [0, 1] },
            { delay: 0.1, duration: 0.2 },
          ),
          animateLogNew(
            logNew.current,
            {
              x: [4, 0],
              width: [0, 8],
            },
            { delay: 0.2, duration: 0.2 },
          ),
        ]);

        setIsAnimating(false);
      }
    };

    animate();
  }, [
    isHovering,
    isAnimating,
    animateLogFront,
    animateLogBack,
    animateLogBackOverlay,
    animateLogNew,
    logFront.current,
    logBack.current,
    logBackOverlay.current,
    logNew.current,
  ]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      height={16}
      width={16}
      fill="none"
      style={{ overflow: "visible" }}
    >
      <title>Log</title>

      <rect
        x={4}
        y={2}
        rx={1}
        ref={logNew}
        fill="var(--color-background)"
        width={0}
        height={8}
        stroke="currentColor"
        strokeWidth={1.2}
      />

      <rect
        ref={logBack}
        x={3.375}
        y={1.375}
        rx={1.2}
        fill="var(--color-background)"
        width={9.25}
        height={9.25}
        stroke="currentColor"
        strokeWidth={1.2}
      />

      <rect
        ref={logBackOverlay}
        x={3.375}
        y={1.375}
        rx={1}
        width={9.25}
        height={9.25}
        stroke="currentColor"
        fillOpacity={0}
        strokeWidth={1.25}
      />

      <rect
        ref={logFront}
        x={1.375}
        y={5.375}
        rx={1}
        width={13.25}
        height={9.25}
        stroke="currentColor"
        strokeWidth={1.25}
      />
    </svg>
  );
}
