import { Footer } from "@/public/components/footer";
import { Header } from "@/public/components/header";
import { HeaderStartContent } from "@/public/components/header-start-content";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header startContent={<HeaderStartContent />} />
      {children}
      <Footer />
    </>
  );
}
