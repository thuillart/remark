import { ArrowUpRightIcon } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import React from "react";

import { CodeExample } from "@/components/code-example";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  PaginationGroup,
  PaginationNext,
  PaginationPrevious,
} from "@/docs/components/pagination";
import { cn } from "@/lib/utils";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
      <h1
        className="mb-12 border-b pb-3 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
        {...props}
      />
    ),
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="mt-16 mb-6 text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
      <h3
        className="mb-4 text-base font-medium tracking-tight not-first:mt-8"
        {...props}
      />
    ),
    p: (props: React.ComponentPropsWithoutRef<"p">) => (
      <p
        className="mb-5 text-base/relaxed text-neutral-700 dark:text-neutral-300"
        {...props}
      />
    ),
    a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<"a">) => {
      const className =
        "group/link pr-4.5 whitespace-nowrap text-neutral-950 underline decoration-neutral-300 underline-offset-5 transition-[color,text-decoration-color] duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:decoration-current dark:text-neutral-50 dark:decoration-neutral-600 dark:hover:decoration-current";

      if (href?.startsWith("/")) {
        return (
          <Link
            href={href}
            target="_blank"
            className={cn(className)}
            {...props}
          >
            {children}
            <ArrowUpRightIcon className="text-muted-foreground group-hover/link:text-primary absolute mt-1.25 inline-block size-[1em] no-underline transition duration-[inherit] ease-[inherit] group-hover/link:translate-x-px group-hover/link:-translate-y-px" />
          </Link>
        );
      }

      if (href?.startsWith("#")) {
        return (
          <a href={href} className={className} {...props}>
            {children}
          </a>
        );
      }

      return (
        <a href={href} target="_blank" className={cn(className)} {...props}>
          {children}{" "}
          <ArrowUpRightIcon className="text-muted-foreground group-hover/link:text-primary absolute mt-1.5 ml-0.5 inline-block size-[1em] no-underline transition duration-[inherit] ease-[inherit] group-hover/link:translate-x-px group-hover/link:-translate-y-px" />
        </a>
      );
    },
    hr: (props: React.ComponentPropsWithoutRef<"hr">) => (
      <hr {...props} className="bg-border my-12" />
    ),
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
      <ul
        {...props}
        className="[&_li]:marker:text-muted-foreground my-5 list-disc pl-6 [&_li]:pl-1.5 [&_li]:text-base/relaxed"
      />
    ),
    li: (props: React.ComponentPropsWithoutRef<"li">) => (
      <li {...props} className="my-2 text-neutral-700 dark:text-neutral-300" />
    ),
    code: (props: React.ComponentPropsWithoutRef<"code">) => (
      <code
        className="font-mono text-sm/6 font-semibold text-neutral-950 dark:text-neutral-50"
        {...props}
      />
    ),
    pre: (props) => {
      const child = React.Children.only(props.children) as React.ReactElement<{
        className?: string;
        children: string;
      }>;

      if (!child) {
        return null;
      }

      let { className, children: code } = child.props;
      const lang = className ? className.replace("language-", "") : "";
      let filename = undefined;
      let showLineNumbers = false;

      // Split the code into lines and look for metadata
      const lines = code.split("\n");
      const metadataLine = lines[0].trim();

      // Parse metadata if it exists
      if (metadataLine.startsWith("// @")) {
        const metadata = metadataLine
          .replace("// @", "")
          .split(" ")
          .reduce(
            (acc, item) => {
              const [key, value] = item.split("=");
              if (key && value) {
                acc[key] = value.replace(/"/g, "");
              } else if (key) {
                acc[key] = true;
              }
              return acc;
            },
            {} as Record<string, string | boolean>,
          );

        filename = metadata.filename as string;
        showLineNumbers = metadata.showLineNumbers as boolean;

        // Remove the metadata line
        lines.shift();
      }

      code = lines.join("\n");

      return (
        <div>
          <CodeExample
            example={{ lang, code }}
            filename={filename}
            showLineNumbers={showLineNumbers}
          />
        </div>
      );
    },
    LinkableCard: ({
      href,
      title,
      children,
      description,
    }: {
      href: string;
      title: string;
      children: React.ReactNode;
      description?: string;
    }) => (
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        className="group/card transition-200 relative inline cursor-pointer text-inherit no-underline ease-out"
      >
        <div
          className={cn(
            "text-muted-foreground group-hover/card:bg-foreground/2.5 relative flex size-full flex-col gap-4 overflow-hidden rounded-lg rounded-tr-3xl px-4 pt-5 pb-4 leading-loose shadow-[inset_0_0_0_1px_var(--color-border)] transition-[180ms] select-none group-hover/card:rounded-tr-[2.25rem]",
            "before:bg-background before:absolute before:top-0 before:right-0 before:z-3 before:size-7.5 before:translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:shadow-[0_1px_0_0_var(--color-border)] before:transition-[inherit] before:content-[''] group-hover/card:before:size-10.5 group-hover/card:before:translate-x-1/2 group-hover/card:before:-translate-y-1/2 group-hover/card:before:rotate-45",
            "after:bg-foreground/2.5 after:absolute after:top-0 after:right-0 after:z-2 after:size-7 after:translate-x-2 after:-translate-y-2 after:rounded-bl-md after:shadow-[-1px_1px_0_0_var(--color-border)] after:transition-[inherit] after:content-[''] group-hover/card:after:translate-x-0 group-hover/card:after:-translate-y-0",
          )}
        >
          {children}
          <div className="flex flex-col gap-2">
            <h3 className="text-foreground text-base font-medium">{title}</h3>
            {description && <p className="text-sm">{description}</p>}
          </div>
        </div>
      </Link>
    ),
    LinkableCardGroup: ({ children }: { children: React.ReactNode }) => (
      <div className="grid w-full gap-6 md:grid-cols-2">{children}</div>
    ),
    PaginationNext,
    PaginationGroup,
    PaginationPrevious,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
  };
}
