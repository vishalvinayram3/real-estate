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
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      {property.image_url && (
        <Image src={"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvcGVydHl8ZW58MHx8MHx8fDA%3D"} width={800} height={500} alt={property.title} className="w-full h-80 object-cover rounded-lg mb-4" />
      )}
      <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
      <p className="text-gray-600 text-lg mt-2">{property.description}</p>
      <p className="text-blue-600 font-bold text-xl mt-4">${property.price.toLocaleString()}</p>
      <p className="text-sm text-gray-500 mt-1">{property.type.toUpperCase()}</p>
    </div>
  );
}
