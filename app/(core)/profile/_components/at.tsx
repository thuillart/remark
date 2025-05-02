"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TextShimmer } from "@/components/text-shimmer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export function At() {
  const { data: session, isPending: isLoading } = authClient.useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: session?.user?.email,
    },
  });

  async function onSubmit(data: FormValues) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>
              Please enter the email address you want to use to log in.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex justify-between gap-6">
              <div className="flex w-full flex-col gap-3">
                <div className="max-w-80">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input {...field} />

                            {isLoading && (
                              <div className="absolute inset-0 flex items-center px-3">
                                <TextShimmer className="text-sm">
                                  Loading...
                                </TextShimmer>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              loading={form.formState.isSubmitting}
              disabled={!form.formState.isDirty}
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
