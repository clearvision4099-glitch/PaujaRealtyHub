export default function AgentCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-6">
        Property Agent
      </h2>

      <div className="flex items-center gap-5">

        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
          👨🏾
        </div>

        <div>

          <h3 className="text-xl font-bold">
            John Doe
          </h3>

          <p className="text-gray-500">
            Senior Property Consultant
          </p>

        </div>

      </div>

      <div className="mt-8 space-y-4">

        <p>📞 +234 800 000 0000</p>

        <p>✉️ agent@paujarealtyhub.com</p>

      </div>

      <button className="mt-8 w-full bg-blue-700 hover:bg-blue-800 transition text-white py-4 rounded-xl font-semibold">
        Contact Agent
      </button>

    </div>
  );
}