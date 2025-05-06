import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const alertVariants = cva("relative rounded-lg border", {
  variants: {
    variant: {
      error: "border-red-500/50 text-red-600",
      warning: "border-amber-500/50 text-amber-600",
      default: "border-border bg-card text-card-foreground",
    },
    size: {
      sm: "px-4 py-3",
      lg: "p-4",
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "default",
  },
});

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  action?: React.ReactNode;
  layout?: "row" | "complex";
}

function Alert({
  icon,
  size,
  layout = "row",
  action,
  variant,
  children,
  className,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ size, variant }), className)}
      {...props}
    >
      {layout === "row" ? (
        // Single line variant
        <div className="flex items-center gap-2">
          <div className="flex grow items-center">
            {icon && <span className="me-3 inline-flex">{icon}</span>}
            {children}
          </div>
          {action && <div className="flex shrink-0 items-center">{action}</div>}
        </div>
      ) : (
        // Multi-line variant
        <div className="flex gap-2">
          {icon && children ? (
            <div className="flex grow gap-3">
              <span className="mt-0.5 shrink-0">{icon}</span>
              <div className="grow">{children}</div>
            </div>
          ) : (
            <div className="grow">
              {icon && <span className="me-3 inline-flex">{icon}</span>}
              {children}
            </div>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("font-medium text-sm", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AlertContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

export { Alert, AlertContent, AlertDescription, AlertTitle };
