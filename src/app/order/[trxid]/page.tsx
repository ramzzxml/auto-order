import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderStatusClient } from "./OrderStatusClient";
import type { OrderDTO } from "@/types";

export const dynamic = "force-dynamic";

async function getOrder(trxid: string): Promise<OrderDTO | null> {
  const order = await prisma.order.findUnique({
    where: { trxid },
    include: {
      product: { select: { id: true, name: true, slug: true, thumbnail: true } },
      stock: true
    }
  });

  if (!order) return null;

  return {
    id: order.id,
    trxid: order.trxid,
    status: order.status,
    amount: order.amount,
    buyerName: order.buyerName,
    buyerWhatsapp: order.buyerWhatsapp,
    paymentBrand: order.paymentBrand,
    qrisImage: order.qrisImage,
    expiredAt: order.expiredAt.toISOString(),
    createdAt: order.createdAt.toISOString(),
    product: order.product,
    stockContent: order.status === "success" ? order.stock?.content ?? null : null
  };
}

export default async function OrderPage({ params }: { params: { trxid: string } }) {
  const order = await getOrder(params.trxid);

  if (!order) {
    notFound();
  }

  return <OrderStatusClient initialOrder={order} />;
}
