"use client"; // ✅ Ensure Navbar is a Client Component

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import LogoutButton from "./LoginButton";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };

    fetchUser();
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  }, []);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">
        <Link href="/">NoBroker Clone</Link>
      </div>
      <div className="flex space-x-6 text-gray-700 font-medium">
        <Link href="/properties?type=buy" className="hover:text-blue-600">Buy</Link>
        <Link href="/properties?type=rent" className="hover:text-blue-600">Rent</Link>
        <Link href="/properties?type=sell" className="hover:text-blue-600">Sell</Link>
      </div>
      <div className="flex space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/dashboard/seller" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Post Property
            </Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
