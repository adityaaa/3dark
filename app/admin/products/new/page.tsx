// app/admin/products/new/page.tsx
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-wide">
        Add product
      </h1>
      <ProductForm mode="create" />
    </div>
  );
}
