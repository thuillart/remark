"use client";

import { PlusIcon } from "lucide-react";

import { useApiKeyStore } from "@/api-keys/lib/store";
import { Button } from "@/components/ui/button";

export function EndContent({ hasApiKeys }: { hasApiKeys: boolean }) {
  const { setOpen } = useApiKeyStore();

  if (hasApiKeys) {
    return (
      <Button size="sm" onClick={() => setOpen("create")}>
        <PlusIcon size={16} />
        Create API Key
      </Button>
    );
  }

  return;
}
