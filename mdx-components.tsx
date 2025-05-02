import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Children } from "react";

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

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props: React.ComponentPropsWithoutRef<"h1">) => (
      <h1
        className="mb-12 border-b pb-3 font-semibold text-2xl text-neutral-950 tracking-tight dark:text-neutral-50"
        {...props}
      />
    ),
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="mt-16 mb-6 font-semibold text-neutral-950 text-xl tracking-tight dark:text-neutral-50"
        {...props}
      />
    ),
    h3: ({ className, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
      <h3
        className="not-first:mt-8 mb-4 font-medium text-base tracking-tight"
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
            <ArrowUpRightIcon className="group-hover/link:-translate-y-px absolute mt-1.25 ml-0.5 inline-block size-[1em] text-muted-foreground no-underline transition duration-[inherit] ease-[inherit] group-hover/link:translate-x-px group-hover/link:text-primary" />
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
          <ArrowUpRightIcon className="group-hover/link:-translate-y-px absolute mt-1.5 ml-0.5 inline-block size-[1em] text-muted-foreground no-underline transition duration-[inherit] ease-[inherit] group-hover/link:translate-x-px group-hover/link:text-primary" />
        </a>
      );
    },
    hr: (props: React.ComponentPropsWithoutRef<"hr">) => (
      <hr {...props} className="my-12 bg-border" />
    ),
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => (
      <ul
        {...props}
        className="my-5 list-disc pl-6 [&_li]:pl-1.5 [&_li]:text-base/relaxed [&_li]:marker:text-muted-foreground"
      />
    ),
    li: (props: React.ComponentPropsWithoutRef<"li">) => (
      <li {...props} className="my-2 text-neutral-700 dark:text-neutral-300" />
    ),
    code: (props: React.ComponentPropsWithoutRef<"code">) => (
      <code
        className="font-mono font-semibold text-neutral-950 text-sm/6 dark:text-neutral-50"
        {...props}
      />
    ),
    pre: (props) => {
      const child = Children.only(props.children) as React.ReactElement<{
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
        className="group/card relative inline cursor-pointer text-inherit no-underline transition-200 ease-out"
      >
        <div
          className={cn(
            "relative flex size-full select-none flex-col gap-4 overflow-hidden rounded-lg rounded-tr-3xl px-4 pt-5 pb-4 text-muted-foreground leading-loose shadow-[inset_0_0_0_1px_var(--color-border)] transition-[180ms] group-hover/card:rounded-tr-[2.25rem] group-hover/card:bg-foreground/2.5",
            "before:-translate-y-1/2 group-hover/card:before:-translate-y-1/2 before:absolute before:top-0 before:right-0 before:z-3 before:size-7.5 before:translate-x-1/2 before:rotate-45 before:bg-background before:shadow-[0_1px_0_0_var(--color-border)] before:transition-[inherit] before:content-[''] group-hover/card:before:size-10.5 group-hover/card:before:translate-x-1/2 group-hover/card:before:rotate-45",
            "after:-translate-y-2 group-hover/card:after:-translate-y-0 after:absolute after:top-0 after:right-0 after:z-2 after:size-7 after:translate-x-2 after:rounded-bl-md after:bg-foreground/2.5 after:shadow-[-1px_1px_0_0_var(--color-border)] after:transition-[inherit] after:content-[''] group-hover/card:after:translate-x-0",
          )}
        >
          {children}
          <div className="flex flex-col gap-2">
            <h3 className="font-medium text-base text-foreground">{title}</h3>
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
