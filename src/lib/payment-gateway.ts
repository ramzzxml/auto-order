import { getGatewayConfig } from "@/lib/settings";

export interface CreateQrisResponse {
  status: boolean;
  message?: string;
  data?: {
    trxid: string;
    amount: number;
    qris_image: string;
    expired: string;
  };
}

export interface StatusResponse {
  status: boolean;
  txStatus?: "pending" | "sukses" | "gagal";
  data?: {
    txStatus: "pending" | "sukses" | "gagal";
    amount: number;
    brand?: {
      name: string;
      logo?: string;
    };
  };
}

class PaymentGatewayError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentGatewayError";
  }
}

async function gatewayFetch(path: string, init?: RequestInit) {
  const { baseUrl, apiKey } = await getGatewayConfig();

  if (!apiKey) {
    throw new PaymentGatewayError(
      "Payment gateway API key is not configured. Set PAYMENT_GATEWAY_API_KEY in your environment or in admin settings."
    );
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new PaymentGatewayError(
      `Payment gateway request failed (${res.status}): ${text || res.statusText}`
    );
  }

  return res.json();
}

export async function createQris(
  amount: number,
  trxid: string
): Promise<CreateQrisResponse> {
  return gatewayFetch("/api/v1/qris/create", {
    method: "POST",
    body: JSON.stringify({ amount, trxid })
  });
}

export async function checkQrisStatus(trxid: string): Promise<StatusResponse> {
  const params = new URLSearchParams({ trxid });
  return gatewayFetch(`/api/v1/qris/status?${params.toString()}`, {
    method: "GET"
  });
}

export { PaymentGatewayError };
