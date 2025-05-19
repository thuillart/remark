import { PageTitle } from "@/legals/components/page-title";
import { TableOfContents } from "@/legals/components/table-of-contents";

export default function LegalNoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="col-span-3">
        <PageTitle title="Notice" updatedAt={new Date("2024-05-18")} />
        {children}
      </div>
      <TableOfContents
        headings={[
          {
            id: "site-publisher",
            text: "Site Publisher",
            index: 0,
          },
          {
            id: "publication-director",
            text: "Publication Director",
            index: 1,
          },
          {
            id: "hosting-provider",
            text: "Hosting Provider",
            index: 2,
          },
          {
            id: "contact-us",
            text: "Contact Us",
            index: 3,
          },
        ]}
      />
    </>
  );
}
