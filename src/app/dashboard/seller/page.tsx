"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Property, Role } from "@/types/property";


export default function SellerDashboard() {
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [approvedProperties, setApprovedProperties] = useState<Property[]>([]);

  const [agents, setAgents] = useState<{ id: string; agent_email: string }[]>([]);
  const [agentEmail, setAgentEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "agents">("properties");

  useEffect(() => {
    const fetchUser = async () => {
      const { data} = await supabase.auth.getUser();
  
      if (!data?.user) {
        console.error("User not authenticated.");
        return;
      }
  
      // ✅ Fetch seller's ID from `users` table instead of `auth.users`
      const { data: sellerData, error: sellerError } = await supabase
        .from("users")
        .select("id")
        .eq("email", data.user.email)
        .single();
  
      if (sellerError || !sellerData) {
        console.error("Error fetching seller ID:", sellerError || "No admin found.");
        return;
      }
  
      console.log("Fetched Seller ID:", sellerData.id); // Debugging
      setUserId(sellerData.id);
      fetchAgents(sellerData.id);
      fetchProperties(sellerData.id) // ✅ Store the correct seller ID
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
      }
      if(data == null) {
      return;
    }
      else {
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
      setApprovedProperties((prev) => {
        const foundProperty = pendingProperties.find((p) => p.id === id);
        return foundProperty ? [...prev, foundProperty] : prev; // ✅ Ensures no undefined values
      });
      
    }
  };

  // ✅ Function to add a new agent
  
  const addAgent = async () => {
    if (!userId || !agentEmail) return;
  
    // Generate a random password for the agent
    const password = agentEmail;
  
    // Step 1: Create Agent in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: agentEmail,
      password: password,
    });
  
    if (authError) {
      console.error("Error creating agent account:", authError);
      alert("Failed to create agent account. Email may already be in use.");
      return;
    }
  
    const agentId = authData.user?.id;
    if (!agentId) {
      alert("Unexpected error: User ID not generated.");
      return;
    }
  
    // Step 2: Insert Agent into `users` Table
    const { error: userError } = await supabase.from("users").insert([
      { id: agentId, email: agentEmail, role: "agent" },
    ]);
  
    if (userError) {
      console.error("Error inserting agent into users table:", userError);
      alert("Failed to register agent in the users database.");
      return;
    }
  
    // Step 3: Link Agent to Seller in `agents` Table
    const { error: agentError } = await supabase.from("agents").insert([
      { seller_id: userId, agent_email: agentEmail, id: agentId },
    ]);
  
    if (agentError) {
      console.error("Error linking agent to seller:", agentError);
      alert("Failed to link agent to seller.");
      return;
    }
  
    // Update UI
    setAgents((prev) => [...prev, { id: agentId, agent_email: agentEmail }]);
    setAgentEmail("");
  
    alert(`Agent added successfully! Temporary password: ${password}`);
  };
  
  // ✅ Function to delete an agent
  const deleteAgent = async (agentId: string) => {
    const { error } = await supabase.from("agents").delete().eq("id", agentId);

    if (error) {
      console.error("Error deleting agent:", error);
      alert("Failed to delete agent.");
    } else {
      setAgents((prev) => prev.filter((agent) => agent.id !== agentId));
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
            Seller
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
            <h2 className="text-xl font-semibold mb-4">Manage Sellers</h2>

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
                Add Seller
              </button>
            </div>

            {/* Agents List */}
            <h2 className="text-xl font-semibold mb-4">Your Seller</h2>
            {agents.length > 0 ? (
              <ul className="bg-white p-4 shadow-md rounded-lg">
                {agents.map((agent) => (
                  <li key={agent.id} className="border-b py-2 flex justify-between">
                    {agent.agent_email}
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No seller added yet.</p>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
