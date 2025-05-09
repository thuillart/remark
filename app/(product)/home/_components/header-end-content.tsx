import "server-only";

import { Suspense } from "react";

import { HeaderAuthButtons } from "@/home/components/header-auth-buttons";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
