import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { passkey } from "better-auth/plugins/passkey";
import React from "react";
import { Stripe } from "stripe";

import { ChangeEmailTemplate } from "@/components/template/change-email";
import { MagicLinkTemplate } from "@/components/template/magic-link";
import { sendEmail } from "@/lib/resend";
import db from "@/prisma/db";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // OAuth providers do provide user's name, we do not want it
          return {
            data: {
              ...user,
              name: "",
            },
          };
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

  user: {
    deleteUser: {
      enabled: true,
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({
        url,
        user: { email },
        newEmail,
      }) => {
        await sendEmail({
          to: email,
          react: React.createElement(ChangeEmailTemplate, {
            url,
            email,
            newEmail,
          }),
          subject: "Change your email",
        });
      },
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
