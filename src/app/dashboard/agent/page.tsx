"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AgentDashboard() {
  const [properties, setProperties] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<"buy" | "sell" | "rent">("sell");
  const [squareFeet, setSquareFeet] = useState<number>(0);
  const [address, setAddress] = useState("");
  const [nearby, setNearby] = useState("");
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
      else router.push("/auth/login");
    };
    fetchUser();
  }, [router]);

  const handleImageUpload = async () => {
    if (!image) return null;

    const fileName = `${Date.now()}-${image.name}`;
    const filePath = `property-images/${fileName}`;

    const { data, error } = await supabase.storage.from("property-images").upload(filePath, image);

    if (error) {
      console.error("Image Upload Error:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from("property-images").getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const addProperty = async () => {
    if (!userId) return;

    const imageUrl = await handleImageUpload();

    if (!imageUrl) {
      alert("Image upload failed. Please try again.");
      return;
    }

    const { data, error } = await supabase.from("properties").insert([
      {
        title,
        description,
        price,
        type,
        owner_id: userId,
        image_url: imageUrl,
        square_feet: squareFeet,
        address,
        nearby,
        bedrooms,
        bathrooms,
        latitude,
        longitude,
      },
    ]);

    if (error) console.error("Property insert error:", error);
    else setProperties([...properties, data![0]]);
  };

  return (
    <ProtectedRoute>

    <div className="p-6 mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Properties</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
        <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full mb-2" />
        <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mb-2"></textarea>
        <input type="number" placeholder="Price" onChange={(e) => setPrice(Number(e.target.value))} className="border p-2 w-full mb-2" />
        <input type="number" placeholder="Square Feet" onChange={(e) => setSquareFeet(Number(e.target.value))} className="border p-2 w-full mb-2" />
        <textarea placeholder="Address" onChange={(e) => setAddress(e.target.value)} className="border p-2 w-full mb-2"></textarea>
        <textarea placeholder="Nearby Landmarks" onChange={(e) => setNearby(e.target.value)} className="border p-2 w-full mb-2"></textarea>
        <input type="number" placeholder="Bedrooms" onChange={(e) => setBedrooms(Number(e.target.value))} className="border p-2 w-full mb-2" />
        <input type="number" placeholder="Bathrooms" onChange={(e) => setBathrooms(Number(e.target.value))} className="border p-2 w-full mb-2" />
        <input type="number" placeholder="Latitude" onChange={(e) => setLatitude(Number(e.target.value))} className="border p-2 w-full mb-2" />
        <input type="number" placeholder="Longitude" onChange={(e) => setLongitude(Number(e.target.value))} className="border p-2 w-full mb-2" />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="border p-2 w-full mb-2" />
        <button onClick={addProperty} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Property</button>
      </div>
    </div>
    </ProtectedRoute>
  );
}
