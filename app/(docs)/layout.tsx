import { Footer } from "@/docs/components/footer";
import { HeaderStartContent } from "@/docs/components/header-start-content";
import { Sidebar } from "@/docs/components/sidebar";
import { Header } from "@/home/components/header";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header startContent={<HeaderStartContent />} />
      <div className="container">
        <div className="relative grid h-full pt-12 md:grid-cols-[var(--container-3xs)_minmax(0px,1fr)] md:gap-12 md:pt-20">
          <Sidebar />
          <main className="pt-17">
            <article>{children}</article>
            <Footer />
          </main>
        </div>
      </div>
    </>
  );
}
