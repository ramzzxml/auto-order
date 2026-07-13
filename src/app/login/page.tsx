'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SecurityPortal() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', error: false });

  const handleAuthenticationExecution = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ message: '', error: false });

    try {
      const endpoint = isRegistering ? '/api/auth/session?action=register' : '/api/auth/session?action=login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'System failed to execute authentication procedure.');
      }

      setFeedback({ message: isRegistering ? 'Account creation success! Proceeding to session entry...' : 'Authentication verified. Accessing payload routes...', error: false });
      
      setTimeout(() => {
        router.push(data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setFeedback({ message: err.message || 'An unhandled authentication fault context occurred.', error: true });
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isRegistering ? 'Create Node Enterprise Account' : 'Authenticate Console Session'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isRegistering ? 'Provision workspace access to high scale automated tools.' : 'Supply authorized credentials to manage core automation pipelines.'}
          </p>
        </div>

        <form onSubmit={handleAuthenticationExecution} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">System Identity Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white" placeholder="operator@enterprise.internal" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cryptographic Access Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white" placeholder="••••••••" />
          </div>

          {feedback.message && (
            <div className={`p-3 rounded-lg text-xs font-medium ${feedback.error ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {feedback.message}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? 'Executing Pipeline Operations...' : isRegistering ? 'Provision Identity Access' : 'Establish Authenticated Tunnel'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button type="button" onClick={() => { setIsRegistering(!isRegistering); setFeedback({ message: '', error: false }); }} className="text-xs font-semibold text-primary hover:underline">
            {isRegistering ? 'Already possess credentials? Initialize login' : 'Require secure infrastructure cluster access? Provision identity'}
          </button>
        </div>
      </div>
    </div>
  );
}
