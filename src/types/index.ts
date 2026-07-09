export type OrderStatus = "pending" | "success" | "failed" | "expired";

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string | null;
  active: boolean;
  stockCount?: number;
}

export interface OrderDTO {
  id: string;
  trxid: string;
  status: OrderStatus;
  amount: number;
  buyerName: string;
  buyerWhatsapp: string;
  paymentBrand: string | null;
  qrisImage: string | null;
  expiredAt: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string | null;
  };
  stockContent?: string | null;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  thumbnail: string | null;
  quantity: 1;
}

export interface ApiError {
  error: string;
}
