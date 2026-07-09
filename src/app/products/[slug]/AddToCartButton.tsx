"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";

export function AddToCartButton({
  product,
  inStock
}: {
  product: {
    productId: string;
    name: string;
    slug: string;
    price: number;
    thumbnail: string | null;
  };
  inStock: boolean;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(product);
    router.push("/checkout");
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        disabled={!inStock}
        className="btn-secondary flex-1"
      >
        {added ? "Added ✓" : "Add to Cart"}
      </button>
      <button
        onClick={handleBuyNow}
        disabled={!inStock}
        className="btn-primary flex-1"
      >
        Buy Now
      </button>
    </div>
  );
}
