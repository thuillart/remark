"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Please type 'DELETE' to confirm.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);

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

    await authClient.deleteUser(
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push("/login");
        },
        onError: () => {
          setIsLoading(false);
          toast({
            Icon: BadgeAlertIcon,
            title: "Something went wrong",
            variant: "destructive",
            description: "Please try again.",
          });
        },
      },
    );
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
                This action is final. It will permanently delete your account
                and your data from our servers.
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

                      <FormMessage />
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
