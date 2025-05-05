import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageTitleProps = {
  title: string;
  endContent?: ReactNode;
  description?: string;
};

export function PageTitle({ title, description, endContent }: PageTitleProps) {
  return (
    <div className="container">
      <div
        className={cn("py-8", {
          "flex items-center justify-between": endContent,
          "flex flex-col gap-2": !endContent && description,
        })}
      >
        {endContent && description ? (
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        ) : !endContent && description ? (
          <>
            <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-sm">{description}</p>
          </>
        ) : (
          <h1 className="font-semibold text-3xl tracking-tight">{title}</h1>
        )}

        {endContent}
      </div>
    </div>
  );
}
