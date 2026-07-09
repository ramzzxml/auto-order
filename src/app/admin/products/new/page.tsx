import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">New Product</h1>
      <ProductForm />
    </div>
  );
}
