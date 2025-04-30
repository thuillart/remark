"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

type Mode = "sign-in" | "sign-up";
type Step = "email" | "magic-link";
type FormValues = z.infer<typeof schema>;

export function SignInSignUpForm({ mode }: { mode: Mode }) {
  const [step, setStep] = useQueryState<Step>("step", {
    defaultValue: "email",
    parse: (value): Step => (value === "magic-link" ? "magic-link" : "email"),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit({ email }: FormValues) {}

  if (step === "magic-link") {
    return <></>;
  }

  return <></>;
}
