import React from 'react';
import { prisma } from '@/lib/prisma';
import StatCard from '@/components/dashboard/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, CreditCard, ShieldAlert, Cpu } from 'lucide-react';

// Tambahkan baris ini untuk mematikan fungsi prerender statis pada halaman admin
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
  
  // ... sisa kode JSX di bawahnya tetap sama ...
