"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeAlertIcon, InboxIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/lib/utils";

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Please type 'DELETE' to confirm.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function DeleteAccount() {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(data: FormValues) {
    if (data.prompt !== "DELETE") {
      form.setError("prompt", {
        message: "Please type 'DELETE' to confirm.",
      });
      return;
    }

    await authClient.deleteUser({
      callbackURL: "/",
      fetchOptions: {
        onSuccess: () => {
          toast({
            Icon: InboxIcon,
            title: "Check your inbox",
            description: "We've sent you an email to confirm.",
          });
        },
        onError: () => {
          toast({
            Icon: BadgeAlertIcon,
            title: "Something went wrong",
            variant: "destructive",
            description: "Please try again.",
          });
        },
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete account</CardTitle>
        <CardDescription>
          Permanently remove your account and all of its contents.
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account</AlertDialogTitle>
              <AlertDialogDescription>
                Any ongoing subscriptions will be terminated, and it will
                permanently delete your account and data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span>
                          To verify, type{" "}
                          <span className="font-mono uppercase">delete</span>{" "}
                          below:
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="font-mono" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsOpen(false)}>
                    Cancel
                  </AlertDialogCancel>

                  <Button
                    type="submit"
                    loading={form.formState.isSubmitting}
                    variant="destructive"
                    disabled={!form.formState.isDirty}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
