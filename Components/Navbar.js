"use client";

import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react"; // NextAuth imports

const Navbar = () => {
  //  Session hook ka istemal: current user data aur status check karein
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/voyagiq-logo.png"
            alt="VoyagiQ"
            className="h-10 w-auto"
            // Image load na hone par placeholder
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x40/4f46e5/ffffff?text=VoyagiQ" }}
          />
        </Link>

        {/* Right: Nav Links and Auth Buttons */}
        <nav>
          <ul className="flex gap-6 font-medium text-slate-700 items-center">
            
            {/* Help Link (Always Visible) */}
            <li>
              <Link href="/help" className="hover:text-indigo-600 transition">
                Help
              </Link>
            </li>

            {/* Loading State */}
            {loading && (
                <li className="text-gray-400">Loading...</li>
            )}

            {/* LOGGED IN STATE: Agar session hai aur loading complete ho gayi hai */}
            {session && !loading && (
              <>
                <li className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                  Hello, {session.user.name.split(' ')[0]} {/* Pehla naam display karein */}
                </li>
                <li>
                  <button
                    // Logout button, home page par redirect karein
                    onClick={() => signOut({ callbackUrl: '/' })} 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md font-semibold"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* LOGGED OUT STATE: Agar session nahi hai aur loading complete ho gayi hai */}
            {!session && !loading && (
              <>
                {/* Login Button */}
                <li>
                  <Link
                    href="/login"
                    className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold"
                  >
                    Login
                  </Link>
                </li>

                {/* Register Button */}
                <li>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md font-semibold"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;