import "server-only";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { FAQsCollapsible } from "@/home/components/faqs-collapsible";

export function FAQs() {
  return (
    <section id="faqs" className="container scroll-mt-18">
      <div className="pt-9 pb-12 md:pt-18 md:pb-24">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[1fr_2fr] md:gap-18">
          <h2 className="font-semibold text-4xl/14 tracking-tight">FAQs.</h2>
          <div className="space-y-8">
            <FAQsCollapsible items={questionsAndAnswers} />
            <Link
              href="mailto:wecare@remark.sh"
              className="relative flex w-fit items-center gap-1 bg-[length:0_100%] bg-[position:0_1.4em] bg-gradient-to-b from-current to-current bg-no-repeat pb-2 font-medium text-base text-muted-foreground leading-none no-underline transition-[background-size] duration-200 ease-in-out before:absolute before:bottom-0 before:h-0.5 before:w-full before:bg-[length:300%_2px] before:bg-[linear-gradient(90deg,currentColor,currentColor_33.33%,transparent_0,transparent_66.66%,currentColor_0,currentColor)] before:bg-[position:right_0_bottom_0] before:bg-no-repeat before:opacity-40 before:transition-[background-position,opacity] before:duration-200 before:content-[''] hover:bg-[length:100%_100%] hover:text-foreground hover:delay-200 hover:before:bg-[position:right_50%_bottom_0] hover:before:opacity-100 hover:before:delay-0"
            >
              Contact us
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const questionsAndAnswers = [
  {
    question: "Do you offer any discounts for annual subscriptions?",
    answer: "No, we only provide monthly plans.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards.",
  },
  {
    question: "Is there a free trial available?",
    answer: "No, but we provide a free-forever plan.",
  },
  {
    question: "What happens if I reach my plan limits?",
    answer:
      "If you exceed your plan limits, you will be notified and given the option to upgrade to a higher plan. If you don't upgrade and repeatedly exceed your plan, your account may be temporarily deactivated.",
  },
];
