"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BadgeAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useApiKeyStore } from "@/api-keys/lib/store";
import { createApiKey } from "@/app/actions/create-api-key";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiKeyNameSchema } from "@/lib/schemas";
import { toast } from "@/lib/utils";

const formSchema = z.object({
  name: apiKeyNameSchema,
});

type FormValues = z.infer<typeof formSchema>;

export function CreateDialog() {
  const { open, setOpen, setApiKey } = useApiKeyStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const res = await createApiKey({
      name: values.name,
      pathname: "/api-keys",
    });

    if (res?.data?.failure) {
      toast({
        Icon: BadgeAlertIcon,
        title: "Something went wrong",
        variant: "destructive",
        description: "Please try again.",
      });
    }

    setOpen("view");
    setApiKey(res?.data?.apiKey?.key ?? null);
    form.reset();
  }

  return (
    <Dialog open={open === "create"} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API key</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Create a new API key so we know it&apos;s you when you make
              requests.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={!form.formState.isDirty}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
