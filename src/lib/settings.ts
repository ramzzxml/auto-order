import { prisma } from "@/lib/prisma";

export async function getSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: "settings" } });
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        id: "settings",
        storeName: process.env.STORE_NAME || "Auto Order Store"
      }
    });
  }
  return settings;
}

export async function getGatewayConfig() {
  const settings = await getSettings();
  return {
    baseUrl:
      settings.gatewayBaseUrl ||
      process.env.PAYMENT_GATEWAY_BASE_URL ||
      "https://payqris.web.id",
    apiKey: settings.gatewayApiKey || process.env.PAYMENT_GATEWAY_API_KEY || ""
  };
}
