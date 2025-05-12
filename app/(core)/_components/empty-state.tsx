import type { RemixiconComponentType } from "@remixicon/react";
import { createElement } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string | React.ReactNode;
  icons?: RemixiconComponentType[];
  action?:
    | {
        label: string;
        onClick: () => void;
        isLoading?: boolean;
      }
    | React.ReactNode;
  className?: string;
  description: string | React.ReactNode;
}

const isActionObject = (
  action: EmptyStateProps["action"],
): action is { label: string; onClick: () => void; isLoading?: boolean } => {
  return (
    typeof action === "object" &&
    action !== null &&
    "label" in action &&
    "onClick" in action
  );
};

export function EmptyState({
  title,
  icons = [],
  action,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "group border-border bg-background hover:border-border/80 hover:bg-muted/50 w-full rounded-xl border-2 border-dashed p-14 text-center transition duration-500 hover:duration-200",
        className,
      )}
    >
      <div className="isolate flex justify-center">
        {icons.length === 3 ? (
          <>
            <div className="bg-background ring-border relative top-1.5 left-2.5 grid size-12 -rotate-6 place-items-center rounded-xl shadow-lg ring-1 transition duration-500 group-hover:-translate-x-5 group-hover:-translate-y-0.5 group-hover:-rotate-12 group-hover:duration-200">
              {createElement(icons[0], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>

            <div className="bg-background ring-border relative z-10 grid size-12 place-items-center rounded-xl shadow-lg ring-1 transition duration-500 group-hover:-translate-y-0.5 group-hover:duration-200">
              {createElement(icons[1], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>

            <div className="bg-background ring-border relative top-1.5 right-2.5 grid size-12 rotate-6 place-items-center rounded-xl shadow-lg ring-1 transition duration-500 group-hover:translate-x-5 group-hover:-translate-y-0.5 group-hover:rotate-12 group-hover:duration-200">
              {createElement(icons[2], {
                className: "w-6 h-6 text-muted-foreground",
              })}
            </div>
          </>
        ) : (
          <div className="bg-background ring-border grid size-12 place-items-center rounded-xl shadow-lg ring-1 transition duration-500 group-hover:-translate-y-0.5 group-hover:duration-200">
            {icons[0] &&
              createElement(icons[0], {
                className: "w-6 h-6 text-muted-foreground",
              })}
          </div>
        )}
      </div>

      <h2 className="text-foreground mt-6 font-medium">{title}</h2>

      <p className="text-muted-foreground mt-1 text-sm whitespace-pre-line">
        {description}
      </p>

      {action &&
        (typeof action === "object" && "type" in action ? (
          action
        ) : (
          <Button
            variant="outline"
            onClick={isActionObject(action) ? action.onClick : undefined}
            loading={isActionObject(action) ? action.isLoading : undefined}
            className="mt-4 shadow-sm active:shadow-none"
          >
            {isActionObject(action) ? action.label : ""}
          </Button>
        ))}
    </div>
  );
}
