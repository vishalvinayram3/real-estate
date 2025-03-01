"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [propertyType, setPropertyType] = useState<"buy" | "rent">("buy");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}


      {/* Hero Section */}
      <header className="relative w-full h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/hero-image.jpg')" }}>
        <div className="text-center text-white bg-black bg-opacity-50 p-6 rounded-lg">
          <h1 className="text-4xl font-bold">Find Your Dream Home</h1>
          <p className="text-lg mt-2">Buy or rent the best properties in town</p>
        </div>
      </header>

      {/* Property Type Switcher */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setPropertyType("buy")}
          className={`px-6 py-3 text-lg font-semibold rounded-l-md ${
            propertyType === "buy" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setPropertyType("rent")}
          className={`px-6 py-3 text-lg font-semibold rounded-r-md ${
            propertyType === "rent" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Rent
        </button>
      </div>

      {/* Property Listings Section */}
      <section className="max-w-6xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {propertyType === "buy" ? "Properties for Sale" : "Properties for Rent"}
        </h2>
        <p className="text-gray-600">Explore the best options available.</p>

        <div className="flex justify-center mt-4">
          <Link href="/properties" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
            View {propertyType === "buy" ? "Buy" : "Rent"} Listings
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center bg-white p-4 mt-10 shadow-md">
        <p className="text-gray-600">© {new Date().getFullYear()} Real Estate Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
