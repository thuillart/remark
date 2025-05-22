import { type BadgeProps } from "@/components/ui/badge";
import { FeedbackTag } from "@/lib/schema";
import {
  RemixiconComponentType,
  RiBookLine,
  RiBugLine,
  RiLightbulbLine,
  RiMoneyDollarBoxLine,
  RiPaletteLine,
  RiShieldLine,
  RiSpeedLine,
  RiTerminalLine,
  RiThumbUpLine,
  RiTranslate2,
  RiUserVoiceLine,
} from "@remixicon/react";

export function getTag(tag: FeedbackTag):
  | {
      Icon: RemixiconComponentType;
      label: string;
      variant: BadgeProps["variant"];
    }
  | undefined {
  if (!tag) return undefined;

  switch (tag) {
    case "bug":
      return {
        Icon: RiBugLine,
        label: "Bug",
        variant: "destructive",
      };
    case "feature_request":
      return {
        Icon: RiLightbulbLine,
        label: "Request",
        variant: "yellow",
      };
    case "ui":
      return {
        Icon: RiPaletteLine,
        label: "UI",
        variant: "pink",
      };
    case "ux":
      return {
        Icon: RiUserVoiceLine,
        label: "UX",
        variant: "orange",
      };
    case "speed":
      return {
        Icon: RiSpeedLine,
        label: "Speed",
        variant: "yellow",
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
        Icon: RiMoneyDollarBoxLine,
        label: "Billing",
        variant: "green",
      };
    case "dx":
      return {
        Icon: RiTerminalLine,
        label: "DX",
        variant: "indigo",
      };
    case "i18n":
      return {
        Icon: RiTranslate2,
        label: "i18n",
        variant: "yellow",
      };
    case "compliance":
      return {
        Icon: RiBookLine,
        label: "Compliance",
        variant: "purple",
      };
    case "a11y":
      return {
        Icon: RiUserVoiceLine,
        label: "A11y",
        variant: "blue",
      };
    case "kudos":
      return {
        Icon: RiThumbUpLine,
        label: "Kudos",
        variant: "teal",
      };
    default:
      return undefined;
  }
}

export function getImpactBadgeVariant(
  impact: string | undefined,
): BadgeProps["variant"] {
  if (!impact) return "secondary";
  switch (impact.toLowerCase()) {
    case "critical":
      return "destructive";
    case "major":
      return "warning";
    default:
      return "secondary";
  }
}
