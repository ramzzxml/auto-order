import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Marks any pending order past its expiry time as "expired".
 * Intended to be triggered periodically by Vercel Cron (see vercel.json).
 * Protect it with CRON_SECRET if set.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await prisma.order.updateMany({
      where: { status: "pending", expiredAt: { lt: new Date() } },
      data: { status: "expired" }
    });

    return NextResponse.json({ expired: result.count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to expire orders" }, { status: 500 });
  }
}
