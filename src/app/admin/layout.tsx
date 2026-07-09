import { AdminShell } from "@/components/AdminShell";
import { getSettings } from "@/lib/settings";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return <AdminShell storeName={settings.storeName}>{children}</AdminShell>;
}
