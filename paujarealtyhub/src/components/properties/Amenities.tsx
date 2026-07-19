export default function Amenities() {
  const amenities = [
    "Swimming Pool",
    "24/7 Security",
    "Gym",
    "Parking Space",
    "Air Conditioning",
    "WiFi",
    "CCTV Surveillance",
    "Children's Playground",
    "Garden",
    "Backup Generator",
    "Elevator",
    "Smart Home Features",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-8">
        Amenities
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {amenities.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 border rounded-xl p-4 hover:bg-blue-50 transition"
          >
            <span className="text-green-600 text-xl">
              ✔️
            </span>

            <span className="font-medium">
              {item}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}