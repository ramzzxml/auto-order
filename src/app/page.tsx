import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { getSettings } from "@/lib/settings";
import type { ProductDTO } from "@/types";

export default async function HomePage() {
  const settings = await getSettings();
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { _count: { select: { stocks: { where: { sold: false } } } } }
  });

  const featured: ProductDTO[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    thumbnail: p.thumbnail,
    active: p.active,
    stockCount: p._count.stocks
  }));

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {settings.storeName}
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-gray-600 dark:text-gray-400">
          Buy digital products instantly. Pay with QRIS, get your product delivered
          automatically the moment payment is confirmed &mdash; no waiting, no manual
          processing.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
          <Link href="/order" className="btn-secondary">
            Track an Order
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
            View all &rarr;
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
