"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export enum Role {
  Buyer = "buyer",
  Agent = "agent",
  Seller = "seller",
}

export default function ProtectedRoute({ role, children }: { role: Role; children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      const { data, error } = await supabase.auth.getUser();
      if(error) return;
      if (!data?.user) {
        console.log("No authenticated user found. Redirecting to login.");
        router.push("/auth/login");
        return;
      }

      const { data: userRoleData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (roleError || !userRoleData) {
        console.error("Error fetching user role:", roleError);
        router.push("/auth/login");
        return;
      }

      const fetchedRole = userRoleData.role as Role;
      console.log("Fetched Role:", fetchedRole);

      // Ensure only one navigation happens
      if (fetchedRole !== role) {
        if (fetchedRole === Role.Agent) router.push("/dashboard/agent");
        else if (fetchedRole === Role.Buyer) router.push("/dashboard/buyer");
        else if (fetchedRole === Role.Seller) router.push("/dashboard/seller");
      } else {
        setUserRole(fetchedRole);
      }

      setLoading(false);
    };

    checkUserRole();
  }, [role, router]);

  if (loading) return <div className="text-center p-10">Checking authentication...</div>;
  if (!userRole) return null; // Prevents rendering empty elements

  return <>{children}</>;
}
