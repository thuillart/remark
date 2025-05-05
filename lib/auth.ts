import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, magicLink } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import React from "react";

import { updateApiKeyLimits } from "@/actions/update-api-key-limits";
import { MagicLinkTemplate } from "@/components/template/magic-link";
import { sendEmail } from "@/lib/configs/resend";
import { stripeClient } from "@/lib/configs/stripe";
import { db } from "@/lib/db/drizzle";
import type { SubscriptionTier } from "@/lib/types/subscription";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // OAuth providers do provide user's name, we do not want it
          return { data: { ...user, name: "" } };
        },
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
      adminUserIds: [],
    }),
    apiKey({
      enableMetadata: true,
    }),
    stripe({
      stripeClient,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "plus",
            priceId: "price_1RKBVSIBfbE1qKwFZ2vs5YWw",
          },
          {
            name: "pro",
            priceId: "price_1RKBVkIBfbE1qKwFTClmuWYG",
          },
        ],
        onSubscriptionUpdate: async ({ subscription }) => {
          await updateApiKeyLimits({
            plan: subscription.plan as SubscriptionTier,
          });
        },
      },
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
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
    nextCookies(),
  ],
});
