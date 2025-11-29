export default function LookbookPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Lookbook</h1>
      <p className="mt-3 text-sm text-white/70">
        This is a placeholder lookbook. Later you can pull real photos from
        Instagram or your own shoots.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="h-40 rounded-2xl bg-black/60 flex items-center justify-center text-xs text-white/60">
          Rider night shot
        </div>
        <div className="h-40 rounded-2xl bg-black/60 flex items-center justify-center text-xs text-white/60">
          Concert crowd
        </div>
        <div className="h-40 rounded-2xl bg-black/60 flex items-center justify-center text-xs text-white/60">
          Gamer setup
        </div>
      </div>
    </div>
  );
}
