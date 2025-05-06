import "server-only";

import { PageTitle } from "@/core/components/page-title";
import { SettingsTabs } from "@/settings/components/settings-tabs";

export default function SettingsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <PageTitle title="Settings" />
      <div className="flex flex-col gap-3 md:gap-6">
        <SettingsTabs />
        {children}
      </div>
    </>
  );
}
