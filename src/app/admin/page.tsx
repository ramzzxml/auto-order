import React from 'react';
import { prisma } from '@/lib/prisma';
import StatCard from '@/components/dashboard/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, CreditCard, ShieldAlert, Cpu } from 'lucide-react';

// Memaksa halaman ini dirender dinamis di server agar tidak error saat prerender build Vercel
export const dynamic = 'force-dynamic';

async function fetchGlobalExecutiveSystemData() {
  const globalUsers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true, automationLogs: true } },
    },
  });

  const totalCreditsAllocated = globalUsers.reduce((sum, u) => sum + u.credits, 0);
  const totalAutomationOperationsCount = await prisma.automationLog.count();

  return { globalUsers, totalCreditsAllocated, totalAutomationOperationsCount };
}

export default async function ExecutiveGovernancePanel() {
  const systemState = await fetchGlobalExecutiveSystemData();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Executive Cluster Management Operations</h1>
        <p className="text-sm text-slate-500 mt-1">Global administrative insight scope and accounting records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Cluster Tenancies Registered" value={systemState.globalUsers.length} description="Active operating spaces" icon={Users} />
        <StatCard title="Global Active Token Float Capacity" value={systemState.totalCreditsAllocated} description="Total active user credits" icon={CreditCard} />
        <StatCard title="System Total Automation Directives Run" value={systemState.totalAutomationOperationsCount} description="Aggregated backend logs tracked" icon={Cpu} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">System Tenants Control Registry Matrix</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant ID / Email</TableHead>
              <TableHead>System Authority Scope</TableHead>
              <TableHead>Credits Balance</TableHead>
              <TableHead>Operations Dispatched</TableHead>
              <TableHead>Account Initialization Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {systemState.globalUsers.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">
                  <div>{tenant.email}</div>
                  <div className="text-[10px] font-mono text-slate-400 break-all">{tenant.id}</div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${tenant.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                    {tenant.role}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-900">{tenant.credits}</TableCell>
                <TableCell className="text-xs text-slate-600">{tenant._count.automationLogs} actions executed</TableCell>
                <TableCell className="text-xs text-slate-500">{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
