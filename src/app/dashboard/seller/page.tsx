"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RouteModule } from "next/dist/server/route-modules/route-module";
import { Role } from "@/types/property";

export default function SellerDashboard() {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [approvedProperties, setApprovedProperties] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        fetchProperties(data.user.id);
      }
    };

    const fetchProperties = async (sellerId: string) => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", sellerId);

      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setPendingProperties(data.filter((p) => p.status === "pending"));
        setApprovedProperties(data.filter((p) => p.status === "approved"));
      }
    };

    fetchUser();
  }, []);

  // ✅ Function to approve a property
  const approveProperty = async (id: string) => {
    const { error } = await supabase
      .from("properties")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Error approving property:", error);
      alert("Failed to approve property.");
    } else {
      // Move property from pending to approved
      setPendingProperties((prev) => prev.filter((p) => p.id !== id));
      setApprovedProperties((prev) => [...prev, pendingProperties.find((p) => p.id === id)]);
    }
  };

  return (
    <ProtectedRoute role= {Role.Seller}>

    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Seller Dashboard</h1>

      {/* Section: Pending Properties */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Pending Properties (Awaiting Approval)</h2>
        {pendingProperties.length > 0 ? (
          pendingProperties.map((property) => (
            <div key={property.id} className="p-4 border-b">
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p className="text-gray-600">{property.description}</p>
              <p className="text-blue-600 font-bold">${property.price.toLocaleString()}</p>
              <button
                onClick={() => approveProperty(property.id)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No pending properties.</p>
        )}
      </div>

      {/* Section: Approved Properties */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Approved Properties</h2>
        {approvedProperties.length > 0 ? (
          approvedProperties.map((property) => (
            <div key={property.id} className="p-4 border-b">
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p className="text-gray-600">{property.description}</p>
              <p className="text-blue-600 font-bold">${property.price.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No approved properties yet.</p>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
