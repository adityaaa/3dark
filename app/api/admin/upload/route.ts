// app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const savedPaths: string[] = [];

    for (const file of files) {
      // Normalise filename
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const timestamp = Date.now();
      const filename = `${timestamp}-${safeName}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const folder = path.join(process.cwd(), "public", "products");
      await fs.mkdir(folder, { recursive: true });

      const filePath = path.join(folder, filename);
      await fs.writeFile(filePath, buffer);

      savedPaths.push(`/products/${filename}`);
    }

    return NextResponse.json({ urls: savedPaths }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
