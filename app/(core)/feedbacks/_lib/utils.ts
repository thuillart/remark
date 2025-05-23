import { type BadgeProps } from "@/components/ui/badge";
import { FeedbackImpact, FeedbackTag } from "@/lib/schema";
import {
  RemixiconComponentType,
  RiAccessibilityLine,
  RiAuctionLine,
  RiBillLine,
  RiBracketsLine,
  RiBrushLine,
  RiBug2Line,
  RiFlowChart,
  RiHeart3Line,
  RiLightbulbLine,
  RiMoneyDollarBoxLine,
  RiShieldLine,
  RiSpeedUpLine,
  RiTranslate2,
} from "@remixicon/react";

interface TagProps {
  Icon: RemixiconComponentType;
  label: string;
  variant: BadgeProps["variant"];
  tooltip: string;
}

export function getTag(tag: FeedbackTag): TagProps {
  switch (tag) {
    case "bug":
      return {
        Icon: RiBug2Line,
        label: "Bug",
        variant: "destructive",
        tooltip: "When something's not working right",
      };
    case "feature_request":
      return {
        Icon: RiLightbulbLine,
        label: "Feature Request",
        variant: "yellow",
        tooltip: "When someone wants a new feature",
      };
    case "ui":
      return {
        Icon: RiBrushLine,
        label: "UI",
        variant: "pink",
        tooltip: "When the design needs tweaking",
      };
    case "ux":
      return {
        Icon: RiFlowChart,
        label: "UX",
        variant: "orange",
        tooltip: "When the user flow feels off",
      };
    case "speed":
      return {
        Icon: RiSpeedUpLine,
        label: "Speed",
        variant: "blue",
        tooltip: "When things are running slow",
      };
    case "security":
      return {
        Icon: RiShieldLine,
        label: "Security",
        variant: "destructive",
        tooltip: "For security-related concerns",
      };
    case "pricing":
      return {
        Icon: RiMoneyDollarBoxLine,
        label: "Pricing",
        variant: "green",
        tooltip: "When the pricing needs adjustment",
      };
    case "billing":
      return {
        Icon: RiBillLine,
        label: "Billing",
        variant: "green",
        tooltip: "When there's a billing problem",
      };
    case "dx":
      return {
        Icon: RiBracketsLine,
        label: "DX",
        variant: "indigo",
        tooltip: "When the dev experience could be better",
      };
    case "i18n":
      return {
        Icon: RiTranslate2,
        label: "i18n",
        variant: "blue",
        tooltip: "When language support is needed",
      };
    case "compliance":
      return {
        Icon: RiAuctionLine,
        label: "Compliance",
        variant: "purple",
        tooltip: "When there's a compliance issue",
      };
    case "a11y":
      return {
        Icon: RiAccessibilityLine,
        label: "A11y",
        variant: "blue",
        tooltip: "When accessibility needs improvement",
      };
    case "kudos":
      return {
        Icon: RiHeart3Line,
        label: "Kudos",
        variant: "teal",
        tooltip: "When someone wants to say thanks",
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
