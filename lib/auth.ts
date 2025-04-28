import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { passkey } from "better-auth/plugins/passkey";
import React from "react";

import { VerifyEmail } from "@/components/template/verify-email";
import { sendEmail } from "@/lib/resend";
import db from "@/prisma/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    gitlab: {
      issuer: process.env.GITLAB_ISSUER as string,
      clientId: process.env.GITLAB_CLIENT_ID as string,
      clientSecret: process.env.GITLAB_CLIENT_SECRET as string,
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ url, user }) => {
      const firstName = user.name.split(" ")[0];

      await sendEmail({
        to: user.email,
        react: React.createElement(VerifyEmail, { url, firstName }),
        subject: "Verify your email address",
      });
    },
  },

  plugins: [passkey(), nextCookies()],
});
