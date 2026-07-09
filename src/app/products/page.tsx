import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import type { ProductDTO } from "@/types";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { stocks: { where: { sold: false } } } } }
  });

  const list: ProductDTO[] = products.map((p) => ({
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">All Products</h1>
      {list.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
