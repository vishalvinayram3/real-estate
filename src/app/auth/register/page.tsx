"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { Role } from "../../../components/ProtectedRoute"; // Import the Role enum

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.Buyer); // Default role: Buyer
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
      return;
    }

    // Insert user role into `users` table
    const { error: userError } = await supabase.from("users").insert([
      { id: data.user?.id, email, role }
    ]);

    if (userError) {
      console.error("Error inserting user role:", userError);
      alert("Registration failed. Please try again.");
      return;
    }

    // Redirect based on role
    if (role === Role.Seller) {
      router.push("/dashboard/seller");
    } else if (role === Role.Agent) {
      router.push("/dashboard/agent");
    } else {
      router.push("/dashboard/buyer");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full mb-2" required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full mb-2" required />

        {/* Role Selection */}
        <label className="block text-sm font-medium text-gray-700">Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="border p-2 w-full mb-2">
          <option value={Role.Buyer}>Buyer</option>
          <option value={Role.Seller}>Seller</option>
          <option value={Role.Agent}>Agent</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
}
