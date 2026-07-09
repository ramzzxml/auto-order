import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkQrisStatus, PaymentGatewayError } from "@/lib/payment-gateway";
import type { OrderDTO } from "@/types";

function toDTO(order: any): OrderDTO {
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

export async function GET(req: NextRequest) {
  try {
    const trxid = req.nextUrl.searchParams.get("trxid");
    if (!trxid) {
      return NextResponse.json({ error: "trxid is required" }, { status: 400 });
    }

    let order = await prisma.order.findUnique({
      where: { trxid },
      include: {
        product: { select: { id: true, name: true, slug: true, thumbnail: true } },
        stock: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Already resolved: return as-is
    if (order.status !== "pending") {
      return NextResponse.json({ order: toDTO(order) });
    }

    // Expired check before hitting the gateway
    if (order.expiredAt.getTime() < Date.now()) {
      order = await prisma.order.update({
        where: { id: order.id },
        data: { status: "expired" },
        include: {
          product: { select: { id: true, name: true, slug: true, thumbnail: true } },
          stock: true
        }
      });
      return NextResponse.json({ order: toDTO(order) });
    }

    let gatewayRes;
    try {
      gatewayRes = await checkQrisStatus(trxid);
    } catch (gwError) {
      // Transient gateway errors shouldn't break polling; just return current state
      console.error(gwError instanceof PaymentGatewayError ? gwError.message : gwError);
      return NextResponse.json({ order: toDTO(order) });
    }

    const txStatus = gatewayRes.data?.txStatus ?? gatewayRes.txStatus ?? "pending";

    if (txStatus === "sukses") {
      const updated = await prisma.$transaction(async (tx) => {
        // Re-fetch inside transaction to avoid double-processing race conditions
        const current = await tx.order.findUnique({ where: { id: order!.id } });
        if (!current || current.status !== "pending") {
          return current;
        }

        const availableStock = await tx.productStock.findFirst({
          where: { productId: current.productId, sold: false },
          orderBy: { createdAt: "asc" }
        });

        if (!availableStock) {
          return tx.order.update({
            where: { id: current.id },
            data: { status: "failed" }
          });
        }

        await tx.productStock.update({
          where: { id: availableStock.id },
          data: { sold: true }
        });

        return tx.order.update({
          where: { id: current.id },
          data: {
            status: "success",
            stockId: availableStock.id,
            paymentBrand: gatewayRes.data?.brand?.name ?? null
          }
        });
      });

      const full = await prisma.order.findUnique({
        where: { id: order.id },
        include: {
          product: { select: { id: true, name: true, slug: true, thumbnail: true } },
          stock: true
        }
      });

      return NextResponse.json({ order: toDTO(full) });
    }

    if (txStatus === "gagal") {
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: "failed" },
        include: {
          product: { select: { id: true, name: true, slug: true, thumbnail: true } },
          stock: true
        }
      });
      return NextResponse.json({ order: toDTO(updated) });
    }

    // still pending
    return NextResponse.json({ order: toDTO(order) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to check payment status" }, { status: 500 });
  }
}
