"use client";

import { useState } from "react";
import {
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiTag,
  FiDollarSign,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import DestinationsGrid from "@/Components/DestinationsGrid";

export default function HeroSection({ setItinerary }) {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [members, setMembers] = useState("");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState({
    adventure: false,
    culture: false,
    shopping: false,
  });
  const [showDestinations, setShowDestinations] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle checkbox change for interests
  const handleInterestChange = (key, checked) => {
    setInterests((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  //  Show recommended destinations instead of direct trip
  const handleShowDestinations = async () => {
    if (!location.trim() || !budget.trim() || !members.trim()) {
      alert("Please fill in Destination, Budget, and Number of Travelers.");
      return;
    }

    setLoading(true);
    // Small delay for smooth UI transition
    setTimeout(() => {
      setShowDestinations(true);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      <section className="relative bg-gradient-to-r from-cyan-600 to-indigo-600 text-white p-12 rounded-3xl">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Live your dream <br /> destinations.
          </h1>

          <p className="text-lg text-gray-100 max-w-xl">
            Plan your trip with AI-generated itineraries & destination
            recommendations.
          </p>

          {/* Search Form */}
          <div className="bg-white shadow-md rounded-xl p-6 flex flex-wrap gap-4 items-center mt-10 text-gray-800">
            {/* Location */}
            <div className="flex items-center gap-2 flex-1 min-w-[160px] border-b md:border-b-0 md:border-r pr-4">
              <FiMapPin className="text-indigo-600 shrink-0" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs md:text-sm focus:outline-none"
              />
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 flex-1 min-w-[140px] border-b md:border-b-0 md:border-r pr-4">
              <FiCalendar className="text-indigo-600 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs md:text-sm focus:outline-none"
              />
            </div>

            {/* Members */}
            <div className="flex items-center gap-2 flex-1 min-w-[140px] border-b md:border-b-0 md:border-r pr-4">
              <FiUsers className="text-indigo-600 shrink-0" />
              <input
                type="number"
                min="1"
                placeholder="Members"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className="w-full text-xs md:text-sm focus:outline-none"
              />
            </div>

            {/* Interests */}
            <div className="flex items-center flex-1 min-w-[200px] gap-3 border-b md:border-b-0 md:border-r pr-4">
              <FiTag className="text-indigo-600 shrink-0" />
              <span className="text-xs font-medium shrink-0">Interests</span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {["adventure", "culture", "shopping"].map((key) => (
                  <label key={key} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      className="accent-indigo-600"
                      checked={interests[key]}
                      onChange={(e) =>
                        handleInterestChange(key, e.target.checked)
                      }
                    />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center gap-2 flex-1 min-w-[140px]">
              <FiDollarSign className="text-indigo-600 shrink-0" />
              <input
                type="number"
                min="0"
                step="50"
                placeholder="Budget ($)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs md:text-sm focus:outline-none"
              />
            </div>

            {/* Generate Itinerary Button */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleShowDestinations}
                disabled={loading || !location.trim()}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm disabled:opacity-60"
              >
                <FaRobot /> {loading ? "Loading..." : "Generate Itinerary"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/*  Show Destinations if triggered */}
      {showDestinations && (
        <DestinationsGrid
          location={location}
          interests={Object.keys(interests).filter((k) => interests[k])}
          budget={budget}
          setItinerary={setItinerary}
        />
      )}
    </>
  );
}
