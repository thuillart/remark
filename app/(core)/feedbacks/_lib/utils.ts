import {
  Braces,
  Bug,
  CreditCard,
  Gauge,
  Heart,
  Languages,
  Lightbulb,
  LucideIcon,
  PersonStanding,
  Receipt,
  Scale,
  Shield,
  SwatchBook,
  Workflow,
} from "lucide-react";

import { type BadgeProps } from "@/components/ui/badge";
import { FeedbackImpact, FeedbackTag } from "@/lib/schema";

interface TagProps {
  Icon: LucideIcon;
  label: string;
  variant: BadgeProps["variant"];
}

export function getTag(tag: FeedbackTag): TagProps {
  switch (tag) {
    case "bug":
      return {
        Icon: Bug,
        label: "Bug",
        variant: "destructive",
      };
    case "feature_request":
      return {
        Icon: Lightbulb,
        label: "Feature Request",
        variant: "yellow",
      };
    case "ui":
      return {
        Icon: SwatchBook,
        label: "UI",
        variant: "pink",
      };
    case "ux":
      return {
        Icon: Workflow,
        label: "UX",
        variant: "orange",
      };
    case "speed":
      return {
        Icon: Gauge,
        label: "Speed",
        variant: "blue",
      };
    case "security":
      return {
        Icon: Shield,
        label: "Security",
        variant: "destructive",
      };
    case "pricing":
      return {
        Icon: Receipt,
        label: "Pricing",
        variant: "green",
      };
    case "billing":
      return {
        Icon: CreditCard,
        label: "Billing",
        variant: "green",
      };
    case "dx":
      return {
        Icon: Braces,
        label: "DX",
        variant: "indigo",
      };
    case "i18n":
      return {
        Icon: Languages,
        label: "i18n",
        variant: "blue",
      };
    case "compliance":
      return {
        Icon: Scale,
        label: "Compliance",
        variant: "purple",
      };
    case "a11y":
      return {
        Icon: PersonStanding,
        label: "A11y",
        variant: "blue",
      };
    case "kudos":
      return {
        Icon: Heart,
        label: "Kudos",
        variant: "teal",
      };
  }
}

interface ImpactProps {
  label: string;
  variant: BadgeProps["variant"];
  description: string;
}

export function getImpact(impact: FeedbackImpact): ImpactProps {
  switch (impact) {
    case "critical":
      return {
        label: "Critical",
        variant: "destructive",
        description: "thinks this needs attention now before it gets worse",
      };
    case "major":
      return {
        label: "Major",
        variant: "warning",
        description: "thinks this could become serious if not fixed soon",
      };
    case "minor":
      return {
        label: "Minor",
        variant: "secondary",
        description: "thinks this can wait but worth checking soon",
      };
    case "positive":
      return {
        label: "Positive",
        variant: "green",
        description: "simply thinks that all your hard work is paying off",
      };
  }
}
