"use client";

import Image from "next/image";
import { Property } from "../types/property";
import Link from "next/link";

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  // ✅ Fix double quotes by parsing the string to JSON
  let images: string[] = [];

  try {
    images = typeof property.images === "string" 
      ? JSON.parse(property.images) 
      : property.images;
  } catch (error) {
    console.error("Error parsing image URLs:", error);
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
      {/* ✅ Display Only First Image */}
      {images && images.length > 0 ? (
        <Image
          src={images[0]}
          width={400}
          height={250}
          alt={property.title || "Property image"}
          className="w-full h-56 object-cover"
        />
      ) : (
        // ✅ Fallback image if no images available
        <Image
          src="/property-placeholder.jpg"
          width={400}
          height={250}
          alt="No Image"
          className="w-full h-56 object-cover"
        />
      )}

      {/* ✅ Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <p className="text-gray-500 text-sm">{property.address || "No address available"}</p>
        <p className="text-blue-600 font-bold mt-2 text-lg">
          ${property.price?.toLocaleString() || "N/A"}
        </p>

        <div className="text-sm text-gray-600 mt-2 flex justify-between">
          <span>🛏 {property.bedrooms || 0} Beds</span>
          <span>🛁 {property.bathrooms || 0} Baths</span>
          <span>📏 {property.square_feet || 0} sqft</span>
        </div>

        {/* ✅ Link to Property Details */}
        <Link href={`/properties/${property.id}`}>
          <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
