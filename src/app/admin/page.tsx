import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

async function getStats() {
  const [totalProducts, activeProducts, totalOrders, successOrders, pendingOrders, revenueAgg, recentOrders, lowStock] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "success" } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.aggregate({ where: { status: "success" }, _sum: { amount: true } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { product: { select: { name: true } } }
      }),
      prisma.product.findMany({
        where: { active: true },
        include: { _count: { select: { stocks: { where: { sold: false } } } } }
      })
    ]);

  return {
    totalProducts,
    activeProducts,
    totalOrders,
    successOrders,
    pendingOrders,
    totalRevenue: revenueAgg._sum.amount || 0,
    recentOrders,
    lowStockProducts: lowStock.filter((p) => p._count.stocks <= 3)
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue) },
    { label: "Successful Orders", value: stats.successOrders },
    { label: "Pending Orders", value: stats.pendingOrders },
    { label: "Active Products", value: `${stats.activeProducts} / ${stats.totalProducts}` }
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            <p className="mt-1 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="mb-8 card p-5">
          <h2 className="mb-3 font-semibold text-amber-600 dark:text-amber-400">
            ⚠️ Low Stock Alert
          </h2>
          <ul className="space-y-1 text-sm">
            {stats.lowStockProducts.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span className="font-semibold">{p._count.stocks} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="border-b border-gray-200 p-5 dark:border-gray-800">
          <h2 className="font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th className="px-5 py-3">Transaction ID</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-3 font-mono text-xs">{order.trxid}</td>
                  <td className="px-5 py-3">{order.product.name}</td>
                  <td className="px-5 py-3">{formatCurrency(order.amount)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
