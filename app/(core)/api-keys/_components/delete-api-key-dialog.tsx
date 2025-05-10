"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BadgeAlertIcon, TriangleAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useApiKeyStore } from "@/api-keys/lib/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { deleteApiKey } from "@/lib/db/actions";

const formSchema = z.object({
  confirmation: z.string().min(1, "Confirmation is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function DeleteApiKeyDialog() {
  const { open, setOpen, selectedApiKeyId } = useApiKeyStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  async function onSubmit(values: FormValues) {
    if (!selectedApiKeyId || values.confirmation !== "DELETE") {
      form.setError("confirmation", {
        type: "manual",
        message: "Please type DELETE to confirm",
      });
      return;
    }

    const res = await deleteApiKey({
      keyId: selectedApiKeyId,
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
    <Dialog open={open === "delete"} onOpenChange={() => setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete API key</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              You are about to delete this API key. This action cannot be
              undone.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <Alert variant="error">
          <TriangleAlertIcon size={16} />
          <AlertDescription>This action cannot be undone.</AlertDescription>
        </Alert>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div>
                      Type <span className="font-mono font-bold">DELETE</span>{" "}
                      to confirm
                    </div>
                  </FormLabel>
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
                variant="destructive"
                loading={form.formState.isSubmitting}
                disabled={!form.formState.isDirty}
              >
                Delete
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
