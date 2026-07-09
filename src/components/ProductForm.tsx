"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { slugify } from "@/lib/utils";

export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  price: number | string;
  thumbnail: string;
  active: boolean;
}

export function ProductForm({
  initialValues,
  productId
}: {
  initialValues?: Partial<ProductFormValues>;
  productId?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [values, setValues] = useState<ProductFormValues>({
    name: initialValues?.name || "",
    slug: initialValues?.slug || "",
    description: initialValues?.description || "",
    price: initialValues?.price ?? "",
    thumbnail: initialValues?.thumbnail || "",
    active: initialValues?.active ?? true
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (name: string) => {
    setValues((v) => ({
      ...v,
      name,
      slug: slugTouched ? v.slug : slugify(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, price: Number(values.price) })
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      router.push(isEdit ? `/admin/products/${productId}` : `/admin/products/${data.product.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div>
        <label className="label">Product Name</label>
        <input
          required
          className="input"
          value={values.name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Slug</label>
        <input
          required
          className="input"
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setValues((v) => ({ ...v, slug: e.target.value }));
          }}
        />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          required
          rows={4}
          className="input"
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        />
      </div>
      <div>
        <label className="label">Price (IDR)</label>
        <input
          required
          type="number"
          min={0}
          className="input"
          value={values.price}
          onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
        />
      </div>
      <div>
        <label className="label">Thumbnail URL</label>
        <input
          type="url"
          className="input"
          placeholder="https://..."
          value={values.thumbnail}
          onChange={(e) => setValues((v) => ({ ...v, thumbnail: e.target.value }))}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="active"
          type="checkbox"
          checked={values.active}
          onChange={(e) => setValues((v) => ({ ...v, active: e.target.checked }))}
        />
        <label htmlFor="active" className="text-sm font-medium">
          Active (visible in store)
        </label>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
