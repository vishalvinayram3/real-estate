"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import PropertyCard from "../../components/PropertyCard";
import { Property } from "../../types/property";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState("buy");

  useEffect(() => {
    const fetchProperties = async () => {
      let { data, error } = await supabase.from("properties").select("*").eq("type", filter);
      if (error) console.error(error);
      if(data==null) return;
      else setProperties(data);
    };
    fetchProperties();
  }, [filter]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Properties</h1>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setFilter("buy")} className={`px-4 py-2 rounded ${filter === "buy" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Buy</button>
        <button onClick={() => setFilter("rent")} className={`px-4 py-2 rounded ${filter === "rent" ? "bg-green-600 text-white" : "bg-gray-200"}`}>Rent</button>
        <button onClick={() => setFilter("sell")} className={`px-4 py-2 rounded ${filter === "sell" ? "bg-red-600 text-white" : "bg-gray-200"}`}>Sell</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => <PropertyCard key={property.id} property={property} />)
        ) : (
          <p className="text-gray-600">No properties available.</p>
        )}
      </div>
    </div>
  );
}
