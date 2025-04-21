import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="bg-background after:border-border fixed inset-0 bottom-auto after:absolute after:inset-0 after:top-auto after:border-b">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Logo />
        </div>
      </div>
    </header>
  );
}
