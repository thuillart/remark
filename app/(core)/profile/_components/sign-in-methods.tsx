"use client";

import { RiGithubFill, RiGitlabFill, RiKeyLine } from "@remixicon/react";
import type { Account } from "better-auth";
import type { Passkey } from "better-auth/plugins/passkey";
import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRoundIcon,
  Trash2,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import { cn, toast } from "@/lib/utils";

type Loading = "github" | "gitlab" | "delete" | "initial" | "passkey" | null;
type Provider = "github" | "gitlab" | "passkey";

export function SignInMethods() {
  const [loading, setLoading] = React.useState<Loading>("initial");
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [passkeys, setPasskeys] = React.useState<Passkey[]>([]);

  React.useEffect(() => {
    async function loadData() {
      const [accountsResponse, passkeysResponse] = await Promise.all([
        authClient.listAccounts(),
        authClient.passkey.listUserPasskeys(),
      ]);

      setAccounts(
        (accountsResponse.data ?? []).map((account) => ({
          ...account,
          userId: account.accountId,
          providerId: account.provider,
        })),
      );
      setPasskeys(passkeysResponse.data ?? []);
      setLoading(null);
    }

    loadData();
  }, []);

  const hasGithub = accounts.some((account) => account.providerId === "github");
  const hasGitlab = accounts.some((account) => account.providerId === "gitlab");
  const hasPasskey = passkeys.length > 0;
  const showProviders = !(hasGithub && hasGitlab && hasPasskey);

  async function link(provider: Provider) {
    if (loading !== null) {
      return;
    }

    setLoading(provider);

    if (provider === "passkey") {
      try {
        const { error } = await authClient.passkey.addPasskey();
        if (error) {
          throw new Error(error.message);
        }
        const { data } = await authClient.passkey.listUserPasskeys();
        setPasskeys(data ?? []);
      } catch (error) {
        toast({
          Icon: AlertTriangle,
          title: "Something went wrong",
          description:
            error instanceof Error ? error.message : "Please try again later.",
        });
      }
    } else {
      const { error } = await authClient.linkSocial({
        provider,
        callbackURL: "/profile",
      });

      if (error) {
        toast({
          Icon: AlertTriangle,
          title: "Something went wrong",
          description: error.message ?? "Please try again later.",
        });
      } else {
        const { data } = await authClient.listAccounts();
        setAccounts(
          (data ?? []).map((account) => ({
            ...account,
            userId: account.accountId,
            providerId: account.provider,
          })),
        );
      }
    }

    setLoading(null);
  }

  async function unlink(provider: Provider, passkeyId?: string) {
    if (loading !== null) {
      return;
    }

    setLoading("delete");

    if (provider === "passkey") {
      if (!passkeyId) {
        toast({
          Icon: AlertTriangle,
          title: "Something went wrong",
          description: "Passkey not found.",
        });
        setLoading(null);
        return;
      }

      try {
        const { error: deleteError } = await authClient.passkey.deletePasskey({
          id: passkeyId,
        });

        if (deleteError) {
          throw new Error(deleteError.message);
        }

        // Force a reload of the passkeys
        const { data: updatedPasskeys, error: listError } =
          await authClient.passkey.listUserPasskeys();

        if (listError) {
          throw new Error(listError.message);
        }

        // Check if the passkey was actually deleted
        const passkeyStillExists = updatedPasskeys?.some(
          (p) => p.credentialID === passkeyId,
        );
        if (passkeyStillExists) {
          throw new Error("Passkey deletion failed - passkey still exists");
        }

        setPasskeys(updatedPasskeys ?? []);
        toast({
          Icon: CheckCircle2,
          title: "Success",
          description: "Passkey has been removed.",
        });
      } catch (error) {
        toast({
          Icon: AlertTriangle,
          title: "Something went wrong",
          description:
            error instanceof Error
              ? error.message
              : "Failed to delete passkey. Please try again.",
        });
      } finally {
        setLoading(null);
      }
    } else {
      const { error } = await authClient.unlinkAccount({
        providerId: provider,
      });

      if (error) {
        toast({
          Icon: AlertTriangle,
          title: "Something went wrong",
          description: error.message ?? "Please try again later.",
        });
      } else {
        const { data } = await authClient.listAccounts();
        setAccounts(
          (data ?? []).map((account) => ({
            ...account,
            providerId: account.provider,
            userId: account.accountId,
          })),
        );
      }
    }

    setLoading(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication</CardTitle>

        <CardDescription>
          Manage the sign-in methods for your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {showProviders && (
          <>
            <div className="border-border mb-4 border-b pb-4 text-sm font-semibold">
              Add new
            </div>

            <div className="flex items-center gap-3">
              {!hasGithub && (
                <Button
                  size="sm"
                  variant="outline"
                  loading={loading === "initial" || loading === "github"}
                  onClick={() => link("github")}
                  disabled={loading !== null}
                >
                  <RiGithubFill />
                  Link GitHub
                </Button>
              )}

              {!hasGitlab && (
                <Button
                  size="sm"
                  variant="outline"
                  loading={loading === "initial" || loading === "gitlab"}
                  onClick={() => link("gitlab")}
                  disabled={loading !== null}
                >
                  <RiGitlabFill className="fill-[#FC6D26]" />
                  Link GitLab
                </Button>
              )}

              {!hasPasskey && (
                <Button
                  size="sm"
                  variant="outline"
                  loading={loading === "initial" || loading === "passkey"}
                  onClick={() => link("passkey")}
                  disabled={loading !== null}
                >
                  <RiKeyLine className="opacity-60" />
                  Add Passkey
                </Button>
              )}
            </div>
          </>
        )}

        {(accounts.length > 0 || passkeys.length > 0) && (
          <Table className={cn({ "mt-6": showProviders })}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Provider</TableHead>
                <TableHead className="w-1/4">Date</TableHead>
                <TableHead className="w-1/12 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {accounts.map((account) => {
                const providerId = account.providerId;
                const isGithub = providerId === "github";
                const isGitlab = providerId === "gitlab";
                const providerName = isGithub ? "GitHub" : "GitLab";

                const Logo = isGithub ? RiGithubFill : RiGitlabFill;

                const date = format(account.createdAt, "MMMM d, yyyy");

                return (
                  <TableRow key={account.id} className="hover:bg-transparent">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Logo className={cn({ "fill-[#FC6D26]": isGitlab })} />
                        <div className="text-sm font-medium">
                          {providerName}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-muted-foreground text-sm">
                        Connected on {date}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            loading={loading === "delete"}
                          >
                            <Trash2 className="opacity-60" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogTitle>Unlink {providerName}</DialogTitle>
                          <DialogDescription>
                            You are about to unlink your {providerName} account.
                            After removing it, you won&apos;t be able to use it
                            to log in.
                          </DialogDescription>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button
                              loading={loading === "delete"}
                              onClick={() => unlink(providerId as Provider)}
                              className="w-23"
                            >
                              Continue
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}

              {passkeys.map((passkey) => {
                const date = format(passkey.createdAt, "MMMM d, yyyy");

                return (
                  <TableRow key={passkey.id} className="hover:bg-transparent">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <KeyRoundIcon size={20} />
                        <div className="text-sm font-medium">Passkey</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-muted-foreground text-sm">
                        Added on {date}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            loading={loading === "delete"}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogTitle>Remove Passkey</DialogTitle>
                          <DialogDescription>
                            You are about to remove your passkey. After removing
                            it, you won&apos;t be able to use it to log in.
                          </DialogDescription>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button
                              loading={loading === "delete"}
                              onClick={() => unlink("passkey", passkey.id)}
                              className="w-23"
                            >
                              Continue
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
