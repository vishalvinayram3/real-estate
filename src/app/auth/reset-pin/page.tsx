"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    // ✅ Try to sign in first to reset the password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: newPassword,
    });

    if (error) {
      setError("Invalid credentials or user not found.");
      setLoading(false);
      return;
    }

    // ✅ Directly update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3 rounded-md"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        className="border p-2 w-full mb-3 rounded-md"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        onClick={handleResetPassword}
        className={`bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700 ${
          loading ? "opacity-50" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}
      {success && <p className="text-green-500 mt-3">{success}</p>}
    </div>
  );
}
