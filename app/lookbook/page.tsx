import Link from "next/link";
import { Camera, Instagram, Zap, Heart } from "lucide-react";

export const metadata = {
  title: "Lookbook - 3Dark Glow Wildlife Collection",
  description: "See our glow-in-the-dark wildlife apparel in action. Style inspiration, customer photos, and the magic of our premium glow technology.",
};

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <div className="inline-block rounded-full border border-neon/30 bg-neon/10 px-4 py-1.5 mb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-neon font-semibold">
              ⚡ Visual Gallery
            </p>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            See The <span className="text-neon">Glow</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed mb-8">
            Experience how our wildlife designs transform from day to night. 
            Real photos from real customers living their boldest moments.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-gradient-to-r from-neon to-blue-400 px-8 py-3.5 text-sm font-bold text-black shadow-lg shadow-neon/50 transition-all hover:shadow-xl hover:shadow-neon/70 hover:scale-105"
            >
              Shop The Collection
            </Link>
            <a
              href="https://instagram.com/3dark.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white/90 transition-all hover:border-neon hover:text-neon hover:bg-neon/5"
            >
              <Instagram className="h-4 w-4" />
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl border-2 border-neon/30 bg-gradient-to-br from-neon/10 via-purple-500/10 to-blue-500/10 p-12 text-center">
          <div className="inline-block rounded-full bg-neon/20 p-4 mb-6">
            <Camera className="h-12 w-12 text-neon" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            Lookbook Coming Soon! 📸
          </h2>
          
          <p className="max-w-2xl mx-auto text-lg text-white/70 mb-8">
            We&apos;re currently shooting amazing content to showcase our glow-in-the-dark 
            wildlife collection. In the meantime, check out our products and follow us 
            on social media for sneak peeks!
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <Zap className="h-8 w-8 text-neon mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Glow Effect Demos</h3>
              <p className="text-sm text-white/60">
                Day vs night comparison shots showing our premium glow technology
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <Heart className="h-8 w-8 text-pink-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Customer Stories</h3>
              <p className="text-sm text-white/60">
                Real people wearing 3Dark at concerts, parties, and adventures
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <Camera className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Style Inspiration</h3>
              <p className="text-sm text-white/60">
                How to rock our wildlife prints in different settings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder Gallery Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          What&apos;s Coming to the Lookbook
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Concert Nights", desc: "Glow under stage lights" },
            { title: "Street Style", desc: "Urban wildlife fashion" },
            { title: "Night Adventures", desc: "Shine in the darkness" },
            { title: "Festival Vibes", desc: "Stand out in crowds" },
            { title: "Party Mode", desc: "Light up the dance floor" },
            { title: "Daily Flex", desc: "Bold daytime looks" },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/30 to-black"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,180,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="border-t border-white/10 bg-gradient-to-b from-transparent via-neon/5 to-transparent">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Want to Be Featured?
          </h2>
          
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Post your 3Dark looks on Instagram and tag us <span className="text-neon font-semibold">@3dark.in</span> with 
            <span className="text-neon font-semibold"> #GlowWith3Dark</span> for a chance to be featured in our lookbook!
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="rounded-full bg-neon px-10 py-4 text-base font-bold text-black shadow-lg shadow-neon/50 transition-all hover:shadow-xl hover:shadow-neon/70 hover:scale-105"
            >
              Shop Now
            </Link>
            <a
              href="https://instagram.com/3dark.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border-2 border-neon/50 px-10 py-4 text-base font-semibold text-neon transition-all hover:bg-neon/10"
            >
              <Instagram className="h-5 w-5" />
              Follow Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
