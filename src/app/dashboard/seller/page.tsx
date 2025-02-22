"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Role } from "@/types/property";

export default function SellerDashboard() {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [approvedProperties, setApprovedProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  const [agentEmail, setAgentEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "agents">("properties");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        fetchProperties(data.user.id);
        fetchAgents(data.user.id);
      }
    };

    const fetchProperties = async (sellerId: string) => {
      const { data, error } = await supabase.from("properties").select("*").eq("owner_id", sellerId);
      if (error) {
        console.error("Error fetching properties:", error);
      } else {
        setPendingProperties(data.filter((p) => p.status === "pending"));
        setApprovedProperties(data.filter((p) => p.status === "approved"));
      }
    };

    const fetchAgents = async (sellerId: string) => {
      const { data, error } = await supabase.from("agents").select("*").eq("seller_id", sellerId);
      if (error) {
        console.error("Error fetching agents:", error);
      } else {
        setAgents(data);
      }
    };

    fetchUser();
  }, []);

  // ✅ Function to approve a property
  const approveProperty = async (id: string) => {
    const { error } = await supabase.from("properties").update({ status: "approved" }).eq("id", id);
    if (error) {
      console.error("Error approving property:", error);
      alert("Failed to approve property.");
    } else {
      setPendingProperties((prev) => prev.filter((p) => p.id !== id));
      setApprovedProperties((prev) => [...prev, pendingProperties.find((p) => p.id === id)]);
    }
  };

  // ✅ Function to add a new agent
  const addAgent = async () => {
    if (!userId || !agentEmail) return;

    const { data, error } = await supabase.from("agents").insert([{ seller_id: userId, agent_email: agentEmail }]);

    if (error) {
      console.error("Error adding agent:", error);
      alert("Failed to add agent. Ensure email is unique.");
    } else {
      setAgents([...agents, data![0]]);
      setAgentEmail("");
    }
  };

  return (
    <ProtectedRoute role={Role.Seller}>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Seller Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`p-3 ${activeTab === "properties" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("properties")}
          >
            Properties
          </button>
          <button
            className={`p-3 ml-6 ${activeTab === "agents" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("agents")}
          >
            Agents
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <>
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
          </>
        )}

        {/* Agents Tab */}
        {activeTab === "agents" && (
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Manage Agents</h2>

            {/* Add Agent Section */}
            <div className="mb-6">
              <input
                type="email"
                placeholder="Agent Email"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                className="border p-2 w-full mb-2"
              />
              <button onClick={addAgent} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Add Agent
              </button>
            </div>

            {/* Agents List */}
            <h2 className="text-xl font-semibold mb-4">Your Agents</h2>
            {agents.length > 0 ? (
              <ul className="bg-white p-4 shadow-md rounded-lg">
                {agents.map((agent) => (
                  <li key={agent.id} className="border-b py-2">{agent.agent_email}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No agents added yet.</p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
