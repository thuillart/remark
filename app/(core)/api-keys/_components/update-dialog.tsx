"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BadgeAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { apiKeyNameSchema } from "@/actions/schema";
import { useApiKeyStore } from "@/api-keys/lib/store";
import type { ApiKey } from "@/api-keys/lib/types";
import { updateApiKey } from "@/app/actions/update-api-key";
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
import { toast } from "@/lib/utils";

const formSchema = z.object({
  name: apiKeyNameSchema,
});

type FormValues = z.infer<typeof formSchema>;

export function UpdateDialog({ apiKeys }: { apiKeys: ApiKey[] }) {
  const { open, setOpen, selectedApiKeyId } = useApiKeyStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: apiKeys.find((key) => key.id === selectedApiKeyId)?.name ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!selectedApiKeyId) return;

    const res = await updateApiKey({
      keyId: selectedApiKeyId,
      newName: values.name,
    });

    if (res?.data?.failure) {
      toast({
        Icon: BadgeAlertIcon,
        title: "Something went wrong",
        variant: "destructive",
        description: "Please try again.",
      });
    }

    setOpen(null);
    form.reset();
  }

  return (
    <Dialog open={open === "update"} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update API key</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Update the name of your API key.
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
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
