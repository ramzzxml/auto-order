"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";

interface StockItem {
  id: string;
  content: string;
  sold: boolean;
  createdAt: string;
}

export function StockManager({
  productId,
  initialStocks
}: {
  productId: string;
  initialStocks: StockItem[];
}) {
  const [stocks, setStocks] = useState<StockItem[]>(initialStocks);
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const available = stocks.filter((s) => !s.sold).length;

  const refresh = async () => {
    const res = await fetch(`/api/admin/products/${productId}/stock`);
    const data = await res.json();
    setStocks(data.stocks || []);
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${productId}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: bulkText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add stock");
      setBulkText("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stockId: string) => {
    if (!confirm("Delete this stock item?")) return;
    await fetch(`/api/admin/products/${productId}/stock?stockId=${stockId}`, {
      method: "DELETE"
    });
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          {available} unsold item(s) available. Add one stock item per line (e.g. an
          account, license key, or download link).
        </p>
        <form onSubmit={handleAddStock} className="space-y-3">
          <textarea
            className="input font-mono"
            rows={5}
            placeholder={"email:user1@mail.com | pass:xxxx\nemail:user2@mail.com | pass:yyyy"}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Adding..." : "Add Stock"}
          </button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Added</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {stocks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No stock added yet
                  </td>
                </tr>
              )}
              {stocks.map((s) => (
                <tr key={s.id}>
                  <td className="max-w-xs truncate px-4 py-3 font-mono text-xs">
                    {s.content}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        s.sold
                          ? "bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                      }`}
                    >
                      {s.sold ? "Sold" : "Available"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {formatDate(s.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!s.sold && (
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
