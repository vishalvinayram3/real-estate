import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gray-100 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-800">Find Your Dream Home</h1>
      <p className="text-gray-600 mt-2">Buy, Sell & Rent Properties Easily</p>
      <div className="mt-6">
        <Link href="/properties?type=buy" className="bg-blue-600 text-white px-6 py-3 rounded-full mx-2">Buy</Link>
        <Link href="/properties?type=rent" className="bg-green-600 text-white px-6 py-3 rounded-full mx-2">Rent</Link>
        <Link href="/properties?type=sell" className="bg-red-600 text-white px-6 py-3 rounded-full mx-2">Sell</Link>
      </div>
    </section>
  );
}
