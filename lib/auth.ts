import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { passkey } from "better-auth/plugins/passkey";
import React from "react";

import { MagicLinkTemplate } from "@/components/template/magic-link";
import { sendEmail } from "@/lib/resend";
import db from "@/prisma/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

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
