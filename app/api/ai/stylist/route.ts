import { NextResponse } from "next/server";
import OpenAI from "openai";
import { products } from "@/lib/products";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { message } = await req.json();

  const prompt = `You are a stylist for 3Dark, a glow-in-the-dark T-shirt brand.
We have these products: ${products
    .map((p) => `${p.name} (slug: ${p.slug}, tags: ${p.tags.join(",")})`)
    .join(" | ")}.

User message: "${message}".

Respond in at most 3 sentences. Recommend 1–3 specific tees by name + slug and explain why (occasion/style).`;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply:
        "AI stylist is not configured yet. Ask the owner to set OPENAI_API_KEY."
    });
  }

  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  });

  // naive extraction
  const text =
    (completion.output &&
      completion.output[0] &&
      completion.output[0].content &&
      completion.output[0].content[0] &&
      // @ts-ignore
      completion.output[0].content[0].text) ||
    "Could not generate a reply.";

  return NextResponse.json({ reply: text });
}
