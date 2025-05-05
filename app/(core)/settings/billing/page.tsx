import "server-only";

import { Suspense } from "react";

export default async function BillingPage() {
  return (
    <div className="container">
      <Suspense>
        <BillingCard />
      </Suspense>
    </div>
  );
}

async function BillingCard() {
  return <></>;
}
