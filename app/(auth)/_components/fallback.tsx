import { Loader2Icon } from "lucide-react";

export function Fallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2Icon size={20} className="animate-spin" />
    </div>
  );
}
