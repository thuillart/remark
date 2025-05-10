import { FAQsCollapsible } from "@/home/components/faqs-collapsible";
import { FAQsContactUs } from "@/home/components/faqs-contact-us";

export function FAQs() {
  return (
    <section id="faqs" className="container scroll-mt-18">
      <div className="pt-9 pb-12 md:pt-18 md:pb-24">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[1fr_2fr] md:gap-18">
          <h2 className="text-4xl/14 font-semibold tracking-tight">FAQs.</h2>
          <div className="space-y-8">
            <FAQsCollapsible items={questionsAndAnswers} />
            <FAQsContactUs />
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
