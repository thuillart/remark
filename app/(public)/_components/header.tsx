import { AppIconLink } from "@/components/app-icon";
import { HeaderEndContent } from "@/public/components/header-end-content";
import { HeaderLayout } from "@/public/components/header-layout";

export function Header({ startContent }: { startContent?: React.ReactNode }) {
  const hasStartContent = !!startContent;

  return (
    <HeaderLayout>
      <header className="container">
        <div className="py-1 md:pt-6 md:pb-0">
          <div className="flex h-14 items-center justify-between">
            {hasStartContent ? (
              <div className="inline-flex items-center gap-x-2.5">
                <AppIconLink />
                {startContent}
              </div>
            ) : (
              <AppIconLink />
            )}
            <HeaderEndContent />
          </div>
        </div>
      </header>
    </HeaderLayout>
  );
}
