import { Slot, Slottable } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { ArrowUpRightIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "whitespace-nowrap rounded-md font-medium outline-none transition-[color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "group/link relative inline-block whitespace-nowrap pr-4.5 text-foreground underline decoration-border underline-offset-5 transition-[color,text-decoration-color] duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:decoration-current dark:hover:decoration-current",
      },
      loading: {
        true: "text-transparent",
      },
      size: {
        default: "",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    compoundVariants: [
      {
        variant: ["default", "outline", "secondary"],
        size: "default",
        className: "h-9 px-4 py-2",
      },
      {
        variant: ["default", "outline", "secondary"],
        className: "inline-flex items-center justify-center gap-2 text-sm",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps extends React.ComponentProps<"button"> {
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  size,
  variant,
  loading,
  asChild,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isLink = variant === "link";

  const content = isLink ? (
    <span>
      {children}
      <ArrowUpRightIcon className="group-hover/link:-translate-y-px absolute mt-1.25 ml-0.5 inline-block size-[1em] text-muted-foreground no-underline transition duration-[inherit] ease-[inherit] group-hover/link:translate-x-px group-hover/link:text-primary" />
    </span>
  ) : (
    children
  );

  return (
    <Comp
      disabled={disabled || loading}
      data-slot="button"
      className={cn(buttonVariants({ size, variant, loading, className }))}
      {...props}
    >
      {loading && (
        <Loader2Icon
          size={20}
          className={cn(
            "absolute animate-spin text-foreground",
            // Used for conditional styling when button is loading
            "loading",
          )}
        />
      )}
      <Slottable>{content}</Slottable>
    </Comp>
  );
}

export { Button, buttonVariants };
