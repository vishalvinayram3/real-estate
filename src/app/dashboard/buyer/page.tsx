"use client"; // ✅ Ensures this runs only on the client

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import PropertyCard from "../../../components/PropertyCard";
import { Property, Role } from "../../../types/property";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function BuyerDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase.from("properties").select("*");
      if (error) console.error("Error fetching properties:", error);
      else setProperties(data || []);
      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading properties...</div>;
  }

  return (
    <ProtectedRoute role={Role.Buyer}>

    <div className="p-6 mt-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Properties</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => <PropertyCard key={property.id} property={property} />)
        ) : (
          <p className="text-gray-600">No properties available.</p>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
