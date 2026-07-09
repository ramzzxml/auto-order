"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem } = useCart();
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Your Cart</h1>

      {items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="mb-4 text-gray-500 dark:text-gray-400">Your cart is empty.</p>
          <Link href="/products" className="btn-primary inline-flex">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="card flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
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
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="card flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold">{formatCurrency(total)}</p>
            </div>
            <Link href="/checkout" className="btn-primary">
              Proceed to Checkout
            </Link>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Note: checkout currently processes one product at a time. If you have
            multiple items, you&apos;ll be able to checkout the first one; complete that
            order, then return to purchase the rest.
          </p>
        </>
      )}
    </div>
  );
}
