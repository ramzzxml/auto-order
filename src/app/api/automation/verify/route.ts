import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { catchmailAutomation } from '@/lib/catchmail';
import { automationVerifySchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  let systemUserId = '';
  const apiKeyHeader = request.headers.get('Authorization')?.replace('Bearer ', '');
  const sessionToken = request.cookies.get('saas_session_token')?.value;

  try {
    if (apiKeyHeader) {
      const userRecord = await prisma.user.findUnique({ where: { apiKey: apiKeyHeader } });
      if (!userRecord) return NextResponse.json({ message: 'Unauthorized API Token Key context.' }, { status: 401 });
      systemUserId = userRecord.id;
    } else if (sessionToken) {
      const payloadBase64 = sessionToken.split('.')[1];
      systemUserId = JSON.parse(atob(payloadBase64)).id;
    } else {
      return NextResponse.json({ message: 'Authentication elements not recognized.' }, { status: 401 });
    }

    const body = await request.json();
    const validation = automationVerifySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Verification source link requires structural URL validation format.' }, { status: 400 });
    }

    const executingUser = await prisma.user.findUnique({ where: { id: systemUserId } });
    if (!executingUser || executingUser.credits < 1) {
      return NextResponse.json({ message: 'Insufficient account credit inventory to perform action.' }, { status: 402 });
    }

    await prisma.user.update({
      where: { id: systemUserId },
      data: { credits: { decrement: 1 } },
    });

    const responsePackage = await catchmailAutomation.triggerVerify(validation.data.link);

    await prisma.automationLog.create({
      data: {
        userId: systemUserId,
        endpoint: '/api/verify',
        parameters: JSON.stringify({ link: validation.data.link }),
        status: responsePackage.success ? 'SUCCESS' : 'FAILED',
        response: responsePackage.responseText,
      },
    });

    return NextResponse.json({
      success: responsePackage.success,
      gatewayResponse: responsePackage.responseText,
      remainingCredits: executingUser.credits - 1,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || 'Automation verification runtime error exception.' }, { status: 500 });
  }
}
