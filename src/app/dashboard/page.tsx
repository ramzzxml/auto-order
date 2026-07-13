import React from 'react';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import StatCard from '@/components/dashboard/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Layers, Activity, ShieldCheck, Key } from 'lucide-react';
import LiveAutomationConsole from '@/components/dashboard/LiveAutomationConsole';
import PurchaseCreditsButton from '@/components/dashboard/PurchaseCreditsButton';

async function fetchDashboardMetricsAndData() {
  const sessionToken = cookies().get('saas_session_token')?.value;
  if (!sessionToken) throw new Error('Unchecked routing execution bypass protection failure.');

  const payloadBase64 = sessionToken.split('.')[1];
  const userSession = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('ascii'));

  const user = await prisma.user.findUnique({
    where: { id: userSession.id },
    include: {
      orders: { orderBy: { createdAt: 'desc' }, take: 10 },
      automationLogs: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });

  if (!user) throw new Error('User model context mismatch inside cluster state storage.');
  return user;
}

export default async function DashboardMainWorkspace() {
  const accountData = await fetchDashboardMetricsAndData();

  const creditCount = accountData.credits;
  const successfulAutomationsCount = accountData.automationLogs.filter(l => l.status === 'SUCCESS').length;
  const pendingOrdersCount = accountData.orders.filter(o => o.status === 'PENDING').length;

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Workspace Cluster Command Console</h1>
          <p className="text-sm text-slate-500 mt-1">Operational profile identity: <span className="font-semibold text-slate-700">{accountData.email}</span></p>
        </div>
        <PurchaseCreditsButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Available Execution Gas Credits" value={creditCount} description="Expends 1 gas unit per action proxy hit" icon={Layers} />
        <StatCard title="Successful Automation Computations" value={successfulAutomationsCount} description="Parsed structural data payloads out cleanly" icon={ShieldCheck} />
        <StatCard title="Awaiting Billing Actions" value={pendingOrdersCount} description="PayQRIS checkout sessions live" icon={Activity} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <Key className="h-5 w-5 text-blue-600" />
          Cryptographic Developer API Access Key
        </div>
        <p className="text-xs text-slate-500">Provide this structural identification token inside the Authorization Bearer block of custom scripts to hit the background automated worker pipelines directly.</p>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-700 break-all select-all">
          Authorization: Bearer {accountData.apiKey}
        </div>
      </div>

      <LiveAutomationConsole initialCredits={creditCount} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Recent System Automation Operations Ledger</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Execution Type</TableHead>
                <TableHead>Status Code</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountData.automationLogs.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-6 text-xs text-slate-400">No automation logs recorded inside system database.</TableCell></TableRow>
              ) : (
                accountData.automationLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs font-semibold">{log.endpoint}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${log.status === 'SUCCESS' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {log.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">PayQRIS Invoices & Ledger Funding Assertions</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Key Reference</TableHead>
                <TableHead>Billing Cost</TableHead>
                <TableHead>Settlement Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountData.orders.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center py-6 text-xs text-slate-400">No billing ledger pipelines generated yet.</TableCell></TableRow>
              ) : (
                accountData.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs text-slate-700">{order.trxId}</TableCell>
                    <TableCell className="text-xs font-medium">Rp {order.amount.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        order.status === 'SUCCESS' ? 'bg-green-50 text-green-700 border border-green-200' :
                        order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
