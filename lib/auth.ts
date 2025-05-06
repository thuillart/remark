import { polar } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey, magicLink } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import React from "react";

import { MagicLinkTemplate } from "@/components/template/magic-link";
import { polarClient } from "@/lib/configs/polar";
import { PRODUCT_CONFIGS } from "@/lib/configs/products";
import { sendEmail } from "@/lib/configs/resend";
import { db } from "@/lib/db/drizzle";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
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
      checkout: {
        enabled: true,
        products: Object.values(PRODUCT_CONFIGS).map(({ slug, productId }) => ({
          slug,
          productId,
        })),
        successUrl: "/success?checkout_id={CHECKOUT_ID}",
      },
      webhooks: {
        secret: process.env.POLAR_WEBHOOK_SECRET,
      },
      enableCustomerPortal: true,
      createCustomerOnSignUp: true,
    }),

    nextCookies(),
  ],
});
