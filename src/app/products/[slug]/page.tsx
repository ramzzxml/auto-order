import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { _count: { select: { stocks: { where: { sold: false } } } } }
  });

  if (!product || !product.active) {
    notFound();
  }

  const inStock = product._count.stocks > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">📦</div>
          )}
        </div>
        <div>
          <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
          <p className="mb-4 text-2xl font-extrabold text-brand-600 dark:text-brand-400">
            {formatCurrency(product.price)}
          </p>
          <span
            className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              inStock
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {inStock ? `${product._count.stocks} in stock` : "Sold out"}
          </span>
          <p className="mb-6 whitespace-pre-line text-gray-600 dark:text-gray-400">
            {product.description}
          </p>
          <AddToCartButton
            product={{
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              thumbnail: product.thumbnail
            }}
            inStock={inStock}
          />
        </div>
      </div>
    </div>
  );
}
