import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validation";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "settings" } });
    return NextResponse.json({
      settings: settings || {
        id: "settings",
        storeName: process.env.STORE_NAME || "Auto Order Store",
        storeLogo: null,
        gatewayApiKey: null,
        gatewayBaseUrl: null
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const settings = await prisma.settings.upsert({
      where: { id: "settings" },
      update: {
        storeName: parsed.data.storeName,
        storeLogo: parsed.data.storeLogo || null,
        gatewayApiKey: parsed.data.gatewayApiKey || null,
        gatewayBaseUrl: parsed.data.gatewayBaseUrl || null
      },
      create: {
        id: "settings",
        storeName: parsed.data.storeName,
        storeLogo: parsed.data.storeLogo || null,
        gatewayApiKey: parsed.data.gatewayApiKey || null,
        gatewayBaseUrl: parsed.data.gatewayBaseUrl || null
      }
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
