"use client";

import { motion, useAnimate } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export function HeroArtwork() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [ellipse1, animate1] = useAnimate();
  const [ellipse2, animate2] = useAnimate();
  const [ellipse3, animate3] = useAnimate();
  const [ellipse4, animate4] = useAnimate();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    try {
      await Promise.all([
        animate1(
          ellipse1.current,
          { pathLength: [1, 0] },
          { ease: "easeInOut", duration: 0.35 },
        ),
        animate2(
          ellipse2.current,
          { pathOffset: [1, 0] },
          { delay: 0.175, duration: 0.35, ease: "easeInOut" },
        ),
        animate3(
          ellipse3.current,
          { pathLength: [1, 0] },
          { delay: 0.175, duration: 0.35, ease: "easeInOut" },
        ),
        animate4(
          ellipse4.current,
          { pathOffset: [1, 0] },
          { delay: 0.35, duration: 0.35, ease: "easeInOut" },
        ),
      ]);
    } finally {
      setIsAnimating(false);
    }
  }, [
    animate1,
    animate2,
    animate3,
    animate4,
    ellipse1,
    ellipse2,
    ellipse3,
    ellipse4,
    isAnimating,
  ]);

  useEffect(() => {
    timeoutRef.current = setTimeout(startAnimation, 3000);
    intervalRef.current = setInterval(startAnimation, 8000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAnimation]);

  return (
    <svg
      fill="none"
      width={100}
      xmlns="http://www.w3.org/2000/svg"
      height={100}
      stroke="currentColor"
      viewBox="0 0 16 16"
      strokeWidth={0.75}
      strokeLinecap="round"
    >
      <title>Artwork</title>
      <motion.path
        d="M13.7872 13.7853C15.0093 12.5632 13.3885 8.961 10.167 5.73952C6.9455 2.51803 3.34329 0.897191 2.12121 2.11927C0.899135 3.34134 2.51998 6.94356 5.74146 10.165C8.96294 13.3865 12.5652 15.0074 13.7872 13.7853Z"
        ref={ellipse1}
        initial={{ pathLength: 1, pathOffset: 0 }}
      />
      <motion.path
        d="M13.7872 13.7853C15.0093 12.5632 13.3885 8.961 10.167 5.73952C6.9455 2.51803 3.34329 0.897191 2.12121 2.11927C0.899135 3.34134 2.51998 6.94356 5.74146 10.165C8.96294 13.3865 12.5652 15.0074 13.7872 13.7853Z"
        ref={ellipse2}
        initial={{ pathLength: 1, pathOffset: 1 }}
      />
      <motion.path
        d="M2.12121 13.7853C0.899135 12.5632 2.51998 8.961 5.74146 5.73952C8.96294 2.51803 12.5652 0.897191 13.7872 2.11927C15.0093 3.34134 13.3885 6.94356 10.167 10.165C6.9455 13.3865 3.34329 15.0074 2.12121 13.7853Z"
        ref={ellipse3}
        initial={{ pathLength: 1, pathOffset: 0 }}
      />
      <motion.path
        d="M2.12121 13.7853C0.899135 12.5632 2.51998 8.961 5.74146 5.73952C8.96294 2.51803 12.5652 0.897191 13.7872 2.11927C15.0093 3.34134 13.3885 6.94356 10.167 10.165C6.9455 13.3865 3.34329 15.0074 2.12121 13.7853Z"
        ref={ellipse4}
        initial={{ pathLength: 1, pathOffset: 1 }}
      />
    </svg>
  );
}
