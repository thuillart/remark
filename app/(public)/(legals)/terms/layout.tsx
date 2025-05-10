import { PageTitle } from "@/legals/components/page-title";

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitle title="Terms of Service" />
      {children}
    </>
  );
}
