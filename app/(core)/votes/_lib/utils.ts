import { BadgeProps } from "@/components/ui/badge";
import { Vote } from "@/votes/lib/schema";
import { Archive, Clock3, Construction, LucideIcon } from "lucide-react";

interface Status {
  Icon: LucideIcon;
  label: string;
  variant: BadgeProps["variant"];
}

export function getStatus(status: Vote["status"]): Status {
  if (status === "in_progress") {
    return {
      Icon: Construction,
      label: "Cooking",
      variant: "orange",
    };
  }
  if (status === "completed") {
    return {
      Icon: Archive,
      label: "Done",
      variant: "green",
    };
  }
  if (status === "open") {
    return {
      Icon: Clock3,
      label: "Open",
      variant: "blue",
    };
  }
}
