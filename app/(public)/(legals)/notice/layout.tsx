import { PageTitle } from "@/legals/components/page-title";

export default function LegalNoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitle title="Notice" updatedAt={new Date("2024-05-18")} />
      {children}
    </>
  );
}
