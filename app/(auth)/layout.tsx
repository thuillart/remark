import "server-only";

import { Nav } from "@/auth/components/nav";
import { SSO } from "@/auth/components/sso";
import { Terms } from "@/auth/components/terms";

export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="!max-w-lg container">
        <div className="flex min-h-dvh items-center justify-center py-8">
          <main className="w-full pt-8">
            <div className="flex flex-col gap-4">
              {children}
              <SSO />
              <Terms />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
