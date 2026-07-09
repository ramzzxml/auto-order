import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { trxid: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { trxid: params.trxid },
      include: {
        product: { select: { id: true, name: true, slug: true, thumbnail: true } },
        stock: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        trxid: order.trxid,
        status: order.status,
        amount: order.amount,
        buyerName: order.buyerName,
        buyerWhatsapp: order.buyerWhatsapp,
        paymentBrand: order.paymentBrand,
        qrisImage: order.qrisImage,
        expiredAt: order.expiredAt,
        createdAt: order.createdAt,
        product: order.product,
        stockContent: order.status === "success" ? order.stock?.content ?? null : null
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
