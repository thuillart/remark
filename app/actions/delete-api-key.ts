"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { authActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils/try-catch";

const schema = z.object({
  keyId: z.string(),
});

export const deleteApiKey = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { keyId } }) => {
    const { data: apiKey, error } = await tryCatch(
      auth.api.deleteApiKey({
        body: {
          keyId,
        },
        headers: await headers(),
      }),
    );

    if (!apiKey || error) {
      return { failure: "We couldn't delete your API key" };
    }

    revalidatePath("/api-keys");
    return { success: true };
  });
