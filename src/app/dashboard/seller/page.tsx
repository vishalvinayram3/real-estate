"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export default function SellerDashboard() {
  const [agents, setAgents] = useState([]);
  const [agentEmail, setAgentEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        fetchAgents(data.user.id);
      }
    };

    const fetchAgents = async (sellerId: string) => {
      const { data, error } = await supabase.from("agents").select("*").eq("seller_id", sellerId);
      if (error) console.error("Error fetching agents:", error);
      else setAgents(data);
    };

    fetchUser();
  }, []);

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Agents</h1>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add a New Agent</h2>
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

      <h2 className="text-xl font-semibold mt-6 mb-4">Your Agents</h2>
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
  );
}
