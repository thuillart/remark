"use client";

import { motion, useAnimate } from "framer-motion";
import Link from "next/link";
import React from "react";

export function Logo({ size = 20 }: { size?: number }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const [scope1, animate1] = useAnimate();
  const [scope2, animate2] = useAnimate();
  const [scope3, animate3] = useAnimate();
  const [scope4, animate4] = useAnimate();

  React.useEffect(() => {
    const animate = async () => {
      if (isHovered && !isAnimating) {
        setIsAnimating(true);

        Promise.all([
          animate1(scope1.current, { pathLength: [1, 0] }, { duration: 0.4 }),
          animate2(
            scope2.current,
            { pathLength: [0, 1], pathOffset: [1, 0] },
            { duration: 0.8 },
          ),
          animate3(
            scope3.current,
            { pathLength: [1, 0], pathOffset: [1, 0] },
            { duration: 0.4 },
          ),
          animate4(
            scope4.current,
            { pathLength: [0, 1], pathOffset: [1, 0] },
            { duration: 0.4 },
          ),
        ]);

        setIsAnimating(false);
      }
    };

    animate();
  }, [isHovered, isAnimating]);

  return (
    <Link
      href="/"
      className="inline-flex h-fit items-center gap-2 transition-opacity hover:opacity-70"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <svg
        fill="none"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        stroke="currentColor"
        viewBox="0 0 16 16"
        strokeWidth={1.2}
        strokeLinecap="round"
      >
        <motion.path
          d="M13.7872 13.7853C15.0093 12.5632 13.3885 8.961 10.167 5.73952C6.9455 2.51803 3.34329 0.897191 2.12121 2.11927C0.899135 3.34134 2.51998 6.94356 5.74146 10.165C8.96294 13.3865 12.5652 15.0074 13.7872 13.7853Z"
          ref={scope1}
          initial={{ pathLength: 0, pathOffset: 0 }}
        />
        <motion.path
          d="M13.7872 13.7853C15.0093 12.5632 13.3885 8.961 10.167 5.73952C6.9455 2.51803 3.34329 0.897191 2.12121 2.11927C0.899135 3.34134 2.51998 6.94356 5.74146 10.165C8.96294 13.3865 12.5652 15.0074 13.7872 13.7853Z"
          ref={scope2}
          initial={{ pathLength: 1, pathOffset: 0 }}
        />
        <motion.path
          d="M2.12121 13.7853C0.899135 12.5632 2.51998 8.961 5.74146 5.73952C8.96294 2.51803 12.5652 0.897191 13.7872 2.11927C15.0093 3.34134 13.3885 6.94356 10.167 10.165C6.9455 13.3865 3.34329 15.0074 2.12121 13.7853Z"
          ref={scope3}
          initial={{ pathLength: 1, pathOffset: 0 }}
        />
        <motion.path
          d="M2.12121 13.7853C0.899135 12.5632 2.51998 8.961 5.74146 5.73952C8.96294 2.51803 12.5652 0.897191 13.7872 2.11927C15.0093 3.34134 13.3885 6.94356 10.167 10.165C6.9455 13.3865 3.34329 15.0074 2.12121 13.7853Z"
          ref={scope4}
          initial={{ pathLength: 1, pathOffset: 0 }}
        />
      </svg>
      <span className="mb-0.5 font-mono text-lg/5 font-medium">remark</span>
    </Link>
  );
}
