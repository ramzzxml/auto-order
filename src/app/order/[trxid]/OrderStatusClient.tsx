"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { CountdownTimer } from "@/components/CountdownTimer";
import { QRISDisplay } from "@/components/QRISDisplay";
import type { OrderDTO } from "@/types";

const POLL_INTERVAL_MS = 4000;

export function OrderStatusClient({ initialOrder }: { initialOrder: OrderDTO }) {
  const [order, setOrder] = useState<OrderDTO>(initialOrder);
  const [checking, setChecking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setChecking(true);
      const res = await fetch(`/api/payment/status?trxid=${order.trxid}`, {
        cache: "no-store"
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      }
    } catch {
      // ignore transient polling errors
    } finally {
      setChecking(false);
    }
  }, [order.trxid]);

  useEffect(() => {
    if (order.status !== "pending") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [order.status, fetchStatus]);

  const handleExpire = () => {
    if (order.status === "pending") {
      fetchStatus();
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order {order.trxid}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="card mb-6 p-5">
        <div className="mb-4 flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            {order.product.thumbnail ? (
              <Image
                src={order.product.thumbnail}
                alt={order.product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-2xl">📦</div>
            )}
          </div>
          <div>
            <p className="font-semibold">{order.product.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatCurrency(order.amount)}
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-gray-500 dark:text-gray-400">Buyer</dt>
          <dd className="text-right">{order.buyerName}</dd>
          <dt className="text-gray-500 dark:text-gray-400">WhatsApp</dt>
          <dd className="text-right">{order.buyerWhatsapp}</dd>
          <dt className="text-gray-500 dark:text-gray-400">Created</dt>
          <dd className="text-right">{formatDate(order.createdAt)}</dd>
          {order.paymentBrand && (
            <>
              <dt className="text-gray-500 dark:text-gray-400">Paid via</dt>
              <dd className="text-right">{order.paymentBrand}</dd>
            </>
          )}
        </dl>
      </div>

      {order.status === "pending" && order.qrisImage && (
        <div className="card p-6 text-center">
          <QRISDisplay qrisImage={order.qrisImage} amount={order.amount} />
          <div className="my-4">
            <CountdownTimer expiredAt={order.expiredAt} onExpire={handleExpire} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {checking ? "Checking payment status..." : "Waiting for payment confirmation"}
          </p>
          <button onClick={fetchStatus} className="btn-secondary mt-4">
            Refresh Status
          </button>
        </div>
      )}

      {order.status === "success" && (
        <div className="card p-6">
          <h2 className="mb-3 text-lg font-bold text-emerald-600 dark:text-emerald-400">
            🎉 Payment Successful!
          </h2>
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
            Here is your product. Save this page or your transaction ID to access it
            again later.
          </p>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm dark:border-gray-800 dark:bg-gray-800/50">
            {order.stockContent ? (
              <pre className="whitespace-pre-wrap break-words">{order.stockContent}</pre>
            ) : (
              <p>Your product will appear here shortly.</p>
            )}
          </div>
        </div>
      )}

      {order.status === "failed" && (
        <div className="card p-6 text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">
            Payment failed. Please try purchasing again.
          </p>
          <Link href="/products" className="btn-primary inline-flex">
            Back to Products
          </Link>
        </div>
      )}

      {order.status === "expired" && (
        <div className="card p-6 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            This payment window has expired.
          </p>
          <Link href="/products" className="btn-primary inline-flex">
            Start a New Order
          </Link>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        Bookmark this URL to reopen your order anytime: /order/{order.trxid}
      </p>
    </div>
  );
}
