import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, width, height } = await req.json();

    if (!prompt || prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // minimax/video-01 — free trial credits on Replicate
    const output = await replicate.run("minimax/video-01", {
      input: {
        prompt:          prompt.trim(),
        prompt_optimizer: true,
      },
    });

    let videoUrl: string;

    if (typeof output === "string") {
      videoUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      const first = output[0];
      videoUrl = typeof first === "string" ? first : (first as { url(): string }).url();
    } else if (output && typeof (output as { url?: () => string }).url === "function") {
      videoUrl = (output as { url(): string }).url();
    } else {
      return NextResponse.json({ error: "No video output from Replicate" }, { status: 500 });
    }

    // Upload to Cloudinary as video
    const uploadResult = await cloudinary.uploader.upload(videoUrl, {
      folder:        "nodeflow/videos",
      resource_type: "video",
    });

    return NextResponse.json({
      url:      uploadResult.secure_url,
      publicId: uploadResult.public_id,
      duration: uploadResult.duration,
    });

  } catch (err: unknown) {
    console.error("[generate-video]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}