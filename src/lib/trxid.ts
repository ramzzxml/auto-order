import { prisma } from "@/lib/prisma";

function todayKey(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

/**
 * Generates a unique transaction ID in the format TRX-YYYYMMDD-16NNNNNN.
 * Uses a per-day Counter row (atomic increment) to avoid collisions,
 * and double-checks against the Order table just in case.
 */
export async function generateTrxId(): Promise<string> {
  const dateKey = todayKey();
  const counterId = `trx-${dateKey}`;

  let trxid = "";
  let attempts = 0;

  while (attempts < 20) {
    attempts++;

    const counter = await prisma.counter.upsert({
      where: { id: counterId },
      update: { value: { increment: 1 } },
      create: { id: counterId, value: 1 }
    });

    const seq = String(counter.value).padStart(6, "0");
    const candidate = `TRX-${dateKey}-16${seq}`;

    const existing = await prisma.order.findUnique({
      where: { trxid: candidate },
      select: { id: true }
    });

    if (!existing) {
      trxid = candidate;
      break;
    }
  }

  if (!trxid) {
    // Extremely unlikely fallback
    trxid = `TRX-${dateKey}-16${Date.now().toString().slice(-6)}`;
  }

  return trxid;
}
