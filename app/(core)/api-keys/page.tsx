import "server-only";

import { headers } from "next/headers";
import { Suspense } from "react";

import { columns } from "@/api-keys/components/columns";
import { CreateApiKeyDialog } from "@/api-keys/components/create-api-key-dialog";
import { DataTable } from "@/api-keys/components/data-table";
import { DeleteApiKeyDialog } from "@/api-keys/components/delete-api-key-dialog";
import { EndContent } from "@/api-keys/components/end-content";
import { TableSkeleton } from "@/api-keys/components/table-skeleton";
import { UpdateApiKeyDialog } from "@/api-keys/components/update-api-key-dialog";
import { ViewApiKeyValueDialog } from "@/api-keys/components/view-api-key-value-dialog";
import type { ApiKey } from "@/api-keys/lib/types";
import { PageTitle } from "@/core/components/page-title";
import { auth } from "@/lib/auth";

async function getApiKeys(): Promise<ApiKey[]> {
  const apiKeys = await auth.api.listApiKeys({
    headers: await headers(),
  });

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
      <CreateApiKeyDialog />
      <ViewApiKeyValueDialog />
      <DeleteApiKeyDialog />
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
      <UpdateApiKeyDialog apiKeys={apiKeys} />
      <DataTable data={apiKeys} columns={columns} />
    </>
  );
}
