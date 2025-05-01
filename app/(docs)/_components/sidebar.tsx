"use client";

import { ChevronRightIcon } from "lucide-react";
import {
  type Transition,
  type Variants,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "@/lib/utils";

interface Item {
  href: string;
  title: string;
  items?: Item[];
}

interface Section {
  title: string;
  items: Item[];
}

// Navigation structure with nested items support
// Each section can have items, and items can have nested items
const items: Section[] = [
  {
    title: "Documentation",
    items: [{ href: "/docs", title: "Introduction" }],
  },
  {
    title: "Quickstart",
    items: [
      {
        href: "/docs/node",
        title: "Node.js",
        items: [{ href: "/docs/next", title: "Next.js" }],
      },
    ],
  },
];

// For expandable items
const variants: Variants = {
  open: {
    opacity: 1,
    height: "auto",
  },
  closed: {
    opacity: 0,
    height: 0,
  },
};

// For expandable items
const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 25,
  stiffness: 250,
  restDelta: 0.01,
};

export function Sidebar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const [open, setOpen] = React.useState<Record<string, boolean>>({});

  // Track scroll position for header-aware positioning
  useMotionValueEvent(scrollY, "change", (current) => {
    setHasScrolled(current > 0);
  });

  const handleOpen = (href: string) => {
    setOpen((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  // Handle click events with special case for expandable items
  // Prevents navigation when clicking on an expandable item that's already active
  const handleClick = (
    href: string,
    event: React.MouseEvent<HTMLAnchorElement>,
    hasItems: boolean,
  ) => {
    if (href === pathname && hasItems) {
      event.preventDefault();
      handleOpen(href);
    }
  };

  // Init and maintain open states based on current path
  // Ensures correct section is expanded when navigating directly to a nested page
  React.useEffect(() => {
    setOpen((prevOpen) => {
      const newOpen = { ...prevOpen }; // Preserve existing open states

      const checkItems = (items: Item[], parentHref?: string) => {
        for (const item of items) {
          if (item.href) {
            // If this is the current path, mark it and its parent as open
            if (item.href === pathname) {
              newOpen[item.href] = true;
              if (parentHref) {
                newOpen[parentHref] = true;
              }
            }
          }
          if (item.items) {
            // Pass the current item's href as parent to its children
            checkItems(item.items, item.href);
          }
        }
      };

      for (const section of items) {
        checkItems(section.items);
      }

      return newOpen;
    });
  }, [pathname]);

  return (
    <motion.aside
      // Dynamic positioning based on scroll state
      animate={{ "--not-translate-y": hasScrolled ? "24px" : "0px" }}
      className="sticky top-20 h-full max-h-[calc(100vh-var(--header-height)+var(--not-translate-y))] [--header-height:calc(var(--spacing)*14)] max-md:hidden"
      transition={{ type: "spring", bounce: 0, duration: 0.45 }}
    >
      <div className="relative h-full">
        <motion.div
          // Smooth scroll-aware positioning
          animate={{ "--translate-y": hasScrolled ? "0px" : "24px" }}
          className="relative h-full overflow-y-scroll pt-17.5 pb-10 [scrollbar-width:none] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:block after:h-10 after:w-full after:content-[''] after:[background-image:linear-gradient(transparent,var(--color-background))]"
          transition={{ type: "spring", bounce: 0, duration: 0.45 }}
        >
          <nav className="relative block w-full select-none p-0">
            {items.map(({ title, items }) => (
              <div key={title} className="group/section">
                <p className="mb-2 font-medium text-sm/4">{title}</p>
                <ul className="group-not-last/section:pb-6">
                  {items.map(({ href, title, items }) => (
                    <li key={title} className="relative">
                      <span>
                        <Link
                          href={href}
                          onClick={(event) => handleClick(href, event, !!items)}
                          data-active={href === pathname}
                          className={cn(
                            "inline-flex w-full items-center py-1.5 text-sm opacity-40 transition-[opacity,font-weight] duration-200 hover:opacity-70 data-[active=true]:font-medium data-[active=true]:opacity-100 dark:opacity-50 dark:data-[active=true]:opacity-100 dark:hover:opacity-70",
                          )}
                        >
                          {title}
                        </Link>

                        {items && (
                          <button
                            type="button"
                            onClick={() => handleOpen(href)}
                            data-open={open[href]}
                            className="group/button absolute inset-0 left-auto flex size-8 cursor-pointer items-center justify-center rounded-full opacity-40 transition-opacity hover:opacity-70 data-[open=true]:opacity-100 dark:opacity-50 dark:data-[open=true]:opacity-100 dark:hover:opacity-70"
                          >
                            <ChevronRightIcon
                              size={16}
                              className="transition-transform duration-200 group-data-[open=true]/button:rotate-90 group-data-[open=true]/button:scale-110"
                            />
                          </button>
                        )}
                      </span>

                      {items && (
                        <motion.ul
                          initial={false}
                          animate={open[href] ? "open" : "closed"}
                          variants={variants}
                          className="overflow-hidden pl-5"
                          transition={transition}
                        >
                          {items.map(({ href, title }) => (
                            <li key={title}>
                              <Link
                                href={href}
                                className={cn(
                                  "inline-flex w-full items-center gap-2.5 py-1.5 text-sm",
                                )}
                              >
                                <span
                                  data-active={href === pathname}
                                  className="opacity-40 transition-[opacity,font-weight] duration-200 hover:opacity-70 data-[active=true]:font-medium data-[active=true]:opacity-100 dark:opacity-50 dark:data-[active=true]:opacity-100 dark:hover:opacity-70"
                                >
                                  {title}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </motion.div>
      </div>
    </motion.aside>
  );
}
