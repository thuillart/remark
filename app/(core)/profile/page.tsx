import "server-only";

import { PageTitle } from "@/core/components/page-title";
import { At } from "@/core/profile/components/at";

export default function ProfilePage() {
  return (
    <>
      <PageTitle title="Profile" />
      <main className="container">
        <At />
      </main>
    </>
  );
}
