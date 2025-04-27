import { Slot, Slottable } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex items-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-[color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
        link: "whitespace-nowrap text-foreground",
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
        className: " justify-center",
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
      <Slottable>{children}</Slottable>
    </Comp>
  );
}

export { Button, buttonVariants };
