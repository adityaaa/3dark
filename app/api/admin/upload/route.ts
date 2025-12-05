// app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error("Upload failed: No session");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    console.log(`Upload request: ${files.length} file(s)`);

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const savedUrls: string[] = [];

    for (const file of files) {
      console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);
      
      // Normalize filename
      const safeName = file.name.replaceAll(/[^a-zA-Z0-9.\-_]/g, "_");
      const timestamp = Date.now();
      const filename = `products/${timestamp}-${safeName}`;

      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
      });

      console.log(`Uploaded successfully: ${blob.url}`);
      savedUrls.push(blob.url);
    }

    console.log(`Upload complete: ${savedUrls.length} file(s) uploaded`);
    return NextResponse.json({ urls: savedUrls }, { status: 201 });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to upload files" },
      { status: 500 }
    );
  }
}
