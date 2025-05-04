import { stripeClient } from "@better-auth/stripe/client";
import {
  adminClient,
  apiKeyClient,
  magicLinkClient,
  passkeyClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    apiKeyClient(),
    stripeClient({ subscription: true }),
    passkeyClient(),
    magicLinkClient(),
  ],
});
