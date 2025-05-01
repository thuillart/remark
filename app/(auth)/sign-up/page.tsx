import "server-only";

import { Suspense } from "react";

import { Fallback } from "@/auth/components/fallback";
import { SignInSignUpForm } from "@/auth/components/sign-in-sign-up-form";

export default function SignUpPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <SignInSignUpForm mode="sign-up" />
    </Suspense>
  );
}
