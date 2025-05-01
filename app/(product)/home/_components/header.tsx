import "server-only";

import { LogoLink } from "@/components/logo";
import { HeaderEndContent } from "@/home/components/header-end-content";
import { HeaderLayout } from "@/home/components/header-layout";

export function Header({ startContent }: { startContent?: React.ReactNode }) {
  return (
    <HeaderLayout>
      <header className="container">
        <div className="pt-6">
          <div className="flex h-14 items-center justify-between">
            <div className="inline-flex items-center gap-x-2.5">
              <LogoLink />
              {startContent}
            </div>
            <HeaderEndContent />
          </div>
        </div>
      </header>
    </HeaderLayout>
  );
}
