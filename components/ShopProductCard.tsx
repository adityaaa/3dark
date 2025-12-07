"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  brand: string;
  image: string;
  images: string[];
  price: number;
  mrp: number;
}

interface ReviewStats {
  average: number;
  total: number;
}

export default function ShopProductCard({ 
  id, 
  slug, 
  name, 
  brand, 
  image, 
  images,
  price, 
  mrp 
}: Readonly<ProductCardProps>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);

  // Fetch review stats for this product
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${id}`);
        const data = await res.json();
        if (data.success && data.stats) {
          setReviewStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching review stats:", error);
      }
    };
    fetchStats();
  }, [id]);

  // Auto-cycle through images on hover
  useEffect(() => {
    if (!isHovering || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 800); // Change image every 800ms

    return () => clearInterval(interval);
  }, [isHovering, images.length]);

  const displayImage = images.length > 1 && isHovering 
    ? images[currentImageIndex] 
    : image;

  return (
    <Link
      href={`/product/${slug}`}
      className="group rounded-2xl bg-bg-soft/80 p-3 border border-white/5 hover:border-neon/40 hover:shadow-glow transition"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentImageIndex(0);
      }}
    >
      <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-black/60">
        <Image
          src={displayImage}
          alt={name}
          fill
          className="object-contain transition-opacity duration-300"
          priority={false}
        />
        
        {/* Image counter badge - shows on hover if multiple images */}
        {isHovering && images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] text-white/80">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <span className="text-sm font-medium group-hover:text-neon line-clamp-2">
          {name}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-white/40">
          {brand}
        </span>

        {/* Star Rating */}
        {reviewStats && reviewStats.total > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={`star-${id}-${i}`}
                  className={`w-3 h-3 ${
                    i < Math.round(reviewStats.average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-600 text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-white/60">
              {reviewStats.average.toFixed(1)} ({reviewStats.total})
            </span>
          </div>
        )}

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold">₹{price}</span>
          {mrp > price && (
            <span className="text-[11px] line-through text-white/40">
              ₹{mrp}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
