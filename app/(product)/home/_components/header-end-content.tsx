import "server-only";

import { HeaderAuthButtons } from "@/home/components/header-auth-buttons";

export function HeaderEndContent() {
  return (
    <>
      <MobileMenu />
      <DesktopMenu />
    </>
  );
}

function DesktopMenu() {
  return <HeaderAuthButtons />;
}

function MobileMenu() {
  return <></>;
}
