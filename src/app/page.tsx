"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";
import { supabase } from "@/lib/supabase";
import PropertyCard from "@/components/PropertyCard";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<"rent" | "sell">("rent");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [squareFeet, setSquareFeet] = useState({ min: 0, max: 5000 });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push("/auth/login");
        return;
      }
      setUserId(data.user.id);

      // Fetch user role from the database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (userError) console.error("Error fetching user role:", userError);
      else setUserRole(userData.role);
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchProperties = async () => {
      let query = supabase.from("properties").select("*").eq("status", "approved");

      if (userRole === "buyer") {
        query = query.eq("type", filter);
      } else if (userRole === "seller" && userId) {
        query = query.eq("owner_id", userId);
      }

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      if (location) {
        query = query.ilike("location", `%${location}%`);
      }

      query = query.gte("price", priceRange.min).lte("price", priceRange.max);
      query = query.gte("square_feet", squareFeet.min).lte("square_feet", squareFeet.max);

      if (bedrooms !== null) {
        query = query.eq("bedrooms", bedrooms);
      }
      if (bathrooms !== null) {
        query = query.eq("bathrooms", bathrooms);
      }

      const { data, error } = await query;
      if (error) console.error("Error fetching properties:", error);
      if (data) setProperties(data);
    };

    fetchProperties();
  }, [userRole, userId, filter, searchQuery, priceRange, location, bedrooms, bathrooms, squareFeet]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Available Properties</h1>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Price"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              className="border p-2 w-full rounded-md"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min Sq. Ft."
              value={squareFeet.min}
              onChange={(e) => setSquareFeet({ ...squareFeet, min: Number(e.target.value) })}
              className="border p-2 w-full rounded-md"
            />
            <input
              type="number"
              placeholder="Max Sq. Ft."
              value={squareFeet.max}
              onChange={(e) => setSquareFeet({ ...squareFeet, max: Number(e.target.value) })}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <select
            value={bedrooms ?? ""}
            onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : null)}
            className="border p-2 w-full rounded-md"
          >
            <option value="">Bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
          <select
            value={bathrooms ?? ""}
            onChange={(e) => setBathrooms(e.target.value ? Number(e.target.value) : null)}
            className="border p-2 w-full rounded-md"
          >
            <option value="">Bathrooms</option>
            <option value="1">1 Bathroom</option>
            <option value="2">2 Bathrooms</option>
            <option value="3">3 Bathrooms</option>
            <option value="4">4+ Bathrooms</option>
          </select>
        </div>
      </div>

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

      {/* Properties Grid */}
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
