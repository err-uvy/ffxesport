import fs from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

const uploadsDir = path.resolve(process.cwd(), "uploads");

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

export async function uploadBuffer(input: {
  buffer: Buffer;
  mimeType: string;
  folder: string;
  filename: string;
}) {
  if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
    const dataUri = `data:${input.mimeType};base64,${input.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `ffx-esports/${input.folder}`,
      resource_type: "auto"
    });
    return result.secure_url;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("Cloudinary must be configured in production");
  }

  const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "");
  const folder = path.join(uploadsDir, input.folder);
  await fs.mkdir(folder, { recursive: true });
  const filePath = path.join(folder, `${Date.now()}-${safeName}`);
  await fs.writeFile(filePath, input.buffer);
  return `/uploads/${input.folder}/${path.basename(filePath)}`;
}
