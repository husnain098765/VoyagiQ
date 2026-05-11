"use client";

import Link from "next/link";
import {
  FaHome,
  FaBookmark,
  FaMapMarkedAlt,
  FaSuitcaseRolling, 
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`${
        isExpanded ? "w-56" : "w-16"
      } h-[calc(100vh-4rem)] bg-white border-r border-gray-300 sticky top-16 flex flex-col transition-all duration-300`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 text-gray-700"
      >
        <FaBars />
        {isExpanded && <span className="font-medium">Menu</span>}
      </button>

      {/* Navigation Links */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:text-indigo-600 font-medium"
            >
              <FaHome /> {isExpanded && "Home"}
            </Link>
          </li>
          <li>
            <Link
              href="/SavedTrips"
              className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:text-indigo-600 font-medium"
            >
              <FaBookmark /> {isExpanded && "Saved Trips"}
            </Link>
          </li>
          <li>
            <Link
              href="/map"
              className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:text-indigo-600 font-medium"
            >
              <FaMapMarkedAlt /> {isExpanded && "Map View"}
            </Link>
          </li>
          <li>
            <Link
              href="/PreviousTrips"
              className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:text-indigo-600 font-medium"
            >
              <FaSuitcaseRolling /> {isExpanded && "Previous Trips"}
            </Link>
          </li>
         
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
