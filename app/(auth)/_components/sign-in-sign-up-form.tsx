"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiGithubFill, RiGitlabFill } from "@remixicon/react";
import { BadgeAlertIcon, InboxIcon } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
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

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

type Mode = "sign-in" | "sign-up";
type Step = "email" | "inbox";
type FormValues = z.infer<typeof schema>;
type OAuthProvider = "github" | "gitlab";

export function SignInSignUpForm({ mode }: { mode: Mode }) {
  const isSignUp = mode === "sign-up";

  const [isLoading, setIsLoading] = React.useState<OAuthProvider | null>(null);
  const [isHovering, setIsHovering] = React.useState(false);

  const [step, setStep] = useQueryState<Step>("step", {
    defaultValue: "email",
    parse: (value): Step => (value === "inbox" ? "inbox" : "email"),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

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
            <h2 className="font-semibold text-lg tracking-tight">
              Check your inbox
            </h2>
            <p className="text-balance text-muted-foreground text-sm">
              Click the link we've just sent you to{" "}
              <span className="font-medium text-foreground">
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
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
          <Logo variant="icon" className="opacity-60" />
        </div>
        <div className="flex flex-col text-center">
          <h2 className="font-semibold text-lg tracking-tight">
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
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

      <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
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

      <p className="text-center text-muted-foreground text-xs">
        By signing up you agree to our{" "}
        <Button asChild variant="link" className="text-xs">
          <Link href="/terms" target="_blank">
            terms
          </Link>
        </Button>
        .
      </p>
    </>
  );
}
