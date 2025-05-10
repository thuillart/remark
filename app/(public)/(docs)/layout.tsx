import { Footer } from "@/docs/components/footer";
import { Sidebar } from "@/docs/components/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <div className="relative grid h-full pt-12 md:grid-cols-[var(--container-3xs)_minmax(0px,1fr)] md:gap-12 md:pt-20">
        <Sidebar />
        <main className="pt-17">
          <article>{children}</article>
          <Footer />
        </main>
      </div>
    </div>
  );
}
