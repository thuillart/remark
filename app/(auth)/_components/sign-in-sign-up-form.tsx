"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiGithubFill, RiGitlabFill } from "@remixicon/react";
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
          <RiGithubFill size={20} />
          Sign {isSignUp ? "Up" : "In"} with GitHub
        </Button>

        <Button
          variant="outline"
          loading={isLoading === "gitlab"}
          onClick={() => signInWithOAuthProvider("gitlab")}
          className="w-full"
        >
          <RiGitlabFill size={20} className="fill-[#FC6D26]" />
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
