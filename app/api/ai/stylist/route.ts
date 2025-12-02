import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/db";

const client = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        reply: "AI stylist is not configured yet. Ask the owner to set OPENAI_API_KEY."
      });
    }

    // Fetch products from database
    const products = await prisma.product.findMany({
      select: { name: true, slug: true, tags: true, brand: true }
    });

    const productList = products
      .map((p) => `${p.name} by ${p.brand} (slug: ${p.slug}, tags: ${p.tags})`)
      .join(" | ");

    const prompt = `You are a stylist for 3Dark, a glow-in-the-dark T-shirt brand.
We have these products: ${productList}.

User message: "${message}".

Respond in at most 3 sentences. Recommend 1–3 specific tees by name + slug and explain why (occasion/style).`;

    const completion = await client!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    });

    const text = completion.choices[0]?.message?.content || "Could not generate a reply.";

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("AI Stylist error:", error);
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble right now. Please try again later." },
      { status: 500 }
    );
  }
}
