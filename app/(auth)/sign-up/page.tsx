import "server-only";

import { AuthForm } from "@/auth/components/form";
import { Logo } from "@/components/logo";

export default function SignUpPage() {
  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
          <Logo variant="icon" />
        </div>
        <div className="flex flex-col text-center">
          <h2 className="font-semibold text-lg tracking-tight">
            Sign up to Nucleon
          </h2>
          <p className="text-muted-foreground text-sm">
            We just need a few details to get you started.
          </p>
        </div>
        <AuthForm mode="sign-up" />
      </div>
    </>
  );
}
