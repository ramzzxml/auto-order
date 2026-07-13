import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function UserPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isAdmin={false} />
      <main className="flex-grow flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
