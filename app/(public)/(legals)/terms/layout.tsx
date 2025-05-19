import { PageTitle } from "@/legals/components/page-title";
import { TableOfContents } from "@/legals/components/table-of-contents";

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="col-span-3">
        <PageTitle title="Terms" updatedAt={new Date("2024-05-18")} />
        {children}
      </div>
      <TableOfContents
        headings={[
          {
            id: "definitions",
            text: "Definitions",
            index: 0,
          },
          {
            id: "eligibility",
            text: "Eligibility",
            index: 1,
          },
          {
            id: "description-of-the-service",
            text: "Description of the Service",
            index: 2,
          },
          {
            id: "how-it-works",
            text: "How It Works",
            index: 3,
          },
          {
            id: "pricing-and-subscription",
            text: "Pricing and Subscription",
            index: 4,
          },
          {
            id: "payment-issues",
            text: "Payment Issues",
            index: 5,
          },
          {
            id: "service-availability",
            text: "Service Availability",
            index: 6,
          },
          {
            id: "limitation-of-liability",
            text: "Limitation of Liability",
            index: 7,
          },
          {
            id: "intellectual-property",
            text: "Intellectual Property",
            index: 8,
          },
          {
            id: "personal-data",
            text: "Personal Data",
            index: 9,
          },
          {
            id: "modifications",
            text: "Modifications",
            index: 10,
          },
          {
            id: "account-termination",
            text: "Account Termination",
            index: 11,
          },
          {
            id: "contact",
            text: "Contact",
            index: 12,
          },
        ]}
      />
    </>
  );
}
