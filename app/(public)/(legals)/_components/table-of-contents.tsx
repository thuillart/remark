"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface Heading {
  id: string;
  text: string | null;
  index: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <aside className="hidden pt-20 pb-4 md:col-start-4 md:block">
      <ul className="space-y-3 py-2">
        {headings.map((heading) => (
          <li key={`${heading.id}-${heading.index}`} className="text-sm">
            <Link
              href={`#${heading.id}`}
              className={cn(
                "hover:text-primary transition-colors",
                activeId === heading.id
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
