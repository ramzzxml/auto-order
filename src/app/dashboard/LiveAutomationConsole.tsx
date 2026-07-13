'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LiveAutomationConsole({ initialCredits }: { initialCredits: number }) {
  const [sendEmail, setSendEmail] = useState('');
  const [verifyLink, setVerifyLink] = useState('');
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const appendToConsole = (text: string) => {
    setConsoleLogs(prev => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev.slice(0, 14)]);
  };

  const handleSendExecution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendEmail) return;
    setLoadingSend(true);
    appendToConsole(`Initiating catchmail submission pipeline for target account: ${sendEmail}`);

    try {
      const res = await fetch('/api/automation/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sendEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Worker node communication disruption.');
      
      appendToConsole(`Success! Gateway verification tracking code response payload: ${data.gatewayResponse}`);
    } catch (err: any) {
      appendToConsole(`CRITICAL FAULT: ${err.message}`);
    } finally {
      setLoadingSend(false);
    }
  };

  const handleVerifyExecution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyLink) return;
    setLoadingVerify(true);
    appendToConsole(`Deploying verification link signature processing routines to parsing engine...`);

    try {
      const res = await fetch('/api/automation/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: verifyLink }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Worker token settlement failed upstream.');

      appendToConsole(`Verification parsing results returned cleanly: ${data.gatewayResponse}`);
    } catch (err: any) {
      appendToConsole(`CRITICAL FAULT: ${err.message}`);
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 bg-white border border-slate-200 shadow-sm">
        <CardHeader><CardTitle className="text-sm uppercase tracking-wider text-slate-500">Live Endpoint Simulator Workspaces</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSendExecution} className="space-y-2 border-b border-slate-100 pb-4">
            <label className="block text-xs font-semibold text-slate-700">POST /api/automation/send</label>
            <div className="flex gap-2">
              <input type="email" required value={sendEmail} onChange={(e) => setSendEmail(e.target.value)} placeholder="target-test-inbox@catchmail.io" className="flex-grow px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none" />
              <Button type="submit" disabled={loadingSend} className="text-xs h-8">Execute Send Pipeline</Button>
            </div>
          </form>

          <form onSubmit={handleVerifyExecution} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">POST /api/automation/verify</label>
            <div className="flex gap-2">
              <input type="url" required value={verifyLink} onChange={(e) => setVerifyLink(e.target.value)} placeholder="https://am-prem.vxz.my.id/auth/verify?token=example" className="flex-grow px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none" />
              <Button type="submit" disabled={loadingVerify} className="text-xs h-8">Execute Verification Pipeline</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-950 text-slate-200 border-none shadow-xl flex flex-col min-h-[250px]">
        <CardHeader className="border-b border-slate-800 py-3 px-4"><CardTitle className="text-xs font-mono uppercase tracking-wider text-slate-400">Console Core Logs</CardTitle></CardHeader>
        <CardContent className="p-4 font-mono text-[11px] leading-relaxed flex-grow overflow-y-auto space-y-1 select-text selection:bg-blue-600">
          {consoleLogs.length === 0 ? (
            <span className="text-slate-600 italic">Console runtime listener pipeline idle... Ready to parse runtime hooks.</span>
          ) : (
            consoleLogs.map((log, index) => <div key={index} className="whitespace-pre-wrap tracking-tight border-b border-slate-900 pb-1 last:border-0">{log}</div>)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
