"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function SellerDashboard() {
  const [properties, setProperties] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState<"buy" | "sell" | "rent">("sell");
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

  useEffect(() => {
    const fetchProperties = async () => {
      if (!userId) return;
      let { data, error } = await supabase.from("properties").select("*").eq("owner_id", userId);
      if (error) console.error(error);
      if(data == null) return;
      else setProperties(data);
    };
    fetchProperties();
  }, [userId]);

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
    if (!userId) return;
    const imageUrl = await handleImageUpload();
    const { data, error } = await supabase.from("properties").insert([
      { title, description, price, type, owner_id: userId, image_url: imageUrl },
    ]);

    if (error) console.error(error);
    else setProperties([...properties, data![0]]);
  };

  return (
    <div className="p-6 mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Properties</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
        <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full mb-2" />
        <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full mb-2"></textarea>
        <input type="number" placeholder="Price" onChange={(e) => setPrice(Number(e.target.value))} className="border p-2 w-full mb-2" />
        <select onChange={(e) => setType(e.target.value as "buy" | "sell" | "rent")} className="border p-2 w-full mb-2">
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
          <option value="buy">Buy</option>
        </select>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="border p-2 w-full mb-2" />
        <button onClick={addProperty} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Property</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p>{property.description}</p>
              <p className="text-blue-600">{property.price} USD</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No properties added yet.</p>
        )}
      </div>
    </div>
  );
}
