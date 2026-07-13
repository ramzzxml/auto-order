import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  );
}
