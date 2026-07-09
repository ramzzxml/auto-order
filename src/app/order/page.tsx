"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderLookupPage() {
  const router = useRouter();
  const [trxid, setTrxid] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trxid.trim();
    if (trimmed) router.push(`/order/${trimmed}`);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-2 text-2xl font-bold">Track Your Order</h1>
      <p className="mb-8 text-gray-500 dark:text-gray-400">
        Enter your transaction ID to view your order status or purchased product.
      </p>
      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label" htmlFor="trxid">
            Transaction ID
          </label>
          <input
            id="trxid"
            required
            className="input"
            placeholder="TRX-20260709-16000001"
            value={trxid}
            onChange={(e) => setTrxid(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          View Order
        </button>
      </form>
    </div>
  );
}
