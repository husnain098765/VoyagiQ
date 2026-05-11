// app/admin/components/Sidebar.js
"use client";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const path = usePathname();

  const isActive = (route) =>
    path === route
      ? "bg-gray-700 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 space-y-6 h-screen sticky top-0">
      <h1 className="text-2xl font-bold tracking-wide pb-4 border-b border-gray-700">
        Admin Panel
      </h1>

      <nav className="space-y-2">
        <button
          onClick={() => router.push("/admin")}
          className={`block w-full text-left py-2 px-3 rounded transition ${isActive(
            "/admin"
          )}`}
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/admin/users")}
          className={`block w-full text-left py-2 px-3 rounded transition ${isActive(
            "/admin/users"
          )}`}
        >
          Users
        </button>

        <button
          onClick={() => router.push("/admin/trips")}
          className={`block w-full text-left py-2 px-3 rounded transition ${isActive(
            "/admin/trips"
          )}`}
        >
          Trips
        </button>
      </nav>
    </aside>
  );
}
