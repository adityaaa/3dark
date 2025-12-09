// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { mapProduct, applyBrandPricing, getLowestPrice } from "@/lib/utils";
import { Star, Zap, Shield, Truck, MessageCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "3Dark - Wildlife That Glows in the Dark | Premium Glow-in-Dark Apparel",
  description: "India&apos;s first glow-in-the-dark wildlife streetwear. Best quality glow technology meets hyper-realistic animal designs. Tigers, leopards, pandas & more. Shop adult & kids collections.",
};

export default async function HomePage() {
  // Fetch more products for homepage (8 instead of 3)
  const productsDb = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  // Get all brand pricings
  const brandPricings = await prisma.brandPricing.findMany();
  
  // Create a map keyed by brand+category+ageGroup for quick lookup
  const brandPricingMap = new Map(
    brandPricings.map(bp => [`${bp.brand}:${bp.category}:${bp.ageGroup}`, bp.sizePricing])
  );

  // Map products and apply brand pricing
  const products = productsDb.map(p => {
    const product = mapProduct(p);
    const pricingKey = `${p.brand}:${p.category}:${p.ageGroup}`;
    const brandPricing = brandPricingMap.get(pricingKey);
    return applyBrandPricing(product, brandPricing || null);
  });

  // Get average rating from reviews
  const avgRating = await prisma.review.aggregate({
    _avg: { rating: true },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO - Wildlife + Glow Combo */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,180,0.15),_transparent_60%),radial-gradient(circle_at_bottom_right,_rgba(255,0,180,0.12),_transparent_60%)]" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="flex flex-col gap-12 md:flex-row md:items-center md:gap-16">
            {/* Left: Hero Text */}
            <div className="flex-1 space-y-6">
              <div className="inline-block rounded-full border border-neon/30 bg-neon/10 px-4 py-1.5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-neon font-semibold">
                  ⚡ India&apos;s First Glow Wildlife Collection
                </p>
              </div>
              
              <h1 className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
                Wildlife That
                <br />
                <span className="bg-gradient-to-r from-neon via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Comes Alive
                </span>
                <br />
                at Night
              </h1>
              
              <p className="max-w-xl text-lg text-white/80 leading-relaxed">
                Premium <span className="text-neon font-semibold">glow-in-the-dark</span> apparel 
                with hyper-realistic wildlife designs. Best-in-class glow technology meets 
                bold animal prints. Tigers, leopards, pandas, eagles.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  href="/shop"
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-neon to-blue-400 px-8 py-3.5 text-sm font-bold text-black shadow-lg shadow-neon/50 transition-all hover:shadow-xl hover:shadow-neon/70 hover:scale-105"
                >
                  <span className="relative z-10">Shop Glow Collection</span>
                </Link>
                <Link
                  href="/lookbook"
                  className="rounded-full border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white/90 transition-all hover:border-neon hover:text-neon hover:bg-neon/5"
                >
                  View Lookbook
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Zap className="h-4 w-4 text-neon" />
                  <span>Best Quality Glow</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Truck className="h-4 w-4 text-neon" />
                  <span>Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Shield className="h-4 w-4 text-neon" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Visual - Before/After Split */}
            <div className="flex-1">
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-3xl border-2 border-neon/40 bg-gradient-to-br from-black via-purple-900/20 to-neon/10 shadow-2xl shadow-neon/30">
                  {/* Placeholder for hero image - will replace with actual product */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,180,0.3),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(255,0,180,0.25),transparent_50%)]" />
                  
                  {/* Day/Night Split Effect */}
                  <div className="relative h-full flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="inline-block rounded-2xl border border-neon/50 bg-black/80 backdrop-blur-sm px-6 py-3">
                        <p className="text-xs uppercase tracking-[0.25em] text-neon font-bold">
                          Charge in Light
                        </p>
                      </div>
                      
                      <div className="text-6xl">🐯</div>
                      
                      <div className="inline-block rounded-2xl border border-purple-500/50 bg-black/80 backdrop-blur-sm px-6 py-3">
                        <p className="text-xs uppercase tracking-[0.25em] text-purple-400 font-bold">
                          Glow in Dark
                        </p>
                      </div>
                      
                      <p className="text-sm text-white/70 max-w-xs mx-auto">
                        Charges in 10-15 minutes. Glows for hours. Perfect for concerts, 
                        parties, and night adventures.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                  <div className="rounded-xl border border-white/10 bg-black/90 backdrop-blur-sm px-6 py-3 shadow-xl">
                    <p className="text-2xl font-bold text-neon">{avgRating._avg.rating?.toFixed(1) || "4.8"}</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider">Rating</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/90 backdrop-blur-sm px-6 py-3 shadow-xl">
                    <p className="text-2xl font-bold text-neon">100%</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider">Glow Quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Shop by Category</h2>
          <p className="text-white/60">Find your perfect glow-in-the-dark style</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/shop?category=tshirt" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-neon/70 hover:bg-white/10 hover:shadow-lg hover:shadow-neon/20">
            <div className="text-4xl mb-3">👕</div>
            <h3 className="font-semibold text-lg mb-1">T-Shirts</h3>
            <p className="text-xs text-white/60">Glow Wildlife Tees</p>
          </Link>

          <Link href="/shop?category=shorts" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-neon/70 hover:bg-white/10 hover:shadow-lg hover:shadow-neon/20">
            <div className="text-4xl mb-3">🩳</div>
            <h3 className="font-semibold text-lg mb-1">Shorts</h3>
            <p className="text-xs text-white/60">Bold Animal Prints</p>
          </Link>

          <Link href="/shop?category=pants" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-neon/70 hover:bg-white/10 hover:shadow-lg hover:shadow-neon/20">
            <div className="text-4xl mb-3">👖</div>
            <h3 className="font-semibold text-lg mb-1">Pants</h3>
            <p className="text-xs text-white/60">Streetwear Style</p>
          </Link>

          <Link href="/shop?category=beanie-hat" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-neon/70 hover:bg-white/10 hover:shadow-lg hover:shadow-neon/20">
            <div className="text-4xl mb-3">🧢</div>
            <h3 className="font-semibold text-lg mb-1">Beanies</h3>
            <p className="text-xs text-white/60">Complete the Look</p>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-16 border-t border-white/10">
        <div className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Collection</h2>
            <p className="text-white/60">Our best glow-in-the-dark wildlife designs</p>
          </div>
          <Link
            href="/shop"
            className="rounded-full border border-neon/30 bg-neon/10 px-6 py-2.5 text-sm font-semibold text-neon hover:bg-neon/20 transition-all"
          >
            View All Products →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-white/60">
            No products yet. Add some from{" "}
            <Link href="/admin/products" className="text-neon underline">
              Admin &gt; Products
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => {
              const { price: displayPrice, mrp: displayMrp } = getLowestPrice(p);
              const discount = displayMrp > displayPrice ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;
              
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-neon/70 hover:bg-white/10 hover:shadow-lg hover:shadow-neon/20"
                >
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-2 right-2 z-10 rounded-full bg-neon px-3 py-1 text-[10px] font-bold text-black">
                      {discount}% OFF
                    </div>
                  )}
                  
                  {/* Product Image */}
                  <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-black to-purple-900/20">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-neon font-semibold">
                        {p.brand}
                      </p>
                      {/* Star Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-white/70">4.5</span>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-semibold line-clamp-2 leading-snug">
                      {p.name}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-bold text-neon">₹{displayPrice}</span>
                      {displayMrp > displayPrice && (
                        <span className="text-sm text-white/40 line-through">
                          ₹{displayMrp}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* WHY CHOOSE 3DARK */}
      <section className="border-t border-white/10 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose 3Dark?</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              India&apos;s first and only glow-in-the-dark wildlife streetwear brand. 
              We combine cutting-edge glow technology with stunning wildlife artistry.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-neon/50 hover:bg-white/10">
                <div className="mb-4 inline-block rounded-xl bg-neon/10 p-3">
                  <Zap className="h-8 w-8 text-neon" />
                </div>
                <h3 className="text-xl font-bold mb-3">Best-in-Class Glow</h3>
                <p className="text-white/70 leading-relaxed">
                  Premium phosphorescent technology that charges in 10-15 minutes 
                  and glows intensely for hours. Not your average glow-in-the-dark!
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-neon/50 hover:bg-white/10">
                <div className="mb-4 inline-block rounded-xl bg-purple-500/10 p-3">
                  <span className="text-4xl">🐯</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Hyper-Realistic Wildlife</h3>
                <p className="text-white/70 leading-relaxed">
                  Stunning animal designs featuring tigers, leopards, pandas, eagles, 
                  and wolves. Each print is carefully crafted for maximum impact.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-neon/50 hover:bg-white/10">
                <div className="mb-4 inline-block rounded-xl bg-blue-500/10 p-3">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
                <p className="text-white/70 leading-relaxed">
                  Comfortable, durable fabrics that look great and feel amazing. 
                  Available for both adults and kids. Affordable luxury.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 py-16 border-t border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">What Customers Say</h2>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-current" />
            ))}
            <span className="ml-2 text-white/70">
              {avgRating._avg.rating?.toFixed(1) || "4.8"} out of 5 ({await prisma.review.count()} reviews)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              id: "review-1",
              name: "Rahul M.",
              rating: 5,
              text: "The glow effect is INSANE! Wore it to a concert and got so many compliments. The tiger print looks amazing in daylight and glows like crazy at night. Best purchase ever!",
            },
            {
              id: "review-2",
              name: "Priya S.",
              rating: 5,
              text: "Bought the leopard tee for my son's birthday party. All the kids were amazed by the glow! Quality is top-notch and the print is so detailed. Highly recommend!",
            },
            {
              id: "review-3",
              name: "Arjun K.",
              rating: 5,
              text: "Finally found something unique! The wolf design is sick and the glow lasts for hours. Perfect for night rides. 3Dark is the real deal! 🔥",
            },
          ].map((review) => (
            <div key={review.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].slice(0, review.rating).map((star) => (
                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white/80 leading-relaxed mb-4">{review.text}</p>
              <p className="text-sm font-semibold text-neon">{review.name}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-6 py-3 text-sm font-semibold text-neon hover:bg-neon/20 transition-all"
          >
            <span>Shop Now & Join Happy Customers →</span>
          </Link>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="border-t border-white/10 bg-gradient-to-b from-transparent via-neon/5 to-transparent">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="inline-block rounded-full border border-neon/30 bg-neon/10 px-4 py-1.5 mb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neon font-semibold">
              ⚡ Limited Stock Available
            </p>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Stand Out
            <br />
            <span className="text-neon">in the Dark?</span>
          </h2>
          
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who&apos;ve discovered the magic of 
            glow-in-the-dark wildlife apparel. Shop now and experience the difference.
          </p>
          
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon to-blue-400 px-10 py-4 text-base font-bold text-black shadow-lg shadow-neon/50 transition-all hover:shadow-xl hover:shadow-neon/70 hover:scale-105"
          >
            Explore Collection
            <Zap className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href="https://wa.me/919425322743?text=Hi!%20I'm%20interested%20in%203Dark%20glow-in-the-dark%20products"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-green-500 px-5 py-4 text-white shadow-2xl transition-all hover:bg-green-600 hover:scale-110 hover:shadow-green-500/50"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden md:inline font-semibold">Chat with us</span>
      </a>
    </div>
  );
}
