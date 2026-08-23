import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#061426] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#C9A227] text-[#08192E] flex items-center justify-center font-black text-lg">
                P
              </div>

              <h2 className="text-2xl font-bold">
                PaujaRealtyHub
              </h2>
            </div>

            <p className="mt-5 text-gray-400 leading-7">
              Connecting property seekers, owners,
              agents and developers through a smarter
              real estate marketplace.
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="font-bold text-lg text-[#C9A227] mb-5">
              Services
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/properties?listing=Sale"
                  className="hover:text-white transition"
                >
                  Buy Property
                </Link>
              </li>

              <li>
                <Link
                  href="/properties?listing=Rent"
                  className="hover:text-white transition"
                >
                  Rent Property
                </Link>
              </li>

              <li>
                <Link
                  href="/properties"
                  className="hover:text-white transition"
                >
                  Explore Properties
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/add-property"
                  className="hover:text-white transition"
                >
                  List Property
                </Link>
              </li>

              <li>
                <Link
                  href="/agents"
                  className="hover:text-white transition"
                >
                  Find Agents
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-bold text-lg text-[#C9A227] mb-5">
              Company
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/properties"
                  className="hover:text-white transition"
                >
                  Properties
                </Link>
              </li>

              <li>
                <Link
                  href="/agents"
                  className="hover:text-white transition"
                >
                  Agents
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ACCOUNT */}
          <div>
            <h3 className="font-bold text-lg text-[#C9A227] mb-5">
              Your Account
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition"
                >
                  Log In
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="hover:text-white transition"
                >
                  Sign Up
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-white transition"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/favorites"
                  className="hover:text-white transition"
                >
                  Saved Properties
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-14 pt-7 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-sm text-gray-500">

          <p>
            © {new Date().getFullYear()} PaujaRealtyHub. All rights reserved.
          </p>

          <p>
            Property • Trust • Intelligence
          </p>

        </div>

      </div>
    </footer>
  );
}