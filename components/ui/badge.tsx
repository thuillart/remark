import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center ring ring-inset gap-1 whitespace-nowrap rounded-md font-medium text-xs transition-[color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground ring-transparent [a&]:hover:bg-primary/90",
        secondary:
          "bg-neutral-50 ring ring-inset text-neutral-600 ring-neutral-500/10 dark:bg-neutral-400/10 dark:text-neutral-400 dark:ring-neutral-400/20",
        destructive:
          "bg-red-50 text-red-700 ring-red-700/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30",
        warning:
          "bg-amber-50 text-amber-700 ring-amber-700/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground ring ring-inset",
        blue: "bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30",
        yellow:
          "bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20",
        green:
          "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-500 dark:ring-green-500/20",
        indigo:
          "bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30",
      },
      size: {
        default: "px-2 py-1",
        sm: "px-1.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({
  size,
  variant,
  asChild = false,
  className,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ size, variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants, type BadgeProps };
