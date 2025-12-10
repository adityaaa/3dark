export const metadata = {
  title: "Support & FAQ - 3Dark",
  description: "Get help with your order. Find answers about shipping, returns, sizing, payments, and more.",
};

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          <span className="text-neon">Support</span> & FAQ
        </h1>
        <p className="mt-4 text-lg text-white/70">
          We&apos;re here to help! Find answers to common questions below.
        </p>
      </div>

      {/* Contact Section */}
      <div className="mt-12 rounded-2xl border border-neon/40 bg-neon/5 p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-neon">Contact Us</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-white">Email Support</h3>
            <p className="mt-2 text-sm text-white/70">
              For any queries, complaints, or support:
            </p>
            <a
              href="mailto:support@3dark.in"
              className="mt-2 inline-block text-neon hover:underline"
            >
              support@3dark.in
            </a>
            <p className="mt-2 text-xs text-white/60">
              Response time: Within 24 hours
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Business Hours</h3>
            <p className="mt-2 text-sm text-white/70">
              Monday - Saturday: 10:00 AM - 7:00 PM IST
            </p>
            <p className="text-sm text-white/70">
              Sunday: Closed
            </p>
            <p className="mt-2 text-xs text-white/60">
              We respond to emails even on holidays!
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="mt-12 space-y-8">
        {/* Shipping */}
        <section>
          <h2 className="text-2xl font-semibold text-neon">📦 Shipping & Delivery</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Do you ship all over India?</h3>
              <p className="mt-2 text-sm text-white/70">
                Yes! We ship to all serviceable pin codes across India using reliable courier partners.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">How long does delivery take?</h3>
              <p className="mt-2 text-sm text-white/70">
                Most orders are delivered within 5-7 working days. Metro cities typically receive 
                orders in 3-5 days, while remote areas may take 7-10 days.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">What are the shipping charges?</h3>
              <p className="mt-2 text-sm text-white/70">
                Shipping is FREE on orders above ₹999. For orders below ₹999, a flat shipping 
                charge of ₹99 applies.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Can I track my order?</h3>
              <p className="mt-2 text-sm text-white/70">
                Yes! Once your order is shipped, you&apos;ll receive a tracking number via email. 
                You can use this to track your package.
              </p>
            </div>
          </div>
        </section>

        {/* Returns & Exchanges */}
        <section>
          <h2 className="text-2xl font-semibold text-neon">🔄 Returns & Exchanges</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">What is your return policy?</h3>
              <p className="mt-2 text-sm text-white/70">
                We accept returns only if the product is damaged, defective, or if you received 
                the wrong item. Please contact us within 48 hours of delivery with unboxing photos.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Can I exchange for a different size?</h3>
              <p className="mt-2 text-sm text-white/70">
                Due to hygiene reasons and limited stock, we generally don&apos;t accept size exchanges. 
                Please check our size guide carefully before ordering. If you receive a defective 
                product, we&apos;ll be happy to help.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">How do I initiate a return?</h3>
              <p className="mt-2 text-sm text-white/70">
                Email us at support@3dark.in within 48 hours with your order number, issue description, 
                and clear photos of the product. Our team will guide you through the return process.
              </p>
            </div>
          </div>
        </section>

        {/* Sizing */}
        <section>
          <h2 className="text-2xl font-semibold text-neon">📏 Sizing Guide</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Adult Sizes</h3>
              <p className="mt-2 text-sm text-white/70">
                We offer S, M, L, XL, XXL, and XXXL sizes for adults. Each product page has 
                detailed measurements. If you&apos;re between sizes, we recommend sizing up.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Kids Sizes</h3>
              <p className="mt-2 text-sm text-white/70">
                Kids sizes are age-based: 2-4 Years, 4-6 Years, 6-8 Years, 8-10 Years, 10-12 Years, 
                and 12-14 Years. Check the measurements on each product page for accurate sizing.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">How do I find the right size?</h3>
              <p className="mt-2 text-sm text-white/70">
                Measure your current best-fitting t-shirt/shorts and compare with our size chart. 
                If you need help, email us your measurements and we&apos;ll recommend the perfect size!
              </p>
            </div>
          </div>
        </section>

        {/* Payments */}
        <section>
          <h2 className="text-2xl font-semibold text-neon">💳 Payments</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">What payment methods do you accept?</h3>
              <p className="mt-2 text-sm text-white/70">
                We accept all major payment methods via Razorpay: Credit/Debit Cards, Net Banking, 
                UPI, Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery (COD).
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Is Cash on Delivery available?</h3>
              <p className="mt-2 text-sm text-white/70">
                Yes! COD is available on most pin codes. You can choose this option during checkout.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Are online payments secure?</h3>
              <p className="mt-2 text-sm text-white/70">
                Absolutely! We use Razorpay, India&apos;s most trusted payment gateway. All transactions 
                are encrypted and 100% secure. We never store your card details.
              </p>
            </div>
          </div>
        </section>

        {/* Product Care */}
        <section>
          <h2 className="text-2xl font-semibold text-neon">🧺 Product Care</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">How do I care for my 3Dark products?</h3>
              <div className="mt-2 space-y-2 text-sm text-white/70">
                <p>• Machine wash in cold water with similar colors</p>
                <p>• Avoid bleach and harsh detergents</p>
                <p>• Tumble dry on low or hang dry</p>
                <p>• Iron inside out on low heat if needed</p>
                <p>• Do not dry clean</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Will the print fade after washing?</h3>
              <p className="mt-2 text-sm text-white/70">
                Our prints are high-quality and designed to last. Follow the care instructions 
                above, and your products will stay vibrant wash after wash!
              </p>
            </div>
          </div>
        </section>

        {/* Other Questions */}
        <section>
          <h2 className="text-2xl font-semibold text-neon">❓ Other Questions</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Do you offer wholesale or bulk orders?</h3>
              <p className="mt-2 text-sm text-white/70">
                Yes! For wholesale inquiries or bulk orders (10+ pieces), please email us at 
                support@3dark.in with your requirements.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Can I cancel my order?</h3>
              <p className="mt-2 text-sm text-white/70">
                Orders can be cancelled within 2 hours of placement. After that, the order may 
                already be processed. Contact us immediately if you need to cancel.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Do you restock sold-out items?</h3>
              <p className="mt-2 text-sm text-white/70">
                We try our best to restock popular items, but some designs are limited edition. 
                Follow us on social media for restock announcements!
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Still Need Help? */}
      <div className="mt-12 text-center rounded-2xl border border-white/10 bg-black/40 p-8">
        <h2 className="text-2xl font-semibold text-white">Still Need Help?</h2>
        <p className="mt-3 text-white/70">
          Can&apos;t find the answer you&apos;re looking for? Our team is here to help!
        </p>
        <a
          href="mailto:support@3dark.in"
          className="mt-6 inline-block rounded-full bg-neon px-8 py-3 font-semibold text-black shadow-glow transition-all hover:brightness-110"
        >
          Email Us: support@3dark.in
        </a>
        <p className="mt-4 text-sm text-white/60">
          We&apos;ll get back to you within 24 hours!
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/60">
          <span>Follow us:</span>
          <a
            href="https://www.instagram.com/3darkclothings/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon transition hover:brightness-110"
          >
            Instagram
          </a>
          <span>•</span>
          <a
            href="https://www.facebook.com/3dark.official"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon transition hover:brightness-110"
          >
            Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
