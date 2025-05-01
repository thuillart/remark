"use client";

import { useAnimate } from "framer-motion";
import React from "react";

export function ContactIcon({ isHovering }: { isHovering: boolean }) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const [group, animateGroup] = useAnimate();
  const [newGroup, animateNewGroup] = useAnimate();
  const [groupHead, animateGroupHead] = useAnimate();
  const [newGroupName, animateNewGroupName] = useAnimate();
  const [newGroupHead, animateNewGroupHead] = useAnimate();

  React.useEffect(() => {
    const animate = async () => {
      if (isHovering && !isAnimating) {
        setIsAnimating(true);

        Promise.all([
          animateGroup(group.current, { x: [0, 10] }, { duration: 0.35 }),
          animateGroupHead(
            groupHead.current,
            { x: [0, -1] },
            { delay: 0, duration: 0.35 },
          ),
          animateNewGroup(
            newGroup.current,
            { x: [-10, 0] },
            { delay: 0, duration: 0.35 },
          ),
          animateNewGroupHead(
            newGroupHead.current,
            { x: [-1, 0] },
            { delay: 0.15, duration: 0.35 },
          ),
          animateNewGroupName(
            newGroupName.current,
            { width: [0, 5.2] },
            { delay: 0, duration: 0.3 },
          ),
        ]);

        setIsAnimating(false);
      }
    };

    animate();
  }, [
    isHovering,
    isAnimating,
    animateGroup,
    group.current,
    animateNewGroup,
    animateGroupHead,
    newGroup.current,
    groupHead.current,
    animateNewGroupHead,
    animateNewGroupName,
    newGroupName.current,
    newGroupHead.current,
  ]);

  return (
    <svg
      fill="none"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      viewBox="0 0 16 16"
    >
      <title>Contact</title>

      <mask id="contact-mask" maskUnits="userSpaceOnUse">
        <path
          d="M13 13.5V2.5C13 2.22 12.78 2 12.5 2L3.5 2C3.22 2 3 2.22 3 2.5V13.5C3 13.78 3.22 14 3.5 14H12.5C12.78 14 13 13.7761 13 13.5Z"
          fill="white"
        />
      </mask>

      <path
        d="M13 13.5V2.5C13 2.22 12.78 2 12.5 2L3.5 2C3.22 2 3 2.22 3 2.5V13.5C3 13.78 3.22 14 3.5 14H12.5C12.78 14 13 13.7761 13 13.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g mask="url(#contact-mask)">
        {/* Group */}
        <g ref={group}>
          <rect
            x="5.4"
            y="3.4"
            rx="0.6"
            fill="currentColor"
            width="5.2"
            height="1.2"
          />
          <circle
            r="2"
            cx="8"
            cy="8.5"
            ref={groupHead}
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M5 12C5.35 11.53 5.8 11.16 6.32 10.9C6.84 10.64 7.42 10.5 8 10.5C8.58 10.5 9.16 10.64 9.68 10.9C10.2 11.16 10.65 11.53 11 12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* New Group */}
        <g ref={newGroup}>
          <rect
            x="5.4"
            y="3.4"
            rx="0.6"
            ref={newGroupName}
            fill="currentColor"
            width="5.2"
            height="1.2"
            stroke="none"
          />
          <circle
            r="2"
            cx="8"
            cy="8.5"
            ref={newGroupHead}
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M5 12C5.35 11.53 5.8 11.16 6.32 10.9C6.84 10.64 7.42 10.5 8 10.5C8.58 10.5 9.16 10.64 9.68 10.9C10.2 11.16 10.65 11.53 11 12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
