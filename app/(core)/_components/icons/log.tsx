"use client";

import { useAnimate } from "framer-motion";
import React from "react";

export function LogIcon({ isHovering }: { isHovering: boolean }) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const [line1, animateLine1] = useAnimate();
  const [line2, animateLine2] = useAnimate();
  const [line3, animateLine3] = useAnimate();
  const [line4, animateLine4] = useAnimate();

  React.useEffect(() => {
    const animate = async () => {
      if (isHovering && !isAnimating) {
        setIsAnimating(true);

        Promise.all([
          animateLine1(
            line1.current,
            { y: [0, -3], opacity: [1, 0] },
            { duration: 0.23 },
          ),
          animateLine2(
            line2.current,
            { y: [0, -3], width: [7.2, 6.2] },
            { duration: 0.23 },
          ),
          animateLine3(
            line3.current,
            { y: [0, -3], width: [6.2, 7.2] },
            { duration: 0.23 },
          ),
          animateLine4(
            line4.current,
            { y: [0, -3], width: [0, 6.2] },
            { duration: 0.23 },
          ),
        ]);

        setIsAnimating(false);
      }
    };

    animate();
  }, [
    isHovering,
    isAnimating,
    animateLine1,
    animateLine2,
    animateLine3,
    animateLine4,
    line1.current,
    line2.current,
    line3.current,
    line4.current,
  ]);

  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Log</title>

      <rect
        ref={line1}
        x={4.4}
        y={4.4}
        width={6.2}
        height={1.2}
        rx={0.6}
        fill="currentColor"
        stroke="none"
      />

      <rect
        ref={line2}
        x={4.4}
        y={7.4}
        width={7.2}
        height={1.2}
        rx={0.6}
        fill="currentColor"
        stroke="none"
      />

      <rect
        ref={line3}
        x={4.4}
        y={10.4}
        width={6.2}
        height={1.2}
        rx={0.6}
        fill="currentColor"
        stroke="none"
      />

      <rect
        ref={line4}
        x={4.4}
        y={13.4}
        width={0}
        height={1.2}
        rx={0.6}
        fill="currentColor"
        stroke="none"
      />

      <rect
        x={2.5}
        y={1.5}
        rx={1.2}
        fill="none"
        width={11}
        height={13}
        stroke="currentColor"
        strokeWidth={1.2}
      />
    </svg>
  );
}
