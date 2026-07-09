import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/ProductForm";
import { StockManager } from "./StockManager";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { stocks: { orderBy: { createdAt: "desc" } } }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
        <ProductForm
          productId={product.id}
          initialValues={{
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail || "",
            active: product.active
          }}
        />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">Product Stock</h2>
        <StockManager
          productId={product.id}
          initialStocks={product.stocks.map((s) => ({
            id: s.id,
            content: s.content,
            sold: s.sold,
            createdAt: s.createdAt.toISOString()
          }))}
        />
      </div>
    </div>
  );
}
