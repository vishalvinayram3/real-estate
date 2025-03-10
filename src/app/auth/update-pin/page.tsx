"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function UpdatePinPage() {
  const router = useRouter();
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdatePin = async () => {
    setMessage(null);
    setError(null);

    if (newPin.length < 6) {
      setError("PIN must be at least 6 characters.");
      return;
    }

    if (newPin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPin,
    });
    setLoading(false);

    if (error) {
      setError("Failed to update PIN. Try again.");
    } else {
      setMessage("PIN updated successfully. Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-20 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Set New PIN</h1>
      <p className="text-gray-600 mb-4">Enter a new PIN to reset your password.</p>

      <input
        type="password"
        placeholder="Enter new PIN"
        className="border p-2 w-full mb-3 rounded-md"
        value={newPin}
        onChange={(e) => setNewPin(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm new PIN"
        className="border p-2 w-full mb-3 rounded-md"
        value={confirmPin}
        onChange={(e) => setConfirmPin(e.target.value)}
      />

      <button
        onClick={handleUpdatePin}
        className="bg-green-600 text-white px-4 py-2 w-full rounded hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update PIN"}
      </button>

      {message && <p className="text-green-600 mt-3">{message}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
