"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if(data== null)
    {
      return;
    }
    if (error) {
      alert(error.message);
    } else {
      // Check if the user is an agent or seller
      const { data: agentData, error} = await supabase
        .from("agents")
        .select("*")
        .eq("agent_email", email)
        .single();
      if(error) { alert(error.message)}
      if (agentData) {
        router.push("/dashboard/agent"); // Redirect agents to their dashboard
      } else {
        router.push("/dashboard/seller"); // Redirect sellers to their dashboard
      }

    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full mb-2" required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full mb-2" required />
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700">Login</button>
        <div className="flex justify-evenly mt-5">
        <Link href={'/auth/register'}>Register </Link>
        <Link href={'/auth/reset-pin'} >Forgot Password </Link> 
        </div>
      </form>
    </div>
  );
}
