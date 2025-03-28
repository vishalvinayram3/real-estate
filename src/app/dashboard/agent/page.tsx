"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Property, Role } from "../../../types/property";

export default function AgentDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<"buy" | "rent" | "sell">("sell");
  const [squareFeet, setSquareFeet] = useState<number>(0);
  const [address, setAddress] = useState("");
  const [nearby, setNearby] = useState("");
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [mapUrl, setMapUrl] = useState<string>("");
  const [images, setImages] = useState<FileList | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user) {
        console.error("User not authenticated.");
        return;
      }

      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .select("id, seller_id")
        .eq("id", data.user.id)
        .single();

      if (agentError || !agentData) {
        console.error("Error fetching agent:", agentError || "No seller found with this email.");
        return;
      }

      setAgentId(agentData.id);
      setUserId(agentData.seller_id);
      fetchProperties(agentData.id);
    };

    fetchAgent();
  }, []);

  const fetchProperties = async (id: string) => {
    const { data, error } = await supabase.from("properties").select("*").eq("added_by", id);
    if (error) console.error("Error fetching properties:", error);
    else setProperties(data);
  };

  const handleImageUpload = async () => {
    if (!images || images.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (let i = 0; i < Math.min(images.length, 3); i++) {
      const file = images[i];
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from("property-images").upload(fileName, file);

      if (error) {
        console.error("Image Upload Error:", error);
        continue;
      }

      uploadedUrls.push(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${filePath}`
      );
      console.log(uploadedUrls)
    }

    return uploadedUrls;
  };

  // ✅ Updated to store multiple image URLs
  const addProperty = async () => {
    if (!userId || !agentId) {
      alert("User not authenticated. Please refresh and try again.");
      return;
    }

    const imageUrls = await handleImageUpload();
    console.log(imageUrls)

    if (imageUrls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const { error } = await supabase.from("properties").insert([
      {
        title,
        description,
        price,
        type,
        owner_id: userId,
        added_by: agentId,
        images: imageUrls,
        square_feet: squareFeet,
        address,
        nearby,
        bedrooms,
        bathrooms,
        map_url: mapUrl, // ✅ Storing map URL directly
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Property insert error:", error);
      alert("Error adding property. Please try again.");
    } else {
      alert("Property added successfully! Pending seller approval.");
      fetchProperties(agentId);
    }
  };

  return (
    <ProtectedRoute role={Role.Agent}>
      <div className="p-6 mt-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Agent Dashboard</h1>

        {/* ✅ Add Property Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
          <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full mb-2" />
          <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mb-2"></textarea>

          {/* ✅ Type Selection (rent, sell) */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "rent" | "sell")}
            className="border p-2 w-full mb-2"
          >
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
          </select>

          <input type="number" placeholder="Price" onChange={(e) => setPrice(Number(e.target.value))} className="border p-2 w-full mb-2" />
          <input type="number" placeholder="Square Feet" onChange={(e) => setSquareFeet(Number(e.target.value))} className="border p-2 w-full mb-2" />
          <textarea placeholder="Address" onChange={(e) => setAddress(e.target.value)} className="border p-2 w-full mb-2"></textarea>
          <textarea placeholder="Nearby Landmarks" onChange={(e) => setNearby(e.target.value)} className="border p-2 w-full mb-2"></textarea>
          <input type="number" placeholder="Bedrooms" onChange={(e) => setBedrooms(Number(e.target.value))} className="border p-2 w-full mb-2" />
          <input type="number" placeholder="Bathrooms" onChange={(e) => setBathrooms(Number(e.target.value))} className="border p-2 w-full mb-2" />

          {/* ✅ Map URL */}
          <input
            type="text"
            placeholder="Google Maps URL"
            value={mapUrl}
            onChange={(e) => setMapUrl(e.target.value)}
            className="border p-2 w-full mb-2"
          />

          {/* ✅ Google Map Preview */}
          {mapUrl && (
            <iframe
              src={mapUrl}
              width="100%"
              height="200"
              className="rounded-lg border mt-2"
              loading="lazy"
              allowFullScreen
            />
          )}

          {/* ✅ Image Upload */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="border p-2 w-full mb-2"
          />

          <button onClick={addProperty} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Property
          </button>
        </div>

        {/* ✅ List of Properties */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Your Added Properties</h2>
        {properties.length > 0 ? (
          <ul className="bg-white p-4 shadow-md rounded-lg">
            {properties.map((property) => (
              <li key={property.id} className="border-b py-2">
                {property.title} - 
                <span className={property.status === "approved" ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                  {property.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No properties added yet.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
