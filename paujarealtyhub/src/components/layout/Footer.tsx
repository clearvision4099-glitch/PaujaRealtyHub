export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto grid md:grid-cols-4 gap-8 px-6">

        <div>
          <h2 className="text-2xl font-bold">
            PaujaRealtyHub
          </h2>

          <p className="mt-4 text-gray-400">
            Connecting the world through real estate.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Services
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>Buy Property</li>
            <li>Rent Property</li>
            <li>Lease Property</li>
            <li>Sell Property</li>
            <li>Invest</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Company
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>About Us</li>
            <li>Contact</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Support
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>Help Centre</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500">
        © {new Date().getFullYear()} Pauja Global. All rights reserved.
      </div>
    </footer>
  );
}