"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [property, setProperty] = useState<any>(null);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid property ID.");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*, added_by")
        .eq("id", String(id))
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        setError("Property not found.");
      } else {
        setProperty(data);
        setOwnerEmail(data.owner?.email || null);
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
      {/* Image Carousel */}
      {property.images && property.images.length > 0 && (
        <div className="relative w-full h-96 rounded-lg overflow-hidden">
          <Carousel>
            <CarouselPrevious />
            <CarouselContent>
              {property.images.map((image: string, index: number) => (
                <CarouselItem key={index}>
                  <img src={image} alt={`Property image ${index + 1}`} className="w-full h-96 object-cover rounded-lg" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {/* Property Details */}
      <h1 className="text-4xl font-bold text-gray-900 mt-6">{property.title || "No title available"}</h1>
      <p className="text-gray-500 text-lg mt-2">{property.description || "No description available"}</p>

      <div className="flex items-center justify-between mt-4">
        <p className="text-blue-600 font-bold text-3xl">${property.price?.toLocaleString() || "N/A"}</p>
        <p className="text-sm text-gray-500 px-4 py-1 bg-gray-100 border border-gray-300 rounded-full uppercase">
          {property.type || "N/A"}
        </p>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Property Details</h3>
        <ul className="grid grid-cols-2 gap-3 text-gray-700">
          <li>🛏 <strong>{property.bedrooms || "N/A"}</strong> Bedrooms</li>
          <li>🛁 <strong>{property.bathrooms || "N/A"}</strong> Bathrooms</li>
          <li>📏 <strong>{property.square_feet || "N/A"}</strong> sqft</li>
          <li>📍 <strong>{property.address || "No address provided"}</strong></li>
          <li>🏙 <strong>Nearby:</strong> {property.nearby || "Not specified"}</li>
        </ul>
      </div>

      {property.latitude && property.longitude && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Location</h3>
          <a
            href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            View on Google Maps
          </a>
        </div>
      )}

      {/* Contact Owner Button */}
      {ownerEmail && (
        <div className="mt-6 p-4 bg-gray-100 border rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Interested in this property?</h3>
          <p className="text-gray-700 mb-3">Contact the owner for more details.</p>
          <a
            href={`mailto:${ownerEmail}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Contact Owner
          </a>
        </div>
      )}
    </div>
  );
}
