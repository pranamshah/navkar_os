import { NextResponse } from "next/server";
import { auth } from "@/auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED  = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

/**
 * Upload a file.
 *
 * Priority:
 *  1. If all three CLOUDINARY_* env-vars are set → upload to Cloudinary
 *  2. Otherwise → base64 data-URL (works for dev/demo; admin can view inline)
 *
 * The base64 path keeps onboarding functional even before Cloudinary is wired up.
 */
export async function POST(req: Request) {
  try {
    /* ── Auth ─────────────────────────────────────────────────────── */
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please sign in to upload documents." }, { status: 401 });
    }

    /* ── Parse form data ──────────────────────────────────────────── */
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const file   = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) ?? "navkaros/documents";

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 5 MB." }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Please upload a PDF, JPG, PNG, or WebP." }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    /* ── Cloudinary (if configured) ───────────────────────────────── */
    const cloudName   = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey      = process.env.CLOUDINARY_API_KEY;
    const apiSecret   = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      try {
        const { v2: cloudinary } = await import("cloudinary");
        cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

        const result = await cloudinary.uploader.upload(dataUrl, {
          folder: `${folder}/${session.user.id}`,
          resource_type: "auto",
          allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
        });

        return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
      } catch (cloudErr) {
        console.error("[upload] Cloudinary upload failed:", cloudErr);
        // fall through to base64 fallback
      }
    }

    /* ── Base-64 fallback ─────────────────────────────────────────── */
    // Stored as a data URL. Works for verification — admin can open in browser.
    // Replace with proper storage when Cloudinary / S3 credentials are added.
    console.info("[upload] Cloudinary not configured or failed — storing as data URL.");
    return NextResponse.json({ url: dataUrl, publicId: `local-${Date.now()}` });

  } catch (err) {
    console.error("[upload] Unexpected error:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
