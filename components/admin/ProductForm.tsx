"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { AdminProduct } from "@/lib/types";

type ProductFormProps = {
  product?: AdminProduct | null;
  mode: "create" | "edit";
};

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();

  // --- left side (text fields) ---
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [mrp, setMrp] = useState(product?.mrp?.toString() ?? "");
  const [tags, setTags] = useState(product?.tags ?? "");
  const [sizes, setSizes] = useState(product?.sizes ?? "");
  
  // Size-specific pricing: { "S": { price: 499, mrp: 599 }, "M": {...} }
  const [sizePricing, setSizePricing] = useState<Record<string, { price: number; mrp: number }>>(() => {
    if (product?.sizePricing) {
      try {
        return JSON.parse(product.sizePricing);
      } catch {
        return {};
      }
    }
    return {};
  });

  // --- right side (images / gallery) ---
  // Build initial image array from existing product
  const initialImages: string[] = (() => {
    const main = product?.image ? [product.image] : [];
    const galleryList =
      product?.gallery
        ?.split(",")
        .map((g) => g.trim())
        .filter(Boolean) ?? [];
    // avoid duplicates
    return Array.from(new Set([...main, ...galleryList]));
  })();

  const [images, setImages] = useState<string[]>(initialImages);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // for drag-and-drop
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
  }

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;

    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });

    setDragIndex(null);
  }

  function handleRemoveImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setError(null);
      setUploadSuccess(null);
      setIsUploading(true);

      // Upload files one by one to avoid payload size limit (4.5MB on Vercel)
      const uploadedUrls: string[] = [];
      const failedUploads: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          console.log(`Uploading ${i + 1}/${files.length}: ${file.name}`);
          
          const formData = new FormData();
          formData.append("files", file);

          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error(`Upload failed for ${file.name}:`, errorData);
            failedUploads.push(file.name);
            continue;
          }

          const data: { urls: string[]; errors?: string[] } = await res.json();
          
          if (data.urls && data.urls.length > 0) {
            uploadedUrls.push(...data.urls);
            // Add images incrementally so user can see them appear
            setImages((prev) => [...prev, ...data.urls]);
          }

          if (data.errors && data.errors.length > 0) {
            failedUploads.push(...data.errors);
          }
        } catch (error_: any) {
          console.error(`Error uploading ${file.name}:`, error_);
          failedUploads.push(file.name);
        }
      }

      // Show results
      if (failedUploads.length > 0) {
        setError(`${uploadedUrls.length} uploaded successfully. ${failedUploads.length} failed: ${failedUploads.join(", ")}`);
      } else if (uploadedUrls.length > 0) {
        setUploadSuccess(`✓ ${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully!`);
        // Success message will auto-clear
        setTimeout(() => setUploadSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      // reset input so same file can be selected again if needed
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // derive hero + gallery from images array
      const heroImage = images[0] ?? "";
      const gallery =
        images.length > 1 ? images.slice(1).join(",") : null;

      // Serialize sizePricing if it has data
      const sizePricingJson = Object.keys(sizePricing).length > 0 
        ? JSON.stringify(sizePricing) 
        : null;

      const payload = {
        slug,
        name,
        brand,
        description,
        price: Number(price || 0),
        mrp: Number(mrp || 0),
        tags,
        sizes,
        sizePricing: sizePricingJson,
        image: heroImage,
        gallery,
      };

      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${product?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Save error", txt);
        throw new Error("Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  const title = mode === "create" ? "Create Product" : "Edit Product";
  const submitButtonText = isSaving
    ? "Saving..."
    : mode === "create"
    ? "Create product"
    : "Save changes";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl bg-black/70 p-6 shadow-glow md:flex-row"
    >
      {/* LEFT: Text fields */}
      <div className="flex-1 space-y-4">
        <h1 className="text-xl font-semibold text-white mb-2">{title}</h1>

        {/* slug + brand row */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/70">Slug (URL id)</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. neon-wolf-001"
              required
            />
          </div>
          <div>
            <label className="text-xs text-white/70">Brand</label>
            <input
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="3Dark / Rock Chang / Caballo"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/70">Name</label>
          <input
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cosmic Tiger King Glow Tee"
            required
          />
        </div>

        <div>
          <label className="text-xs text-white/70">Description</label>
          <textarea
            className="mt-1 h-28 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short selling description / glow details / fabric / fit..."
          />
        </div>

        {/* price row */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs text-white/70">Selling price (₹)</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-white/70">MRP (₹)</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/70">
            Sizes{" "}
            <span className="text-[10px] text-white/40">
              (comma separated: S, M, L, XL, XXL…)
            </span>
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            value={sizes}
            onChange={(e) => {
              setSizes(e.target.value);
              // Auto-create pricing for new sizes
              const sizeList = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
              const newPricing = { ...sizePricing };
              sizeList.forEach(size => {
                if (!newPricing[size]) {
                  newPricing[size] = { price: Number(price || 0), mrp: Number(mrp || 0) };
                }
              });
              setSizePricing(newPricing);
            }}
            placeholder="S, M, L, XL, XXL"
          />
        </div>

        {/* Size-specific pricing */}
        {sizes && sizes.split(',').map(s => s.trim()).filter(Boolean).length > 0 && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-medium text-white/80 mb-3">
              Size-specific pricing{" "}
              <span className="text-[10px] text-white/40 font-normal">
                (Set different prices per size - leave empty to use base price)
              </span>
            </p>
            <div className="grid gap-3">
              {sizes.split(',').map(s => s.trim()).filter(Boolean).map((size) => (
                <div key={size} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 p-3">
                  <span className="flex-shrink-0 text-sm font-semibold text-neon w-10">{size}</span>
                  <div className="flex-1 flex gap-3">
                    <div className="flex-1">
                      <label className="block text-[10px] text-white/50 mb-1">Selling Price</label>
                      <input
                        type="number"
                        min={0}
                        placeholder={`₹${price || 0}`}
                        value={sizePricing[size]?.price || ''}
                        onChange={(e) => {
                          const newPricing = { ...sizePricing };
                          if (!newPricing[size]) newPricing[size] = { price: 0, mrp: 0 };
                          newPricing[size].price = Number(e.target.value || 0);
                          setSizePricing(newPricing);
                        }}
                        className="w-full rounded border border-white/20 bg-black/60 px-3 py-2 text-sm text-white focus:border-neon focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-white/50 mb-1">MRP</label>
                      <input
                        type="number"
                        min={0}
                        placeholder={`₹${mrp || 0}`}
                        value={sizePricing[size]?.mrp || ''}
                        onChange={(e) => {
                          const newPricing = { ...sizePricing };
                          if (!newPricing[size]) newPricing[size] = { price: 0, mrp: 0 };
                          newPricing[size].mrp = Number(e.target.value || 0);
                          setSizePricing(newPricing);
                        }}
                        className="w-full rounded border border-white/20 bg-black/60 px-3 py-2 text-sm text-white/70 focus:border-neon focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="text-xs text-white/70">
            Tags{" "}
            <span className="text-[10px] text-white/40">
              (comma or hashtag separated)
            </span>
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="#GlowInTheDark, #Tiger, #Unisex"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/40 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        {uploadSuccess && (
          <p className="text-xs text-green-400 bg-green-950/40 border border-green-500/40 rounded-md px-3 py-2">
            {uploadSuccess}
          </p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-neon px-6 py-2 text-sm font-semibold text-black shadow-glow disabled:opacity-60"
          >
            {submitButtonText}
          </button>
        </div>
      </div>

      {/* RIGHT: Images / gallery */}
      <div className="w-full max-w-sm space-y-4 md:w-80">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">Product images</h2>
          <span className="text-[10px] text-white/40">
            First image = hero / main
          </span>
        </div>

        {/* upload box */}
        <div className="rounded-xl border border-dashed border-white/25 bg-black/40 p-4 text-center">
          <p className="text-xs text-white/70 mb-2">
            Upload 1 or more images from your gallery.
            <br />
            Then drag to reorder – first image becomes your hero image.
          </p>
          <label
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white ${
              isUploading
                ? "bg-white/5 cursor-wait"
                : "bg-white/10 hover:bg-white/15"
            }`}
          >
            {isUploading ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Choose images</span>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* hero preview */}
        {images.length > 0 && (
          <div>
            <p className="mb-1 text-xs text-white/60">Hero image (1st)</p>
            <div className="relative h-40 w-full overflow-hidden rounded-xl border border-neon/60 bg-black/60 shadow-glow">
              <Image
                src={images[0]}
                alt="Hero"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* thumbnails with drag & drop */}
        {images.length > 0 && (
          <div>
            <p className="mb-1 text-xs text-white/60">
              All images (drag to change order)
            </p>
            <div className="flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <button
                  key={img + idx}
                  type="button"
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(idx)}
                  className={`group relative h-20 w-20 overflow-hidden rounded-lg border text-[10px] ${
                    idx === 0
                      ? "border-neon"
                      : "border-white/25 hover:border-neon/50"
                  }`}
                  title={
                    idx === 0
                      ? "Hero image"
                      : "Drag to change order. First = hero."
                  }
                >
                  <Image
                    src={img}
                    alt={`Image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute left-1 top-1 rounded bg-black/70 px-1 text-[9px] text-white/80">
                    {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="absolute right-1 top-1 hidden rounded-full bg-black/70 px-1 text-[9px] text-red-300 group-hover:block"
                  >
                    ✕
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
