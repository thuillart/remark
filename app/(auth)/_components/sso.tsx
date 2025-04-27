"use client";

import { RiGithubFill, RiGitlabFill } from "@remixicon/react";
import { usePathname } from "next/navigation";
import React from "react";

import type { OAuthProvider } from "@/auth/lib/types";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SSO() {
  const pathname = usePathname();
  const isSignIn = pathname.includes("sign-in");

  const [loading, setLoading] = React.useState<OAuthProvider | null>(null);

  async function signInWithOAuthProvider(provider: OAuthProvider) {
    setLoading(provider);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/feedbacks",
    });

    if (error) {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        <span className="text-muted-foreground text-xs uppercase">Or</span>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button
          variant="outline"
          loading={loading === "github"}
          onClick={() => signInWithOAuthProvider("github")}
          className="w-full"
        >
          <RiGithubFill size={16} />
          Sign {isSignIn ? "in" : "up"} with GitHub
        </Button>
        <Button
          variant="outline"
          loading={loading === "gitlab"}
          onClick={() => signInWithOAuthProvider("gitlab")}
          className="w-full"
        >
          <RiGitlabFill size={16} />
          Sign {isSignIn ? "in" : "up"} with GitLab
        </Button>
      </div>
    </>
  );
}
