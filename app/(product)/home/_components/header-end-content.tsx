import { Suspense } from "react";
import { headers } from "next/headers";

import { HeaderAuthButtons } from "@/home/components/header-auth-buttons";
import { auth } from "@/lib/auth";

export function HeaderEndContent() {
  return (
    <Suspense>
      <AuthProvider />
    </Suspense>
  );
}

async function AuthProvider() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <HeaderAuthButtons isSignedIn={!!session} />
    </>
  );
}

async function DesktopMenu({ isSignedIn }: { isSignedIn: boolean }) {
  return;
}
