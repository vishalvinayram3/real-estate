"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Image from "next/image";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Property ID from URL:", id); // Debugging

    if (!id) {
      setError("Invalid property ID.");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", String(id)) // Ensure `id` is treated as a string
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        setError("Property not found.");
      } else {
        console.log("Fetched Property Data:", data); // Debugging
        setProperty(data);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  if (loading) return <div className="text-center p-10">Loading property details...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!property) return <div className="text-center p-10 text-gray-600">No property details available.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      {/* Property Image */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        <Image
          src={"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D"}
          layout="fill"
          objectFit="cover"
          alt={property.title}
          className="rounded-lg"
        />
      </div>

      {/* Property Title & Description */}
      <h1 className="text-4xl font-bold text-gray-900 mt-6">{property.title}</h1>
      <p className="text-gray-600 text-lg mt-2">{property.description}</p>

      {/* Property Price & Type */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-blue-600 font-bold text-2xl">${property.price.toLocaleString()}</p>
        <p className="text-sm text-gray-500 px-4 py-1 bg-gray-200 rounded-full">
          {property.type.toUpperCase()}
        </p>
      </div>

      {/* Property Details (Bedrooms, Bathrooms, Size, Address, Nearby) */}
      <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">🏡 Property Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
          {property.bedrooms > 0 && (
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">🛏 Bedrooms</p>
              <p className="text-lg font-semibold">{property.bedrooms}</p>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">🛁 Bathrooms</p>
              <p className="text-lg font-semibold">{property.bathrooms}</p>
            </div>
          )}
          {property.square_feet > 0 && (
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">📏 Size (sq ft)</p>
              <p className="text-lg font-semibold">{property.square_feet}</p>
            </div>
          )}
        </div>
      </div>

      {/* Address & Nearby Places */}
      <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">📍 Location Details</h3>
        {property.address && (
          <p className="text-lg font-semibold text-gray-800">📌 Address: <span className="font-normal">{property.address}</span></p>
        )}
        {property.nearby && (
          <p className="text-lg font-semibold text-gray-800">🏙 Nearby: <span className="font-normal">{property.nearby}</span></p>
        )}
      </div>

      {/* Google Maps Location */}
      {property.latitude && property.longitude && (
        <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">📍 View on Google Maps</h3>
          <a
            href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-semibold"
          >
            Open Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
