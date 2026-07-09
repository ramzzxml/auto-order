import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalProducts, activeProducts, totalOrders, successOrders, pendingOrders, revenueAgg, lowStock] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { active: true } }),
        prisma.order.count(),
        prisma.order.count({ where: { status: "success" } }),
        prisma.order.count({ where: { status: "pending" } }),
        prisma.order.aggregate({
          where: { status: "success" },
          _sum: { amount: true }
        }),
        prisma.product.findMany({
          where: { active: true },
          include: { _count: { select: { stocks: { where: { sold: false } } } } }
        })
      ]);

    const lowStockProducts = lowStock
      .filter((p) => p._count.stocks <= 3)
      .map((p) => ({ id: p.id, name: p.name, stock: p._count.stocks }));

    return NextResponse.json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        successOrders,
        pendingOrders,
        totalRevenue: revenueAgg._sum.amount || 0,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
