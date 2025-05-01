import "server-only";

import { Suspense } from "react";

import { Fallback } from "@/auth/components/fallback";
import { SignInSignUpForm } from "@/auth/components/sign-in-sign-up-form";

export default function SignInPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <SignInSignUpForm mode="sign-in" />
    </Suspense>
  );
}
