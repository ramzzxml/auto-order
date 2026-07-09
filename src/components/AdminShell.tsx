"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";

export function AdminShell({
  storeName,
  children
}: {
  storeName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar storeName={storeName} />
      <div className="flex-1 overflow-x-hidden p-6">{children}</div>
    </div>
  );
}
