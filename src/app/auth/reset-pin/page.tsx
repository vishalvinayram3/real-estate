"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ResetPinPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Step 1: Send OTP
  const sendOtp = async () => {
    setMessage(null);
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.s

    setLoading(false);

    if (error) {
      setError("Failed to send OTP. Please check your email and try again.");
    } else {
      setMessage("An OTP has been sent to your email.");
      setStep(2);
    }
  };

  // ✅ Step 2: Verify OTP and Reset PIN
  const verifyOtpAndSetPin = async () => {
    setMessage(null);
    setError(null);
    setLoading(true);

    // ✅ Verify OTP
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
      return;
    }

    // ✅ Update Password (or PIN) after OTP is verified
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPin,
    });

    setLoading(false);

    if (updateError) {
      setError("Failed to update PIN. Please try again.");
    } else {
      setMessage("PIN has been reset successfully. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/auth/login"; // ✅ Redirect after success
      }, 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Reset PIN</h1>
          <p className="text-gray-600 mb-4">
            Enter your email to receive a one-time password (OTP).
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-3 rounded-md"
          />

          <button
            onClick={sendOtp}
            className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verify OTP</h1>
          <p className="text-gray-600 mb-4">
            Enter the OTP sent to your email and set a new PIN.
          </p>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full mb-3 rounded-md"
          />

          <input
            type="password"
            placeholder="New PIN"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            className="border p-2 w-full mb-3 rounded-md"
          />

          <button
            onClick={verifyOtpAndSetPin}
            className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset PIN"}
          </button>
        </>
      )}

      {message && <p className="text-green-600 mt-3">{message}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
