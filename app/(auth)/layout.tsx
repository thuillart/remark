import "server-only";

import { SocialSignOns } from "@/auth/components/social-sign-ons";
import { TermsAgreement } from "@/auth/components/terms-agreement";

export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <div className="!max-w-lg container">
        <div className="flex min-h-dvh items-center justify-center py-8">
          <main className="w-full pt-8">
            <div className="flex flex-col gap-4">
              {children}
              <SocialSignOns />
              <TermsAgreement />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
