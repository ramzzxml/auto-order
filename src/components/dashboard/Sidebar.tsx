'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Layers, CreditCard, Terminal, ShieldAlert, LogOut } from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

export default function Sidebar({ isAdmin = false }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTerminationSession = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };

  const navItems = isAdmin 
    ? [{ label: 'Executive Overview', path: '/admin', icon: ShieldAlert }]
    : [
        { label: 'Control Console', path: '/dashboard', icon: Layers },
      ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <Terminal className="h-6 w-6 text-blue-500" />
        <span className="font-bold text-white tracking-tight">Automation Panel</span>
      </div>

      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleTerminationSession} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition">
          <LogOut className="h-4 w-4" />
          Teardown Session
        </button>
      </div>
    </aside>
  );
}
