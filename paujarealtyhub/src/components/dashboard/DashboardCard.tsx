type DashboardCardProps = {
  title: string;
  value: string | number;
  color?: string;
};

export default function DashboardCard({
  title,
  value,
  color = "bg-[#C9A227]",
}: DashboardCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* Gold decorative accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C9A227] via-[#E4C45C] to-[#C9A227]" />

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">
            {title}
          </h3>

          <p className="text-3xl font-bold text-[#0B1F3A] mt-3">
            {value}
          </p>
        </div>

        <div
          className={`w-12 h-12 ${color} rounded-xl shadow-sm opacity-90 group-hover:scale-110 transition-transform duration-300`}
        />
      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-gray-100 to-transparent" />
    </div>
  );
}