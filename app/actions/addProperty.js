"use server";

import connectDb from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function addProperty(formData) {
  // 1. Connect to MongoDB before performing database operations.
  await connectDb();

  // 2. Get the currently authenticated user.
  // This ensures only logged-in users can create properties.
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  // 3. Retrieve all selected amenities.
  // getAll() is used because multiple amenities can have the same field name.
  const amenities = formData.getAll("amenities");

  // 4. Retrieve Cloudinary image URLs.
  // Images are uploaded directly from the browser to Cloudinary.
  // The Server Action now receives URLs instead of image files.
  const imageUrls = formData.getAll("images");

  // Ensure users provide at least one image and never exceed four.
  if (
    imageUrls.length === 0 ||
    imageUrls.length > 4 ||
    imageUrls.some((url) => typeof url !== "string" || !url.trim())
  ) {
    throw new Error("Please upload between 1 and 4 valid images");
  }

  // 5. Collect property information from the submitted form.
  // These field names must match the name attributes in the form.
  const propertyData = {
    owner: userId,
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),

    // Property location details.
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zipcode: formData.get("location.zipcode"),
    },

    // Property specifications.
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    square_feet: formData.get("square_feet"),

    amenities,

    // Rental rates.
    rates: {
      nightly: formData.get("rates.nightly"),
      weekly: formData.get("rates.weekly"),
      monthly: formData.get("rates.monthly"),
    },

    // Seller contact information.
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },

    // Store the Cloudinary URLs in the property document.
    images: imageUrls,
  };

  // 6. Create a new Property document using the collected information.
  const newProperty = new Property(propertyData);

  // Save the property document to MongoDB.
  await newProperty.save();

  // 7. Refresh cached pages so the newly created property appears
  // wherever property data is displayed.
  revalidatePath("/", "layout");

  // 8. Redirect the user to the newly created property's details page.
  redirect(`/properties/${newProperty._id}`);
}

export default addProperty;
