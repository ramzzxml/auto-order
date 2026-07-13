import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function AdministrativeHighPrivilegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar isAdmin={true} />
      <main className="flex-grow flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
