import "server-only";

import { headers } from "next/headers";
import type React from "react";
import { Suspense } from "react";

import { HeaderButtons } from "@/home/components/header-buttons";
import { auth } from "@/lib/auth";

export function HeaderEndContent() {
  return (
    <>
      <Suspense>
        <Provider />
      </Suspense>
    </>
  );
}

async function Provider() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <MobileMenu isSignedIn={!!session} />
      <DesktopMenu isSignedIn={!!session} />
    </>
  );
}

function DesktopMenu({ isSignedIn }: { isSignedIn: boolean }) {
  return <HeaderButtons isSignedIn={isSignedIn} />;
}

function MobileMenu({ isSignedIn }: { isSignedIn: boolean }) {
  return <></>;
}
