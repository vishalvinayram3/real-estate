"use client"; // ✅ Ensures it only runs on the client

import Image from "next/image";
import { Property } from "../types/property";

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
      <Image
        src={'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D'}
        width={400}
        height={250}
        alt={property.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <p className="text-gray-600 text-sm">{property.description}</p>
        <p className="text-blue-600 font-bold mt-2 text-lg">{property.price} USD</p>
        <p className="text-sm text-gray-500">{property.type.toUpperCase()}</p>
        <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">View Details</button>
      </div>
    </div>
  );
}
