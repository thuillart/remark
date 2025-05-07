import "server-only";

import { PageTitle } from "@/core/components/page-title";
import { DeleteAccount } from "@/profile/components/delete-account";
import { EmailAddress } from "@/profile/components/email-adress";
import { SignInMethods } from "@/profile/components/sign-in-methods";

export default function ProfilePage() {
  return (
    <>
      <PageTitle title="Profile" />
      <main className="container">
        <div className="flex flex-col gap-4">
          <EmailAddress />
          <SignInMethods />
          <DeleteAccount />
        </div>
      </main>
    </>
  );
}
