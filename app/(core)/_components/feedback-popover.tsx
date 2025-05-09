"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiSparkling2Line } from "@remixicon/react";
import { HeartIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  text: z.string().min(2).max(2000),
});

type FormValues = z.infer<typeof formSchema>;

export function FeedbackPopover() {
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: "" },
  });

  async function onSubmit(data: FormValues) {
    console.log(data);

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
              <div className="rounded-full border border-destructive/10 bg-destructive/[2.5] p-1">
                <div className="rounded-full border border-destructive/10 bg-destructive/5 p-1">
                  <div className="rounded-full border border-destructive/15 bg-destructive/5 p-3">
                    <HeartIcon size={24} className="text-destructive" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Thank you so much for it.</p>
                <p className="text-sm opacity-80">
                  We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }} />
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
