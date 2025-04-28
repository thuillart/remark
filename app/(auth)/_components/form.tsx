"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  emailSchema,
  nameSchema,
  passwordRequirements,
  passwordSchema,
} from "@/auth/lib/schema";
import { CircleArrow } from "@/components/circle-arrow";
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
import { cn } from "@/lib/utils";

const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

type FormValues = z.infer<typeof signUpSchema>;

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const isSignUp = mode === "sign-up";

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const password = useWatch({
    control: form.control,
    name: "password",
  });

  async function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <div className="space-y-4">
          {isSignUp && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              const isEmpty =
                form.formState.errors.password?.message ===
                "Please enter a password.";

              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isVisible ? "text" : "password"}
                        className="pe-9"
                        aria-invalid={!!form.formState.errors.password}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setIsVisible((v) => !v)}
                        className={cn(
                          "absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
                        )}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                      >
                        {isVisible ? (
                          <EyeOffIcon size={16} />
                        ) : (
                          <EyeIcon size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  {isEmpty && <FormMessage />}
                  {isSignUp && <PasswordStrengthChecker password={password} />}
                </FormItem>
              );
            }}
          />
        </div>

        <Button
          type="submit"
          className="group/button w-full"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
          <CircleArrow direction="right" isHovering={isHovering} />
        </Button>
      </form>
    </Form>
  );
}

function PasswordStrengthChecker({ password }: { password: string }) {
  const strength = passwordRequirements.map((req) => ({
    met: req.regex.test(password),
    text: req.text,
  }));
  const strengthScore = React.useMemo(
    () => strength.filter((req) => req.met).length,
    [strength],
  );

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-700 dark:bg-red-400";
    if (score <= 2) return "bg-amber-700 dark:bg-amber-400";
    if (score === 3) return "bg-yellow-700 dark:bg-yellow-400";
    return "bg-green-700 dark:bg-green-400";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  if (!password) return null;

  return (
    <>
      <div
        role="progressbar"
        tabIndex={0}
        className="mt-1 mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
        aria-label="Password strength"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={5}
      >
        <div
          style={{ width: `${(strengthScore / 5) * 100}%` }}
          className={cn(
            "h-full bg-border transition-all duration-500 ease-out",
            getStrengthColor(strengthScore),
          )}
        />
      </div>

      <p className="mb-2 font-medium text-foreground text-sm">
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      <ul className="space-y-1.5">
        {strength.map((req) => {
          const isMet = req.met;
          return (
            <li key={req.text} className="flex items-center gap-2">
              {isMet ? (
                <CheckIcon
                  size={16}
                  className="text-green-700 dark:text-green-400"
                />
              ) : (
                <XIcon size={16} className="text-muted-foreground" />
              )}

              <span
                className={cn(
                  "text-xs",
                  isMet
                    ? "text-green-700 dark:text-green-400"
                    : "text-muted-foreground",
                )}
              >
                {req.text}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
