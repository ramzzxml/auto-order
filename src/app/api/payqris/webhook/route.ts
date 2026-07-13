import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);

    // Payload verification interface extracted from PayQRIS status formats
    const trxId = payload.trxid || (payload.data && payload.data.trxid);
    const txStatus = payload.txStatus || (payload.data && payload.data.txStatus);

    if (!trxId || !txStatus) {
      return NextResponse.json({ status: false, message: 'Invalid format signature parameters missing.' }, { status: 400 });
    }

    const linkedOrder = await prisma.order.findUnique({ where: { trxId } });
    if (!linkedOrder) {
      return NextResponse.json({ status: false, message: 'Reference ledger transaction ID not tracked inside system parameters.' }, { status: 404 });
    }

    if (txStatus === 'sukses') {
      await prisma.$transaction([
        prisma.order.update({
          where: { trxId },
          data: { status: 'SUCCESS' },
        }),
        prisma.user.update({
          where: { id: linkedOrder.userId },
          data: { credits: { increment: linkedOrder.creditsAwarded } },
        }),
      ]);
      return NextResponse.json({ status: true, message: 'Ledger record updated and account infrastructure credits loaded.' });
    } else if (txStatus === 'gagal' || txStatus === 'kadaluarsa') {
      await prisma.order.update({
        where: { trxId },
        data: { status: 'FAILED' },
      });
      return NextResponse.json({ status: true, message: 'Ledger record updated to state: FAILED.' });
    }

    return NextResponse.json({ status: true, message: 'Webhook processing completed without state mutation changes.' });
  } catch (error: any) {
    return NextResponse.json({ status: false, message: error?.message || 'Webhook processing execution crash.' }, { status: 500 });
  }
}
