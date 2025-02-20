"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Property } from "../../../types/property";

export default function SellerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<"buy" | "sell" | "rent">("sell");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase.from("properties").select("*");
      if (error) console.error(error);
      else setProperties(data);
    };
    fetchProperties();
  }, []);

  const handleImageUpload = async () => {
    if (!image) return null;

    const fileName = `${Date.now()}-${image.name}`;
    const { data, error } = await supabase.storage.from("property-images").upload(fileName, image);

    if (error) {
      console.error("Image Upload Error:", error);
      return null;
    }

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/property-images/${fileName}`;
  };

  const addProperty = async () => {
    const imageUrl = await handleImageUpload();

    const { data, error } = await supabase.from("properties").insert([
      { title, description, price, type, image_url: imageUrl },
    ]);

    if (error) console.error(error);
    else setProperties([...properties, data![0]]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Manage Your Properties</h1>
      <div className="mt-4">
        <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full mb-2" />
        <input type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mb-2" />
        <input type="number" placeholder="Price" onChange={(e) => setPrice(Number(e.target.value))} className="border p-2 w-full mb-2" />
        <select onChange={(e) => setType(e.target.value as "buy" | "sell" | "rent")} className="border p-2 w-full mb-2">
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
          <option value="buy">Buy</option>
        </select>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="border p-2 w-full mb-2" />
        <button onClick={addProperty} className="bg-blue-600 text-white px-4 py-2 rounded">Add Property</button>
      </div>
    </div>
  );
}
