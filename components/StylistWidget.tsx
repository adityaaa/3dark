"use client";

import { useState } from "react";

export default function StylistWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!msg.trim()) return;
    setLoading(true);
    setReply(null);
    const res = await fetch("/api/ai/stylist", {
      method: "POST",
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    setReply(data.reply);
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 rounded-full bg-neon px-4 py-2 text-xs font-semibold text-black shadow-glow"
      >
        AI Stylist
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-72 rounded-2xl bg-bg-soft/95 border border-neon/40 shadow-glow p-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-neon">3Dark Stylist</span>
        <button onClick={() => setOpen(false)} className="text-white/60">
          ×
        </button>
      </div>
      <p className="mt-1 text-white/60">
        Tell me where you&apos;re going (party, ride, gaming, date) and I&apos;ll
        suggest a tee.
      </p>
      <textarea
        className="mt-2 w-full rounded-md border border-white/15 bg-black/40 px-2 py-1 text-xs outline-none focus:border-neon/60"
        rows={2}
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="e.g. Night ride with friends and café later"
      />
      <button
        onClick={send}
        disabled={loading}
        className="mt-2 w-full rounded-full bg-neon px-3 py-1.5 text-xs font-semibold text-black hover:brightness-95 disabled:opacity-60"
      >
        {loading ? "Thinking…" : "Get suggestions"}
      </button>
      {reply && (
        <div className="mt-2 rounded-md bg-black/40 p-2 text-[11px] text-white/80">
          {reply}
        </div>
      )}
    </div>
  );
}
