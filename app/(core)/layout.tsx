import "server-only";

import { Header } from "@/core/components/header";
import { Sidebar } from "@/core/components/sidebar";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header />
        <div className="h-[calc(100dvh-4rem)] overflow-auto pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}
