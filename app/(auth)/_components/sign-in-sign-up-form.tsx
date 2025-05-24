"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeAlertIcon, InboxIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CircleArrow } from "@/components/circle-arrow";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

type Step = "email" | "inbox";
type Mode = "sign-in" | "sign-up";
type FormValues = z.infer<typeof formSchema>;
type OAuthProvider = "github" | "gitlab";

export function SignInSignUpForm({ mode }: { mode: Mode }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("email");
  const [isLoading, setIsLoading] = React.useState<OAuthProvider | null>(null);
  const [isHovering, setIsHovering] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  React.useEffect(() => {
    if (isSignUp) return; // Don't preload passkeys for sign up

    if (
      !PublicKeyCredential.isConditionalMediationAvailable ||
      !PublicKeyCredential.isConditionalMediationAvailable()
    ) {
      return;
    }

    void authClient.signIn.passkey({
      autoFill: true,
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  }, [router, isSignUp]);

  async function onSubmit({ email }: FormValues) {
    const { error } = await authClient.signIn.magicLink({
      email,
    });

    if (error) {
      toast({
        Icon: BadgeAlertIcon,
        title: "Something went wrong",
        variant: "destructive",
        description: "Couldn't send you a magic link.",
      });
    }

    setStep("inbox");
  }

  async function signInWithOAuthProvider(provider: OAuthProvider) {
    setIsLoading(provider);

    const { error } = await authClient.signIn.social({
      provider,
    });

    if (error) {
      setIsLoading(null);
    }
  }

  if (step === "inbox") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-11 items-center justify-center rounded-full border">
            <InboxIcon size={20} className="opacity-60" />
          </div>

          <div className="flex flex-col gap-1.5 text-center">
            <h2 className="text-lg font-semibold tracking-tight">
              Check your inbox
            </h2>
            <p className="text-muted-foreground text-sm text-balance">
              Click the link we&apos;ve just sent you to{" "}
              <span className="text-foreground font-medium">
                {form.getValues("email")}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border select-none">
          <Logo variant="icon" className="h-4.5 text-2xl" />
        </div>
        <div className="flex flex-col text-center">
          <h2 className="text-lg font-semibold tracking-tight">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isSignUp
              ? "We just need a few details to get you started."
              : "Enter your email to sign in to your account."}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="not-first:mt-6">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    autoComplete="username webauthn"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden password field for passkey */}
          <VisuallyHidden>
            <Input type="password" autoComplete="current-password webauthn" />
          </VisuallyHidden>

          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            className="w-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            Sign {isSignUp ? "Up" : "In"}
            <CircleArrow direction="right" isHovering={isHovering} />
          </Button>
        </form>
      </Form>

      <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
        <span className="text-muted-foreground text-xs uppercase">Or</span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button
          variant="outline"
          loading={isLoading === "github"}
          onClick={() => signInWithOAuthProvider("github")}
          className="w-full"
        >
          <svg
            fill="none"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 1024 1024"
            className="fill-[#1B1F23] dark:fill-white"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              transform="scale(64)"
            />
          </svg>
          Sign {isSignUp ? "Up" : "In"} with GitHub
        </Button>

        <Button
          variant="outline"
          loading={isLoading === "gitlab"}
          onClick={() => signInWithOAuthProvider("gitlab")}
          className="w-full"
        >
          <svg
            fill="none"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 32 32"
          >
            <path
              d="m31.46 12.78-.04-.12-4.35-11.35A1.14 1.14 0 0 0 25.94.6c-.24 0-.47.1-.66.24-.19.15-.33.36-.39.6l-2.94 9h-11.9l-2.94-9A1.14 1.14 0 0 0 6.07.58a1.15 1.15 0 0 0-1.14.72L.58 12.68l-.05.11a8.1 8.1 0 0 0 2.68 9.34l.02.01.04.03 6.63 4.97 3.28 2.48 2 1.52a1.35 1.35 0 0 0 1.62 0l2-1.52 3.28-2.48 6.67-5h.02a8.09 8.09 0 0 0 2.7-9.36Z"
              fill="#E24329"
            />
            <path
              d="m31.46 12.78-.04-.12a14.75 14.75 0 0 0-5.86 2.64l-9.55 7.24 6.09 4.6 6.67-5h.02a8.09 8.09 0 0 0 2.67-9.36Z"
              fill="#FC6D26"
            />
            <path
              d="m9.9 27.14 3.28 2.48 2 1.52a1.35 1.35 0 0 0 1.62 0l2-1.52 3.28-2.48-6.1-4.6-6.07 4.6Z"
              fill="#FCA326"
            />
            <path
              d="M6.44 15.3a14.71 14.71 0 0 0-5.86-2.63l-.05.12a8.1 8.1 0 0 0 2.68 9.34l.02.01.04.03 6.63 4.97 6.1-4.6-9.56-7.24Z"
              fill="#FC6D26"
            />
          </svg>
          Sign {isSignUp ? "Up" : "In"} with GitLab
        </Button>
      </div>

      <p className="text-muted-foreground text-center text-xs">
        By signing up you agree to our{" "}
        <Button asChild variant="link" className="text-xs">
          <Link href="/terms">terms</Link>
        </Button>
        .
      </p>
    </>
  );
}
