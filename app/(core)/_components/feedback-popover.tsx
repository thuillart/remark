"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RiSparkling2Line } from "@remixicon/react";
import { BadgeAlertIcon, HeartIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { createFeedback } from "@/lib/db/actions";
import { cn, toast } from "@/lib/utils";

const formSchema = z.object({
  text: z.string().min(2).max(2000),
});

type FormValues = z.infer<typeof formSchema>;

export function FeedbackPopover() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: "" },
  });

  async function onSubmit(values: FormValues) {
    const result = await createFeedback({
      text: values.text,
      metadata: {
        path: pathname,
      },
    });

    if (result?.data?.failure) {
      toast({
        Icon: BadgeAlertIcon,
        title: "Something went wrong",
        variant: "destructive",
        description: "Please try again.",
      });
    }

    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => {
        form.reset();
      }, 200); // Time it takes to close
    }, 3000);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          Feedback
          <RiSparkling2Line size={16} className="opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-xs p-3 md:w-sm">
        <AnimatePresence mode="wait">
          {form.formState.isSubmitted ? (
            <motion.div
              key="submitted"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-39 flex-col items-center justify-center gap-1.5 text-center"
            >
              <div className="border-destructive/10 bg-destructive/[2.5] rounded-full border p-1">
                <div className="border-destructive/10 bg-destructive/5 rounded-full border p-1">
                  <div className="border-destructive/15 bg-destructive/5 rounded-full border p-3">
                    <HeartIcon size={24} className="text-destructive" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Thank you so much for it.</p>
                <p className="text-sm opacity-80">
                  We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            className="min-h-28 p-3"
                            placeholder="Ideas to improve this page..."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-sm">
                      Need help?{" "}
                      <Link
                        href="/docs"
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "link",
                            className: "text-sm font-normal",
                          }),
                        )}
                      >
                        Read the docs
                      </Link>
                      .
                    </p>
                    <Button
                      size="sm"
                      type="submit"
                      loading={form.formState.isSubmitting}
                      disabled={!form.formState.isDirty}
                    >
                      Send
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
