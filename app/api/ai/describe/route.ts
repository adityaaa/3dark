import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
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
Glow level: ${product.glowLevel}/5
Audience: Indian buyers who love night rides, gaming, and parties.
Tone: punchy, modern, 2–3 sentences.`;

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
    product.description;

  return NextResponse.json({ description: text });
}
