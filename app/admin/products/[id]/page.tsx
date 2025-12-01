// app/admin/products/[id]/page.tsx
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function EditProductPage({ params }: Props) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-wide">
        Edit product
      </h1>

      <ProductForm
        mode="edit"
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          description: product.description,
          price: product.price,
          mrp: product.mrp,
          tags: product.tags,
          sizes: product.sizes,
          image: product.image,
          gallery: product.gallery ?? "",
        }}
      />
    </div>
  );
}
