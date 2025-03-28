"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import PropertyCard from "../../../components/PropertyCard";
import { Property } from "../../../types/property";

export default function BuyerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterType, setFilterType] = useState<"sell" | "rent" | "all">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minSize, setMinSize] = useState<number | null>(null);
  const [maxSize, setMaxSize] = useState<number | null>(null);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);

      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "approved");

      // ✅ Only apply filters if the user has selected them
      if (filterType !== "all") {
        query = query.eq("type", filterType);
      }

      if (filterCategory !== "all") {
        query = query.eq("category", filterCategory);
      }

      if (minPrice !== null) {
        query = query.gte("price", minPrice);
      }

      if (maxPrice !== null) {
        query = query.lte("price", maxPrice);
      }

      if (minSize !== null) {
        query = query.gte("square_feet", minSize);
      }

      if (maxSize !== null) {
        query = query.lte("square_feet", maxSize);
      }

      if (bedrooms !== null) {
        query = query.eq("bedrooms", bedrooms);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setProperties(data || []);
      }

      setLoading(false);
    };

    fetchProperties();
  }, [filterType, filterCategory, minPrice, maxPrice, minSize, maxSize, bedrooms]);

  // ✅ Handle Resetting All Filters
  const resetFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setMinPrice(null);
    setMaxPrice(null);
    setMinSize(null);
    setMaxSize(null);
    setBedrooms(null);
  };

  if (loading) {
    return <div className="text-center p-10">Loading properties...</div>;
  }

  return (
    <div className="p-6 mt-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Available Properties</h1>

      {/* ✅ Filter Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {/* ✅ Filter by Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "sell" | "rent" | "all")}
          className="border p-2 rounded-md w-full"
        >
          <option value="all">All Types</option>
          <option value="sell">Buy</option>
          <option value="rent">Rent</option>
        </select>

        {/* ✅ Filter by Category */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="all">All Categories</option>
          <option value="flat">Flat</option>
          <option value="independent house">Independent House</option>
          <option value="land">Land</option>
        </select>

        {/* ✅ Filter by Price Range */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice ?? ""}
          onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
          className="border p-2 rounded-md w-full"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice ?? ""}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
          className="border p-2 rounded-md w-full"
        />

        {/* ✅ Filter by Size Range */}
        <input
          type="number"
          placeholder="Min Size (sqft)"
          value={minSize ?? ""}
          onChange={(e) => setMinSize(e.target.value ? Number(e.target.value) : null)}
          className="border p-2 rounded-md w-full"
        />
        <input
          type="number"
          placeholder="Max Size (sqft)"
          value={maxSize ?? ""}
          onChange={(e) => setMaxSize(e.target.value ? Number(e.target.value) : null)}
          className="border p-2 rounded-md w-full"
        />

        {/* ✅ Filter by Number of Bedrooms */}
        <input
          type="number"
          placeholder="Bedrooms"
          value={bedrooms ?? ""}
          onChange={(e) => setBedrooms(e.target.value ? Number(e.target.value) : null)}
          className="border p-2 rounded-md w-full"
        />

        {/* ✅ Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* ✅ Property List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full">
            No properties available.
          </p>
        )}
      </div>
    </div>
  );
}
