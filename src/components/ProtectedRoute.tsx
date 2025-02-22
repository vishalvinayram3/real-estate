"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { Role } from "@/types/property";
export default function ProtectedRoute({ role, children }: { role: Role; children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/auth/login");
        return;
      }

      const { data: userRoleData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (error || !userRoleData) {
        console.error("Error fetching user role:", error);
        router.push("/auth/login");
        return;
      }

      const fetchedRole = userRoleData.role as Role;
      console.log("Fetched Role:", fetchedRole);

      if (fetchedRole === Role.Agent) {
        router.push("/dashboard/agent");
      } else if (fetchedRole === Role.Buyer) {
        router.push("/dashboard/buyer");
      } else if (fetchedRole === Role.Seller) {
        setUserRole(Role.Seller);
      }
    };

    checkUserRole();
  }, [role, router]);

  if (!userRole) return <div className="text-center p-10">Checking authentication...</div>;

  return <>{children}</>;
}
