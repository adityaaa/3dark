"use client";

import { useState, useEffect } from "react";
import { Star, StarHalf } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  title: string | null;
  comment: string;
  customerName: string;
  isVerified: boolean;
  createdAt: string;
}

interface ReviewStats {
  average: number;
  total: number;
  counts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const sizeClass = size === "lg" ? "w-5 h-5" : "w-4 h-4";

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className={`${sizeClass} fill-yellow-400 text-yellow-400`} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className={`${sizeClass} fill-yellow-400 text-yellow-400`} />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className={`${sizeClass} text-gray-300`} />);
    }

    return <div className="flex gap-0.5">{stars}</div>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-48"></div>
          <div className="h-24 bg-white/10 rounded"></div>
          <div className="h-24 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats || reviews.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <p className="text-white/60">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{stats.average}</div>
              {renderStars(stats.average, "lg")}
              <div className="text-sm text-white/60 mt-2">{stats.total} reviews</div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.counts[star as keyof typeof stats.counts];
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm w-12">{star} star</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-white/60 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white/5 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {renderStars(review.rating)}
                  {review.isVerified && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                {review.title && (
                  <h3 className="font-semibold text-lg mb-1">{review.title}</h3>
                )}
              </div>
              <div className="text-sm text-white/60">
                {formatDate(review.createdAt)}
              </div>
            </div>

            <p className="text-white/80 mb-3">{review.comment}</p>

            <div className="text-sm text-white/60">
              By <span className="text-white">{review.customerName}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
