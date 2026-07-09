import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { ProductDTO } from "@/types";

export function ProductCard({ product }: { product: ProductDTO }) {
  const inStock = (product.stockCount ?? 0) > 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">📦</div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            inStock
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
          }`}
        >
          {inStock ? "In Stock" : "Sold Out"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 font-semibold">{product.name}</h3>
        <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {product.description}
        </p>
        <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  );
}
