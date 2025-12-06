// app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Increase max duration for upload (10 seconds)
export const maxDuration = 10;

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

    console.log(`Upload request received: ${files.length} file(s)`);
    
    // Log each file info
    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      console.log(`File ${idx + 1}: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    if (!files || files.length === 0) {
      console.error("No files in request");
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const savedUrls: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        console.log(`[${i + 1}/${files.length}] Uploading: ${file.name}`);
        
        // Validate file size (max 10MB per file)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          const errorMsg = `${file.name} exceeds 10MB limit`;
          console.error(errorMsg);
          errors.push(errorMsg);
          continue;
        }

        // Normalize filename
        const safeName = file.name.replaceAll(/[^a-zA-Z0-9.\-_]/g, "_");
        const timestamp = Date.now();
        const filename = `products/${timestamp}-${i}-${safeName}`;

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
          access: "public",
          addRandomSuffix: false,
        });

        console.log(`[${i + 1}/${files.length}] Success: ${blob.url}`);
        savedUrls.push(blob.url);
      } catch (error_: any) {
        const errorMsg = `Failed to upload ${file.name}: ${error_.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    console.log(`Upload complete: ${savedUrls.length} succeeded, ${errors.length} failed`);

    if (savedUrls.length === 0) {
      return NextResponse.json(
        { 
          error: "All uploads failed",
          details: errors
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      urls: savedUrls,
      errors: errors.length > 0 ? errors : undefined
    }, { status: 201 });
  } catch (err: any) {
    console.error("Upload error:", err);
    console.error("Error stack:", err.stack);
    return NextResponse.json(
      { 
        error: err?.message || "Failed to upload files",
        details: err?.stack
      },
      { status: 500 }
    );
  }
}
