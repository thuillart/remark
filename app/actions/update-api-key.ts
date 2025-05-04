"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { apiKeyNameSchema } from "@/actions/schema";
import { auth } from "@/lib/auth";
import { authActionClient } from "@/lib/safe-action";
import { tryCatch } from "@/lib/utils/try-catch";

const schema = z.object({
  keyId: z.string(),
  newName: apiKeyNameSchema,
});

export const updateApiKey = authActionClient
  .schema(schema)
  .action(async ({ parsedInput: { keyId, newName } }) => {
    const { data: apiKey, error } = await tryCatch(
      auth.api.updateApiKey({
        body: {
          name: newName,
          keyId,
        },
        headers: await headers(),
      }),
    );

    if (!apiKey || error) {
      return { failure: "We couldn't update your API key" };
    }

    revalidatePath("/api-keys");
    return { success: true };
  });
