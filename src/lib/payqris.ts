import { PayQRISCreateResponse, PayQRISStatusResponse } from '@/types';

const PAYQRIS_BASE = 'https://payqris.web.id/api/v1/qris';

export class PayQRISClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.PAYQRIS_API_KEY || '';
  }

  async createTransaction(amount: number, customTrxId?: string): Promise<PayQRISCreateResponse> {
    try {
      const response = await fetch(`${PAYQRIS_BASE}/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          trxid: customTrxId,
        }),
      });
      return await response.json();
    } catch (error: any) {
      return { status: false, message: error?.message || 'Network exception encountered during PayQRIS transaction generation.' };
    }
  }

  async checkStatus(trxId: string): Promise<PayQRISStatusResponse> {
    try {
      const response = await fetch(`${PAYQRIS_BASE}/status?trxid=${encodeURIComponent(trxId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      return await response.json();
    } catch (error) {
      return { status: false };
    }
  }

  async cancelTransaction(trxId: string): Promise<{ status: boolean }> {
    try {
      const response = await fetch(`${PAYQRIS_BASE}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trxid: trxId }),
      });
      return await response.json();
    } catch (error) {
      return { status: false };
    }
  }
}

export const payQRIS = new PayQRISClient();
