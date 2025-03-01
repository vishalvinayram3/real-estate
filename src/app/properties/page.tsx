"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Property } from "../../types/property";
import { useRouter } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<"rent" | "sell">("rent"); // Default filter
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();



  useEffect(() => {
    const fetchProperties = async () => {
      let query = supabase.from("properties").select("*").eq("status", "approved");

      if (userRole === "buyer") {
        query = query.eq("type", filter); // Update dynamically
      } else if (userRole === "seller" && userId) {
        query = query.eq("owner_id", userId);
      }

      const { data, error } = await query;
      if (error) console.error("Error fetching properties:", error);
      if (data) setProperties(data);
    };

    fetchProperties();
  }, [userRole, userId, filter]); // ✅ Added `filter` as a dependency

  return (
    <>
    <Navbar />
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Top Properties</h1>

      {/* Filter Toggle */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter("rent")}
          className={`px-6 py-2 rounded-md font-semibold transition ${filter === "rent" ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          Rent
        </button>
        <button
          onClick={() => setFilter("sell")}
          className={`px-6 py-2 rounded-md font-semibold transition ${filter === "sell" ? "bg-red-600 text-white" : "bg-gray-200"}`}
        >
          Buy
        </button>
      </div>
      {/* Sorting Options */} 
      <div style={{margin:'10px 10px 10px 10px'}}>
        <button
          className={`px-6 py-2 rounded-md font-semibold transition ${filter === "sell" ? "bg-red-600 text-white" : "bg-gray-200"}`} 
        onClick={()=>window.location.href='/dashboard/buyer'}>View all Property</button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => <PropertyCard key={property.id} property={property} />)
        ) : (
          <p className="text-gray-600 text-center col-span-full">No properties available.</p>
        )}
      </div>
    </div>
    </>
  );
}
