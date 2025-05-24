import { type BadgeProps } from "@/components/ui/badge";
import { FeedbackImpact, FeedbackTag } from "@/lib/schema";
import {
  RemixiconComponentType,
  RiAccessibilityLine,
  RiAuctionLine,
  RiBillLine,
  RiBracketsLine,
  RiBug2Line,
  RiFlowChart,
  RiLightbulbLine,
  RiMoneyDollarBoxLine,
  RiShieldLine,
  RiSpeedUpLine,
  RiTranslate2,
} from "@remixicon/react";
import { Heart, LucideIcon, SwatchBook } from "lucide-react";

interface TagProps {
  Icon: RemixiconComponentType | LucideIcon;
  label: string;
  variant: BadgeProps["variant"];
}

export function getTag(tag: FeedbackTag): TagProps {
  switch (tag) {
    case "bug":
      return {
        Icon: RiBug2Line,
        label: "Bug",
        variant: "destructive",
      };
    case "feature_request":
      return {
        Icon: RiLightbulbLine,
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
        Icon: RiFlowChart,
        label: "UX",
        variant: "orange",
      };
    case "speed":
      return {
        Icon: RiSpeedUpLine,
        label: "Speed",
        variant: "blue",
      };
    case "security":
      return {
        Icon: RiShieldLine,
        label: "Security",
        variant: "destructive",
      };
    case "pricing":
      return {
        Icon: RiMoneyDollarBoxLine,
        label: "Pricing",
        variant: "green",
      };
    case "billing":
      return {
        Icon: RiBillLine,
        label: "Billing",
        variant: "green",
      };
    case "dx":
      return {
        Icon: RiBracketsLine,
        label: "DX",
        variant: "indigo",
      };
    case "i18n":
      return {
        Icon: RiTranslate2,
        label: "i18n",
        variant: "blue",
      };
    case "compliance":
      return {
        Icon: RiAuctionLine,
        label: "Compliance",
        variant: "purple",
      };
    case "a11y":
      return {
        Icon: RiAccessibilityLine,
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
