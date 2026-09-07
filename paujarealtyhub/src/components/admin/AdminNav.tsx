"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Users & Agents",
    href: "/admin/users",
  },
  {
    label: "Properties",
    href: "/admin/properties",
  },
  {
    label: "Businesses",
    href: "/admin/businesses",
  },
  {
    label: "Support Inbox",
    href: "/admin/support",
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <nav className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3">
      <div className="flex flex-wrap gap-2">
        {adminLinks.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                active
                  ? "bg-[#08192E] text-[#C9A227]"
                  : "text-[#08192E] hover:bg-[#C9A227]/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}