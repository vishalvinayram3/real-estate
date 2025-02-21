"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push("/dashboard/buyer"); // Redirect logged-in users
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) return <div className="text-center p-10">Checking authentication...</div>;

  return <>{children}</>;
}
