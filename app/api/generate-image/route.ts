import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { v2 as cloudinary } from "cloudinary";

// ── Cloudinary config ──────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ── Replicate client ───────────────────────────────────────────────────────
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// ── Model map ──────────────────────────────────────────────────────────────
// Each value is a Replicate model version string
const MODEL_MAP: Record<string, `${string}/${string}` | `${string}/${string}:${string}`> = {
  flux:   "black-forest-labs/flux-schnell",   // fastest, free credits
  sdxl:   "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37ec1375916b9f44cfd8b7f2",
  gpt4o:  "black-forest-labs/flux-schnell",   // fallback to flux for image
  claude: "black-forest-labs/flux-schnell",
  gemini: "black-forest-labs/flux-schnell",
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, width, height, model } = await req.json();

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const replicateModel = MODEL_MAP[model] ?? MODEL_MAP.flux;

    // ── 1. Run Replicate ───────────────────────────────────────────────────
    const output = await replicate.run(replicateModel, {
      input: {
        prompt:      prompt.trim(),
        width:       Number(width)  || 1024,
        height:      Number(height) || 1024,
        num_outputs: 1,
        output_format: "webp",
        output_quality: 90,
      },
    });

    // Replicate returns an array of URLs or a ReadableStream
    let imageUrl: string;

    if (Array.isArray(output) && output.length > 0) {
      const first = output[0];
      // New Replicate SDK returns FileOutput objects with a url() method
      imageUrl = typeof first === "string" ? first : (first as { url(): string }).url();
    } else {
      return NextResponse.json({ error: "No output from Replicate" }, { status: 500 });
    }

    // ── 2. Upload to Cloudinary ────────────────────────────────────────────
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder:         "nodeflow/images",
      resource_type:  "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    return NextResponse.json({
      url:       uploadResult.secure_url,
      publicId:  uploadResult.public_id,
      width:     uploadResult.width,
      height:    uploadResult.height,
    });

  } catch (err: unknown) {
    console.error("[generate-image]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}