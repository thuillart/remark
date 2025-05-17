import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, magicLink } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import React from "react";

import { ChangeEmailTemplate } from "@/components/template/change-email";
import { MagicLinkTemplate } from "@/components/template/magic-link";
import { polarClient } from "@/lib/configs/polar";
import { PRODUCT_CONFIGS, getSlugFromProductId } from "@/lib/configs/products";
import { sendEmail } from "@/lib/configs/resend";
import { db } from "@/lib/db/drizzle";
import * as schema from "@/lib/db/schema";
import { feedback } from "@/lib/db/schema";
import { getBaseUrl } from "@/lib/utils";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "https://remark.sh"],
  baseURL: getBaseUrl(),

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // OAuth providers do provide user's name, we do not want it
          return { data: { ...user, name: "" } };
        },
      },
      update: {
        after: async (user) => {
          // Update feedbacks with new email
          await db
            .update(feedback)
            .set({ from: user.email })
            .where(eq(feedback.from, user.email));
        },
      },
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ url, user, newEmail }) => {
        await sendEmail({
          to: user.email,
          react: React.createElement(ChangeEmailTemplate, {
            url,
            email: user.email,
            newEmail,
          }),
          subject: "Approve email change",
        });
      },
    },

    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ url, user }) => {
        // TODO: Add a template for the delete account email
        await sendEmail({
          to: user.email,
          text: `Click the link to approve the deletion of your account: ${url}. Any ongoing subscription will be cancelled.`,
          subject: "Approve account deletion",
        });
      },
      beforeDelete: async () => {
        const response = await fetch(`${getBaseUrl()}/api/auth/state`, {
          headers: await headers(),
        });

        const state = await response.json();

        // Find all active subscriptions
        const subscriptions = state.activeSubscriptions.filter(
          (subscription) => subscription.status === "active",
        );

        for (const subscription of subscriptions) {
          await polarClient.subscriptions.revoke({
            id: subscription.id,
          });
        }
      },
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "gitlab"],
      allowDifferentEmails: true,
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    gitlab: {
      issuer: process.env.GITLAB_ISSUER,
      clientId: process.env.GITLAB_CLIENT_ID,
      clientSecret: process.env.GITLAB_CLIENT_SECRET,
    },
  },

  plugins: [
    admin({
      adminUserIds: [
        process.env.ADMIN_ID, // team@remark.sh
      ],
    }),
    apiKey({
      enableMetadata: true,
    }),
    passkey(),
    magicLink({
      sendMagicLink: async ({ url, email }) => {
        await sendEmail({
          to: email,
          react: React.createElement(MagicLinkTemplate, { url }),
          subject: "Your magic link",
        });
      },
    }),

    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: Object.values(PRODUCT_CONFIGS).map(
            ({ slug, productId }) => ({
              slug,
              productId,
            }),
          ),
          successUrl: "/settings/billing?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET,
          onSubscriptionUpdated: async (payload) => {
            const slug = getSlugFromProductId(payload.productId);
            const { updateApiKeysLimits } = await import("@/lib/db/actions");
            await updateApiKeysLimits({ newSlug: slug });
          },
        }),
      ],
      enableCustomerPortal: true,
    }),
    nextCookies(),
  ],
});
