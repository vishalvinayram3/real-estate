import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-4xl font-bold text-gray-900">Why Choose Us?</h1>
        <p className="text-lg text-gray-700 mt-4">
          We offer transparent pricing, no hidden fees, and direct deals with property owners.
        </p>
        <ul className="mt-6 space-y-3">
          <li className="text-lg">✅ No Brokerage Fees</li>
          <li className="text-lg">✅ Trusted Policies</li>
          <li className="text-lg">✅ Easy Transactions</li>
          <li className="text-lg">✅ Personalized Property Planning</li>
        </ul>
      </div>
    </div>
  );
}
