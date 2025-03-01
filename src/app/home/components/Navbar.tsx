"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-all">
        Real Estate Hub
      </Link>
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="text-gray-700 hover:text-blue-600 transition-all">Home</Link>
        <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-all">Why Us</Link>
        <Link href="/services" className="text-gray-700 hover:text-blue-600 transition-all">Services</Link>
        <Link href="/showcase" className="text-gray-700 hover:text-blue-600 transition-all">Showcase</Link>
        <Link href="/properties" className="text-gray-700 hover:text-blue-600 transition-all">Properties</Link>
        <Link href="/packages" className="text-gray-700 hover:text-blue-600 transition-all">Packages</Link>
        <Link href="/team" className="text-gray-700 hover:text-blue-600 transition-all">Team</Link>
        <Link href="/listings" className="text-gray-700 hover:text-blue-600 transition-all">Listings</Link>
        <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-all">Contact</Link>
      </div>
      <div className="space-x-4">
        <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-all">Login</Link>
        <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all">
          Register
        </Link>
      </div>
    </nav>
  );
}
