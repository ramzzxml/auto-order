import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation";
import { generateTrxId } from "@/lib/trxid";
import { createQris, PaymentGatewayError } from "@/lib/payment-gateway";

const THIRTY_MIN_MS = 30 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { productId, buyerName, buyerWhatsapp } = parsed.data;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { _count: { select: { stocks: { where: { sold: false } } } } }
    });

    if (!product || !product.active) {
      return NextResponse.json({ error: "Product not available" }, { status: 404 });
    }

    if (product._count.stocks < 1) {
      return NextResponse.json({ error: "Product is out of stock" }, { status: 409 });
    }

    const trxid = await generateTrxId();

    let qrisImage = "";
    let expiredAt = new Date(Date.now() + THIRTY_MIN_MS);

    try {
      const gatewayRes = await createQris(product.price, trxid);

      if (!gatewayRes.status || !gatewayRes.data) {
        return NextResponse.json(
          { error: gatewayRes.message || "Failed to create QRIS payment" },
          { status: 502 }
        );
      }

      qrisImage = gatewayRes.data.qris_image;
      if (gatewayRes.data.expired) {
        const parsedExpiry = new Date(gatewayRes.data.expired);
        if (!isNaN(parsedExpiry.getTime())) {
          expiredAt = parsedExpiry;
        }
      }
    } catch (gwError) {
      if (gwError instanceof PaymentGatewayError) {
        return NextResponse.json({ error: gwError.message }, { status: 502 });
      }
      throw gwError;
    }

    const order = await prisma.order.create({
      data: {
        trxid,
        status: "pending",
        amount: product.price,
        buyerName,
        buyerWhatsapp,
        qrisImage,
        expiredAt,
        productId: product.id
      }
    });

    return NextResponse.json({
      order: {
        trxid: order.trxid,
        status: order.status,
        amount: order.amount,
        qrisImage: order.qrisImage,
        expiredAt: order.expiredAt
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
