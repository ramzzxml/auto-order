import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { payQRIS } from '@/lib/payqris';
import { orderCreationSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get('saas_session_token')?.value;
  if (!sessionToken) {
    return NextResponse.json({ message: 'Session tracking data is missing.' }, { status: 401 });
  }

  try {
    const payloadBase64 = sessionToken.split('.')[1];
    const userSession = JSON.parse(atob(payloadBase64));
    
    const body = await request.json();
    const validation = orderCreationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Package choice invalid structure configuration.' }, { status: 400 });
    }

    let purchaseAmount = 50000;
    let creditsToGrant = 500;

    if (validation.data.creditPackage === 'tier2') {
      purchaseAmount = 100000;
      creditsToGrant = 1200;
    } else if (validation.data.creditPackage === 'tier3') {
      purchaseAmount = 250000;
      creditsToGrant = 3500;
    }

    const uniquelyGeneratedTrxId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payqrisGatewayResponse = await payQRIS.createTransaction(purchaseAmount, uniquelyGeneratedTrxId);
    if (!payqrisGatewayResponse.status || !payqrisGatewayResponse.data) {
      return NextResponse.json({ message: payqrisGatewayResponse.message || 'Payment engine generation failed.' }, { status: 502 });
    }

    const record = await prisma.order.create({
      data: {
        userId: userSession.id,
        trxId: uniquelyGeneratedTrxId,
        amount: purchaseAmount,
        creditsAwarded: creditsToGrant,
        status: 'PENDING',
        qrisImage: payqrisGatewayResponse.data.qris_image,
        expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5-minute strict structural expiration
      },
    });

    return NextResponse.json({ message: 'Order payment transaction successfully initiated.', order: record });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || 'Transaction creation breakdown context error.' }, { status: 500 });
  }
}
