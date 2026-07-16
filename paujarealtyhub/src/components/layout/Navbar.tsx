import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-700">
          PaujaRealtyHub
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link href="/">Home</Link>
          <Link href="/buy">Buy</Link>
          <Link href="/rent">Rent</Link>
          <Link href="/sell">Sell</Link>
          <Link href="/agents">Agents</Link>
          <Link href="/contact">Contact</Link>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}