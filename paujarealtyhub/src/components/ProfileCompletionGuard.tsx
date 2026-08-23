"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isProfileComplete } from "@/services/profileStatus";

export default function ProfileCompletionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      const status = await isProfileComplete();

      setComplete(status);
      setLoading(false);
    }

    checkProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        Checking profile...
      </div>
    );
  }

  if (!complete) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">

          <h2 className="text-2xl font-bold mb-4">
            Complete Your Profile
          </h2>

          <p className="text-gray-600 mb-8">
            Before you can continue, please complete your professional profile.
          </p>

          <div className="flex gap-4">

            <Link
              href={`/dashboard/profile?next=${encodeURIComponent(pathname)}`}
              className="flex-1 bg-blue-700 text-white text-center py-3 rounded-lg hover:bg-blue-800 transition"
            >
              Complete Profile
            </Link>

            <Link
              href="/dashboard"
              className="flex-1 border border-gray-300 text-center py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </Link>

          </div>

        </div>

      </div>
    );
  }

  return <>{children}</>;
}