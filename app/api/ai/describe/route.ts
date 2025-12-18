// Updated: 2025-12-18 - No code changes, just a comment to force redeploy
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { description: product.description },
        { status: 200 }
      );
    }

    const prompt = `Write a short, high-converting product description for a glow-in-the-dark T-shirt.

Name: ${product.name}
Brand: ${product.brand}
Current description: ${product.description}
Audience: Indian buyers who love night rides, gaming, and parties.
Tone: punchy, modern, 2–3 sentences.`;

    const completion = await client!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150
    });

    const text = completion.choices[0]?.message?.content || product.description;

    return NextResponse.json({ description: text });
  } catch (error) {
    console.error("AI Describe error:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
