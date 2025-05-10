import { Footer } from "@/home/components/footer";
import { Header } from "@/home/components/header";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
