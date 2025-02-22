"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import PropertyCard from "../../components/PropertyCard";
import { Property } from "../../types/property";
import { useRouter } from "next/navigation";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState("rent");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/auth/login"); // Redirect if not logged in
      } else {
        setUserId(data.user.id);
        fetchUserRole(data.user.id);
      }
    };

    const fetchUserRole = async (id: string) => {
      const { data, error } = await supabase.from("users").select("role").eq("id", id).single();
      if (error) {
        console.error("Error fetching user role:", error);
      } else {
        setUserRole(data.role);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!userRole) return;

    const fetchProperties = async () => {
      let query = supabase.from("properties").select("*").eq("status", "approved");
    
      if (userRole === "buyer") {
        query = query.in("type", ["rent", "sell"]);
      } else if (userRole === "seller" && userId) {
        query = query.eq("owner_id", userId);
      }
    
      const { data, error } = await query;
      if (error) console.error("Error fetching properties:", error);
      if (data) setProperties(data);
    };
    
    fetchProperties();
  }, [userRole, userId]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Available Properties</h1>

      {userRole === "buyer" && (
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setFilter("rent")} className={`px-6 py-2 rounded-md font-semibold transition ${filter === "rent" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
            Rent
          </button>
          <button onClick={() => setFilter("sell")} className={`px-6 py-2 rounded-md font-semibold transition ${filter === "sell" ? "bg-red-600 text-white" : "bg-gray-200"}`}>
            Buy
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => <PropertyCard key={property.id} property={property} />)
        ) : (
          <p className="text-gray-600 text-center col-span-full">No properties available.</p>
        )}
      </div>
    </div>
  );
}
