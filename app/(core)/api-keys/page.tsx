import "server-only";

import { headers } from "next/headers";
import { Suspense } from "react";

import { columns } from "@/api-keys/components/columns";
import { CreateDialog } from "@/api-keys/components/create-dialog";
import { DataTable } from "@/api-keys/components/data-table";
import { DeleteDialog } from "@/api-keys/components/delete-dialog";
import { EndContent } from "@/api-keys/components/end-content";
import { TableSkeleton } from "@/api-keys/components/table-skeleton";
import { UpdateDialog } from "@/api-keys/components/update-dialog";
import { ViewDialog } from "@/api-keys/components/view-dialog";
import type { ApiKey } from "@/api-keys/lib/types";
import { PageTitle } from "@/core/components/page-title";
import { auth } from "@/lib/auth";

async function getApiKeys(): Promise<ApiKey[]> {
  const apiKeys = await auth.api.listApiKeys({
    headers: await headers(),
  });

  console.log("API Keys raw data:", JSON.stringify(apiKeys, null, 2));
  console.log("First key createdAt:", apiKeys[0]?.createdAt);
  console.log("First key createdAt type:", typeof apiKeys[0]?.createdAt);

  return apiKeys.map((key) => ({
    id: key.id,
    name: key.name,
    start: key.start,
    createdAt: key.createdAt,
    lastRequest: key.lastRequest,
  }));
}

export default function ApiKeys() {
  return (
    <>
      <CreateDialog />
      <ViewDialog />
      <DeleteDialog />
      <Suspense fallback={<TableSkeleton />}>
        <Table />
      </Suspense>
    </>
  );
}

async function Table() {
  const apiKeys = await getApiKeys();

  return (
    <>
      <PageTitle
        title="API Keys"
        endContent={<EndContent hasApiKeys={apiKeys.length > 0} />}
      />
      <DataTable data={apiKeys} columns={columns} />
      <UpdateDialog apiKeys={apiKeys} />
    </>
  );
}
