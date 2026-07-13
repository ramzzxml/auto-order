export type UserRole = 'USER' | 'ADMIN';
export type OrderStatusType = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface AuthUserPayload {
  id: string;
  email: string;
  role: UserRole;
  credits: number;
  apiKey: string;
}

export interface PayQRISCreateResponse {
  status: boolean;
  message: string;
  data?: {
    trxid: string;
    amount: number;
    qris_image: string;
    expired: string;
  };
}

export interface PayQRISStatusResponse {
  status: boolean;
  data?: {
    txStatus: 'sukses' | 'pending' | 'gagal';
    amount: number;
    brand?: string;
    name?: string;
    logo?: string;
  };
}

export interface AutomationSendParams {
  email: string;
  [key: string]: any;
}

export interface AutomationVerifyParams {
  link: string;
}
