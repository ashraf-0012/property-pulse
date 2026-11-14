"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

import addProperty from "@/app/actions/addProperty";
import { generateCloudinarySignature } from "@/utils/actions/cloudinary";

const PropertyAddForm = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");

  // Upload an image directly from the browser to Cloudinary.
  const uploadToCloudinary = (file, credentials, onProgress) => {
    return new Promise((resolve, reject) => {
      const uploadData = new FormData();

      uploadData.append("file", file);
      uploadData.append("api_key", credentials.apiKey);
      uploadData.append("timestamp", credentials.timestamp);
      uploadData.append("signature", credentials.signature);
      uploadData.append("folder", credentials.folder);

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`,
      );

      // Track the upload progress for the current image.
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);

          onProgress(percentage);
        }
      };

      // Cloudinary returns the uploaded image information.
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result.secure_url);
          } catch {
            reject(new Error("Invalid Cloudinary response."));
          }
        } else {
          reject(new Error("Image upload failed. Please try again."));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error. Check your internet connection."));
      };

      xhr.send(uploadData);
    });
  };

  // Handle property form submission.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setProgress(0);
    setUploadStatus("");
    setUploading(true);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      // Retrieve selected image files.
      const imageFiles = formData
        .getAll("images")
        .filter((file) => file instanceof File && file.size > 0);

      // Validate the number of images.
      if (imageFiles.length === 0 || imageFiles.length > 4) {
        throw new Error("Please select between 1 and 4 images.");
      }

      // Allowed image formats.
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      // Validate image formats and original file sizes.
      for (const file of imageFiles) {
        if (!allowedTypes.includes(file.type)) {
          throw new Error("Only JPEG, PNG and WebP images are allowed.");
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds the maximum 10 MB limit.`);
        }
      }

      // Request a secure upload signature from our Next.js server.
      const credentials = await generateCloudinarySignature();

      const imageUrls = [];

      // Process and upload each image.
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];

        setUploadStatus(
          `Compressing image ${i + 1} of ${imageFiles.length}...`,
        );

        // Compress the image inside the browser before uploading.
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
        });

        setUploadStatus(`Uploading image ${i + 1} of ${imageFiles.length}...`);

        // Upload directly to Cloudinary.
        const imageUrl = await uploadToCloudinary(
          compressedFile,
          credentials,
          (currentProgress) => {
            // Calculate overall progress across all selected images.
            const overallProgress = Math.round(
              ((i + currentProgress / 100) / imageFiles.length) * 100,
            );

            setProgress(overallProgress);
          },
        );

        imageUrls.push(imageUrl);

        setProgress(Math.round(((i + 1) / imageFiles.length) * 100));
      }

      // Remove original image files from the submitted form.
      formData.delete("images");

      // Replace image files with their Cloudinary URLs.
      imageUrls.forEach((url) => {
        formData.append("images", url);
      });

      setUploadStatus("Saving property details...");

      // Submit property details and uploaded image URLs to MongoDB.
      await addProperty(formData);
    } catch (err) {
      console.error("PROPERTY SUBMISSION ERROR:", err);

      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-3xl text-center font-semibold mb-6">Add Property</h2>

      {/* Property Type */}
      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
          Property Type
        </label>

        <select
          id="type"
          name="type"
          className="border rounded w-full py-2 px-3"
          required
        >
          <option value="Apartment">Apartment</option>
          <option value="Condo">Condo</option>
          <option value="House">House</option>
          <option value="Cabin Or Cottage">Cabin or Cottage</option>
          <option value="Room">Room</option>
          <option value="Studio">Studio</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Listing Name */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Listing Name
        </label>

        <input
          type="text"
          id="name"
          name="name"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="eg. Beautiful Apartment In Miami"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          className="border rounded w-full py-2 px-3"
          rows="4"
          placeholder="Add an optional description of your property"
        />
      </div>

      {/* Location */}
      <div className="mb-4 bg-blue-50 p-4">
        <label className="block text-gray-700 font-bold mb-2">Location</label>

        <input
          type="text"
          id="street"
          name="location.street"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Street"
        />

        <input
          type="text"
          id="city"
          name="location.city"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="City"
          required
        />

        <input
          type="text"
          id="state"
          name="location.state"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="State"
          required
        />

        <input
          type="text"
          id="zipcode"
          name="location.zipcode"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Zipcode"
        />
      </div>

      {/* Property Specifications */}
      <div className="mb-4 flex flex-wrap">
        <div className="w-full sm:w-1/3 pr-2">
          <label htmlFor="beds" className="block text-gray-700 font-bold mb-2">
            Beds
          </label>

          <input
            type="number"
            id="beds"
            name="beds"
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        <div className="w-full sm:w-1/3 px-2">
          <label htmlFor="baths" className="block text-gray-700 font-bold mb-2">
            Baths
          </label>

          <input
            type="number"
            id="baths"
            name="baths"
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        <div className="w-full sm:w-1/3 pl-2">
          <label
            htmlFor="square_feet"
            className="block text-gray-700 font-bold mb-2"
          >
            Square Feet
          </label>

          <input
            type="number"
            id="square_feet"
            name="square_feet"
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Amenities</label>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            ["amenity_wifi", "Wifi"],
            ["amenity_kitchen", "Full Kitchen"],
            ["amenity_washer_dryer", "Washer & Dryer"],
            ["amenity_free_parking", "Free Parking"],
            ["amenity_pool", "Swimming Pool"],
            ["amenity_hot_tub", "Hot Tub"],
            ["amenity_24_7_security", "24/7 Security"],
            ["amenity_wheelchair_accessible", "Wheelchair Accessible"],
            ["amenity_elevator_access", "Elevator Access"],
            ["amenity_dishwasher", "Dishwasher"],
            ["amenity_gym_fitness_center", "Gym/Fitness Center"],
            ["amenity_air_conditioning", "Air Conditioning"],
            ["amenity_balcony_patio", "Balcony/Patio"],
            ["amenity_smart_tv", "Smart TV"],
            ["amenity_coffee_maker", "Coffee Maker"],
          ].map(([id, value]) => (
            <div key={id}>
              <input
                type="checkbox"
                id={id}
                name="amenities"
                value={value}
                className="mr-2"
              />

              <label htmlFor={id}>{value}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Rental Rates */}
      <div className="mb-4 bg-blue-50 p-4">
        <label className="block text-gray-700 font-bold mb-2">
          Rates (Leave blank if not applicable)
        </label>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex items-center">
            <label htmlFor="weekly_rate" className="mr-2">
              Weekly
            </label>

            <input
              type="number"
              id="weekly_rate"
              name="rates.weekly"
              className="border rounded w-full py-2 px-3"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="monthly_rate" className="mr-2">
              Monthly
            </label>

            <input
              type="number"
              id="monthly_rate"
              name="rates.monthly"
              className="border rounded w-full py-2 px-3"
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="nightly_rate" className="mr-2">
              Nightly
            </label>

            <input
              type="number"
              id="nightly_rate"
              name="rates.nightly"
              className="border rounded w-full py-2 px-3"
            />
          </div>
        </div>
      </div>

      {/* Seller Information */}
      <div className="mb-4">
        <label
          htmlFor="seller_name"
          className="block text-gray-700 font-bold mb-2"
        >
          Seller Name
        </label>

        <input
          type="text"
          id="seller_name"
          name="seller_info.name"
          className="border rounded w-full py-2 px-3"
          placeholder="Name"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="seller_email"
          className="block text-gray-700 font-bold mb-2"
        >
          Seller Email
        </label>

        <input
          type="email"
          id="seller_email"
          name="seller_info.email"
          className="border rounded w-full py-2 px-3"
          placeholder="Email address"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="seller_phone"
          className="block text-gray-700 font-bold mb-2"
        >
          Seller Phone
        </label>

        <input
          type="tel"
          id="seller_phone"
          name="seller_info.phone"
          className="border rounded w-full py-2 px-3"
          placeholder="Phone"
        />
      </div>

      {/* Property Images */}
      <div className="mb-4">
        <label htmlFor="images" className="block text-gray-700 font-bold mb-2">
          Images (Select up to 4 images)
        </label>

        <input
          type="file"
          id="images"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          disabled={uploading}
          className="border rounded w-full py-2 px-3"
        />

        <p className="text-sm text-gray-500 mt-1">
          Maximum 4 images. JPEG, PNG or WebP. Maximum 10 MB each.
        </p>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            {uploadStatus} {progress}%
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Submit Button */}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={uploading}
        >
          {uploading ? "Uploading Property..." : "Add Property"}
        </button>
      </div>
    </form>
  );
};

export default PropertyAddForm;
