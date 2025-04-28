import { type LucideIcon, XIcon } from "lucide-react";
import { type ToasterProps, toast as sonnerToast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastProps = {
  id: string | number;
  Icon: LucideIcon;
  title: string;
  button?: { label: string; onClick: () => void };
  variant?: "default" | "destructive";
  position?: ToasterProps["position"];
  description?: string;
};

function Toast({
  id,
  Icon,
  title,
  variant = "default",
  position,
  description,
}: ToastProps) {
  return (
    <div className="flex w-[var(--width)] items-center justify-between gap-4 rounded-lg border border-border bg-background p-4 shadow-black/5 shadow-lg">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border border-border",
          variant === "destructive" && "text-destructive",
        )}
      >
        <Icon size={20} className="opacity-60" />
      </div>

      <div className="flex w-full flex-col gap-1">
        <p className="font-medium text-sm">{title}</p>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => sonnerToast.dismiss(id)}
        className="shrink-0"
      >
        <XIcon size={20} />
      </Button>
    </div>
  );
}

function showToast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        Icon={toast.Icon}
        title={toast.title}
        button={toast.button}
        variant={toast.variant}
        description={toast.description}
      />
    ),
    { position: toast.position },
  );
}

export { showToast, Toast, type ToastProps };
