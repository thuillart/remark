"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <div className="container">
      <Tabs defaultValue={pathname.includes("usage") ? "usage" : "billing"}>
        <TabsList className="bg-transparent">
          <TabsTrigger
            value="usage"
            asChild
            className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
          >
            <Link href="/settings/usage">Usage</Link>
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            asChild
            className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
          >
            <Link href="/settings/billing">Billing</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
