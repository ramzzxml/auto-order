"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const item = items[0];

  const [buyerName, setBuyerName] = useState("");
  const [buyerWhatsapp, setBuyerWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          buyerName,
          buyerWhatsapp
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      clearCart();
      router.push(`/order/${data.order.trxid}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="mb-4 text-gray-500 dark:text-gray-400">
          Your cart is empty. Add a product before checking out.
        </p>
        <Link href="/products" className="btn-primary inline-flex">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

      <div className="card mb-6 flex items-center gap-4 p-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          {item.thumbnail ? (
            <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl">📦</div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatCurrency(item.price)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label" htmlFor="buyerName">
            Full Name
          </label>
          <input
            id="buyerName"
            required
            minLength={2}
            className="input"
            placeholder="John Doe"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="buyerWhatsapp">
            WhatsApp Number
          </label>
          <input
            id="buyerWhatsapp"
            required
            minLength={8}
            className="input"
            placeholder="081234567890"
            value={buyerWhatsapp}
            onChange={(e) => setBuyerWhatsapp(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Used for order reference only. Your product will be delivered directly on
            this website.
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Generating QRIS..." : `Pay ${formatCurrency(item.price)}`}
        </button>
      </form>
    </div>
  );
}
