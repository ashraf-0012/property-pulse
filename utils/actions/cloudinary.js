"use server";

import cloudinary from "@/config/cloudinary";
import { getSessionUser } from "@/utils/getSessionUser";

export async function generateCloudinarySignature() {
  // Only authenticated users should be allowed to request upload signatures.
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("Unauthorized");
  }

  // Generate a timestamp required by Cloudinary.
  const timestamp = Math.round(Date.now() / 1000);

  // Specify the Cloudinary folder where images will be stored.
  const folder = "propertyApp";

  // Generate a signature using server-side credentials.
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  );

  // Return public upload credentials. Never return the API secret.
  return {
    timestamp,
    signature,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  };
}