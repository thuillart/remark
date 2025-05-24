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
  tooltip: string;
}

export function getTag(tag: FeedbackTag, impact: FeedbackImpact): TagProps {
  const getTooltip = (tag: FeedbackTag, impact: FeedbackImpact): string => {
    if (impact === "positive") {
      switch (tag) {
        case "bug":
          return "When something is working exceptionally well";
        case "feature_request":
          return "When a new feature is particularly appreciated";
        case "ui":
          return "When the design is particularly well done";
        case "ux":
          return "When the user experience is especially smooth";
        case "speed":
          return "When the performance is impressively fast";
        case "security":
          return "When security measures are particularly robust";
        case "pricing":
          return "When the pricing feels especially fair";
        case "billing":
          return "When the billing process is particularly smooth";
        case "dx":
          return "When the developer experience is especially great";
        case "i18n":
          return "When language support is particularly well implemented";
        case "compliance":
          return "When compliance measures are particularly well handled";
        case "a11y":
          return "When accessibility features are especially well done";
        case "kudos":
          return "When someone wants to express special appreciation";
      }
    } else if (impact === "critical") {
      switch (tag) {
        case "bug":
          return "When something is severely broken and needs immediate attention";
        case "feature_request":
          return "When a critical feature is urgently needed";
        case "ui":
          return "When the design is severely problematic";
        case "ux":
          return "When the user experience is critically broken";
        case "speed":
          return "When performance is critically slow";
        case "security":
          return "When there's a critical security vulnerability";
        case "pricing":
          return "When pricing is critically misaligned";
        case "billing":
          return "When there's a critical billing issue";
        case "dx":
          return "When the developer experience is critically broken";
        case "i18n":
          return "When language support is critically missing";
        case "compliance":
          return "When there's a critical compliance issue";
        case "a11y":
          return "When there's a critical accessibility barrier";
        case "kudos":
          return "When someone wants to highlight critical appreciation";
      }
    } else if (impact === "major") {
      switch (tag) {
        case "bug":
          return "When something is significantly broken";
        case "feature_request":
          return "When an important feature is needed";
        case "ui":
          return "When the design needs significant improvement";
        case "ux":
          return "When the user experience needs major improvement";
        case "speed":
          return "When performance needs significant optimization";
        case "security":
          return "When there's a significant security concern";
        case "pricing":
          return "When pricing needs significant adjustment";
        case "billing":
          return "When there's a significant billing issue";
        case "dx":
          return "When the developer experience needs major improvement";
        case "i18n":
          return "When language support needs significant work";
        case "compliance":
          return "When there's a significant compliance issue";
        case "a11y":
          return "When accessibility needs significant improvement";
        case "kudos":
          return "When someone wants to express major appreciation";
      }
    } else {
      // minor
      switch (tag) {
        case "bug":
          return "When something's not working quite right";
        case "feature_request":
          return "When someone wants a new feature";
        case "ui":
          return "When the design needs tweaking";
        case "ux":
          return "When the user flow feels off";
        case "speed":
          return "When things are running a bit slow";
        case "security":
          return "For security-related concerns";
        case "pricing":
          return "When the pricing needs adjustment";
        case "billing":
          return "When there's a billing problem";
        case "dx":
          return "When the dev experience could be better";
        case "i18n":
          return "When language support is needed";
        case "compliance":
          return "When there's a compliance issue";
        case "a11y":
          return "When accessibility needs improvement";
        case "kudos":
          return "When someone wants to say thanks";
      }
    }
  };

  switch (tag) {
    case "bug":
      return {
        Icon: RiBug2Line,
        label: "Bug",
        variant: "destructive",
        tooltip: getTooltip(tag, impact),
      };
    case "feature_request":
      return {
        Icon: RiLightbulbLine,
        label: "Feature Request",
        variant: "yellow",
        tooltip: getTooltip(tag, impact),
      };
    case "ui":
      return {
        Icon: SwatchBook,
        label: "UI",
        variant: "pink",
        tooltip: getTooltip(tag, impact),
      };
    case "ux":
      return {
        Icon: RiFlowChart,
        label: "UX",
        variant: "orange",
        tooltip: getTooltip(tag, impact),
      };
    case "speed":
      return {
        Icon: RiSpeedUpLine,
        label: "Speed",
        variant: "blue",
        tooltip: getTooltip(tag, impact),
      };
    case "security":
      return {
        Icon: RiShieldLine,
        label: "Security",
        variant: "destructive",
        tooltip: getTooltip(tag, impact),
      };
    case "pricing":
      return {
        Icon: RiMoneyDollarBoxLine,
        label: "Pricing",
        variant: "green",
        tooltip: getTooltip(tag, impact),
      };
    case "billing":
      return {
        Icon: RiBillLine,
        label: "Billing",
        variant: "green",
        tooltip: getTooltip(tag, impact),
      };
    case "dx":
      return {
        Icon: RiBracketsLine,
        label: "DX",
        variant: "indigo",
        tooltip: getTooltip(tag, impact),
      };
    case "i18n":
      return {
        Icon: RiTranslate2,
        label: "i18n",
        variant: "blue",
        tooltip: getTooltip(tag, impact),
      };
    case "compliance":
      return {
        Icon: RiAuctionLine,
        label: "Compliance",
        variant: "purple",
        tooltip: getTooltip(tag, impact),
      };
    case "a11y":
      return {
        Icon: RiAccessibilityLine,
        label: "A11y",
        variant: "blue",
        tooltip: getTooltip(tag, impact),
      };
    case "kudos":
      return {
        Icon: Heart,
        label: "Kudos",
        variant: "teal",
        tooltip: getTooltip(tag, impact),
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
