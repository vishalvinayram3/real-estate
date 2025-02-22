"use client";

import Image from "next/image";
import { Property, Role } from "../types/property";
import Link from "next/link";
import ProtectedRoute from "./ProtectedRoute";

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
      {property.image_url && (
        <Image src={"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D"} width={400} height={250} alt={property.title} className="w-full h-56 object-cover" />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <p className="text-gray-500 text-sm">{property.address}</p>
        <p className="text-blue-600 font-bold mt-2 text-lg">${property.price.toLocaleString()}</p>
        <div className="text-sm text-gray-600 mt-2 flex justify-between">
          <span>🛏 {property.bedrooms} Beds</span>
          <span>🛁 {property.bathrooms} Baths</span>
          <span>📏 {property.square_feet} sqft</span>
        </div>
        <Link href={`/properties/${property.id}`}>
          <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">View Details</button>
        </Link>
      </div>
    </div>
  );
}
