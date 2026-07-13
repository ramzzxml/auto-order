'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function PurchaseCreditsButton() {
  const [loading, setLoading] = useState(false);
  const [activeInvoiceQris, setActiveInvoiceQris] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const initializePaymentTunnel = async (tierKey: string) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditPackage: tierKey }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'System failed to fetch secure PayQRIS endpoints.');

      if (payload.order && payload.order.qrisImage) {
        setActiveInvoiceQris(payload.order.qrisImage);
      } else {
        throw new Error('QRIS presentation data stream returned blank elements.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unknown billing cluster validation drop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => { if(!open) { setActiveInvoiceQris(null); setErrorMessage(''); } }}>
      <DialogTrigger asChild>
        <Button className="shadow-sm">Scale Operations Capacity</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Provision Core Gas Fuel Credits</h3>
            <p className="text-xs text-slate-500 mt-1">Select an infrastructure capacity package. Invoices automatically resolve securely via PayQRIS infrastructure.</p>
          </div>

          {errorMessage && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium border border-red-200">{errorMessage}</div>}

          {!activeInvoiceQris ? (
            <div className="space-y-2">
              <button onClick={() => initializePaymentTunnel('tier1')} disabled={loading} className="w-full p-3 border border-slate-200 rounded-xl text-left flex justify-between items-center bg-white hover:bg-slate-50 transition">
                <div>
                  <p className="text-sm font-bold text-slate-900">500 Infrastructure Credits</p>
                  <p className="text-xs text-slate-500">Perfect for light testing protocols</p>
                </div>
                <span className="text-sm font-extrabold text-blue-600">Rp 50.000</span>
              </button>
              <button onClick={() => initializePaymentTunnel('tier2')} disabled={loading} className="w-full p-3 border border-slate-200 rounded-xl text-left flex justify-between items-center bg-white hover:bg-slate-50 transition">
                <div>
                  <p className="text-sm font-bold text-slate-900">1,200 Infrastructure Credits</p>
                  <p className="text-xs text-slate-500">Production scaling workspace pipeline allocation</p>
                </div>
                <span className="text-sm font-extrabold text-blue-600">Rp 100.000</span>
              </button>
              <button onClick={() => initializePaymentTunnel('tier3')} disabled={loading} className="w-full p-3 border border-slate-200 rounded-xl text-left flex justify-between items-center bg-white hover:bg-slate-50 transition">
                <div>
                  <p className="text-sm font-bold text-slate-900">3,500 Infrastructure Credits</p>
                  <p className="text-xs text-slate-500">Enterprise deployment high data throughput arrays</p>
                </div>
                <span className="text-sm font-extrabold text-blue-600">Rp 250.000</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <p className="text-xs text-center font-semibold text-slate-700 uppercase tracking-wider">Scan Dynamic QRIS Invoice System</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeInvoiceQris} alt="PayQRIS Invoice QR Code" className="w-64 h-64 border border-slate-200 bg-white p-2 rounded-lg" />
              <p className="text-[10px] text-slate-400 text-center max-w-xs">QRIS updates are tracked every 3 seconds natively. Balance allocations instantiate to accounts immediately upon settlement validation.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
