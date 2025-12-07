export const metadata = {
  title: "About Us - 3Dark",
  description: "Learn about 3Dark's mission to bring wildlife-inspired streetwear to India. Premium quality, bold designs, and a passion for wildlife conservation.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          About <span className="text-neon">3Dark</span>
        </h1>
        <p className="mt-4 text-lg text-white/70">
          Where Wildlife Meets Streetwear
        </p>
      </div>

      {/* Main Content */}
      <div className="mt-12 space-y-8">
        {/* Our Story */}
        <section>
          <h2 className="text-2xl font-semibold text-neon">Our Story</h2>
          <div className="mt-4 space-y-4 text-white/75">
            <p>
              3Dark was born from a passion for wildlife and bold fashion. We believe that clothing 
              should be more than just fabric—it should tell a story, express personality, and 
              celebrate the raw beauty of nature&apos;s most magnificent creatures.
            </p>
            <p>
              Our journey began with a simple idea: to create premium streetwear that features 
              stunning wildlife designs—tigers, leopards, eagles, pandas, and more. Each piece 
              is carefully crafted to capture the spirit and power of these incredible animals.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold text-neon">Our Mission</h2>
          <div className="mt-4 space-y-4 text-white/75">
            <p>
              At 3Dark, we&apos;re committed to providing high-quality, comfortable apparel for both 
              adults and kids. We source the best materials and work with talented designers to 
              create unique pieces that stand out from the crowd.
            </p>
            <p>
              We believe fashion should be accessible, affordable, and authentic. That&apos;s why we 
              offer competitive pricing without compromising on quality, and we&apos;re constantly 
              expanding our collection to bring you fresh designs.
            </p>
          </div>
        </section>

        {/* Product Quality */}
        <section>
          <h2 className="text-2xl font-semibold text-neon">Premium Quality</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/40 p-5">
              <h3 className="font-semibold text-white">Comfortable Fabrics</h3>
              <p className="mt-2 text-sm text-white/70">
                We use premium cotton blends and breathable materials perfect for 
                Indian weather. Soft, durable, and designed for all-day comfort.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-5">
              <h3 className="font-semibold text-white">Bold Designs</h3>
              <p className="mt-2 text-sm text-white/70">
                Each design is carefully selected to showcase wildlife in stunning detail. 
                Vibrant colors and eye-catching prints that make a statement.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-5">
              <h3 className="font-semibold text-white">Perfect Fit</h3>
              <p className="mt-2 text-sm text-white/70">
                Available in multiple sizes for adults and kids. We ensure proper 
                sizing so you always get the perfect fit.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-5">
              <h3 className="font-semibold text-white">Quality Guaranteed</h3>
              <p className="mt-2 text-sm text-white/70">
                Every product goes through quality checks. We stand behind our 
                products with reliable customer support and hassle-free returns.
              </p>
            </div>
          </div>
        </section>

        {/* Our Collection */}
        <section>
          <h2 className="text-2xl font-semibold text-neon">Our Collection</h2>
          <div className="mt-4 space-y-4 text-white/75">
            <p>
              From fierce tigers to majestic eagles, from playful pandas to powerful leopards—our 
              collection celebrates the diversity of wildlife. We offer:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-white/70">
              <li><strong className="text-white">T-Shirts</strong> – Premium quality tees with bold wildlife prints</li>
              <li><strong className="text-white">Shorts</strong> – Comfortable and stylish for everyday wear</li>
              <li><strong className="text-white">Pants</strong> – Perfect for casual outings or relaxed days</li>
              <li><strong className="text-white">Beanies & Hats</strong> – Complete your look with wildlife-themed headwear</li>
            </ul>
            <p>
              All our products are available in both adult and kids sizes, so the whole family 
              can rock the wildlife style!
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="rounded-2xl border border-neon/40 bg-neon/5 p-6">
          <h2 className="text-2xl font-semibold text-neon">Get in Touch</h2>
          <div className="mt-4 space-y-3 text-white/75">
            <p>
              Have questions about our products? Want to know more about sizing or shipping? 
              We&apos;re here to help!
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong className="text-white">Email:</strong>{" "}
                <a href="mailto:support@3dark.in" className="text-neon hover:underline">
                  support@3dark.in
                </a>
              </p>
              <p>
                <strong className="text-white">Website:</strong>{" "}
                <a href="https://3dark.in" className="text-neon hover:underline">
                  www.3dark.in
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-lg text-white/80">
            Ready to unleash your wild side?
          </p>
          <a
            href="/shop"
            className="mt-4 inline-block rounded-full bg-neon px-8 py-3 font-semibold text-black shadow-glow transition-all hover:brightness-110"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}
