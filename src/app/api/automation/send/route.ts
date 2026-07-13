import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { catchmailAutomation } from '@/lib/catchmail';
import { automationSendSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  // Extract authorization either from Custom Header API Token or Web Cookie Session
  let systemUserId = '';
  const apiKeyHeader = request.headers.get('Authorization')?.replace('Bearer ', '');
  const sessionToken = request.cookies.get('saas_session_token')?.value;

  try {
    if (apiKeyHeader) {
      const userRecord = await prisma.user.findUnique({ where: { apiKey: apiKeyHeader } });
      if (!userRecord) return NextResponse.json({ message: 'Unauthorized API Access Token key structure.' }, { status: 401 });
      systemUserId = userRecord.id;
    } else if (sessionToken) {
      const payloadBase64 = sessionToken.split('.')[1];
      systemUserId = JSON.parse(atob(payloadBase64)).id;
    } else {
      return NextResponse.json({ message: 'Authentication authorization token missing from header and cookies.' }, { status: 401 });
    }

    const body = await request.json();
    const validation = automationSendSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Email address formatting validation collapsed.' }, { status: 400 });
    }

    const executingUser = await prisma.user.findUnique({ where: { id: systemUserId } });
    if (!executingUser || executingUser.credits < 1) {
      return NextResponse.json({ message: 'Insufficient engine execution fuel credits. Replenish via payment portal.' }, { status: 402 });
    }

    // Spend token from balance structure
    await prisma.user.update({
      where: { id: systemUserId },
      data: { credits: { decrement: 1 } },
    });

    const responsePackage = await catchmailAutomation.triggerSend(validation.data.email);

    await prisma.automationLog.create({
      data: {
        userId: systemUserId,
        endpoint: '/api/send',
        parameters: JSON.stringify({ email: validation.data.email }),
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
    return NextResponse.json({ message: error?.message || 'Automation proxy route crashed.' }, { status: 500 });
  }
}
