"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaDollarSign, FaTrash, FaCheckCircle, FaUsers, FaHeart } from "react-icons/fa";

const FALLBACK_IMAGE = "https://via.placeholder.com/800x600?text=Trip+Image";

export default function SavedTripsPage() {
  const [savedTrips, setSavedTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch saved trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/saved-trips");
        const data = await res.json();
        if (data.success) setSavedTrips(data.trips);
      } catch (err) {
        console.error("Error fetching saved trips:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // DELETE trip
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    try {
      const res = await fetch(`/api/saved-trips/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSavedTrips(savedTrips.filter((trip) => trip._id !== id));
      } else {
        alert(data.error || "Failed to delete trip.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while deleting.");
    }
  };

  // MARK AS COMPLETE
  const handleComplete = async (id) => {
    if (!confirm("Have you finished this trip? It will be moved to Previous Trips.")) return;
    try {
      const res = await fetch(`/api/saved-trips/${id}`, { method: "PATCH" });
      const data = await res.json();

      if (data.success) {
        // Remove from current view as it is now 'completed'
        setSavedTrips(savedTrips.filter((t) => t._id !== id));

        //  Save completedAt if not already there
        const completedDate = new Date(data.trip.updatedAt || Date.now()).toLocaleDateString();
        alert(`Trip moved to Previous Trips!\nCompleted on: ${completedDate}`);
      } else {
        alert("Error completing trip.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while completing trip.");
    }
  };

  if (isLoading)
    return <div className="text-center p-10 text-xl">Loading saved trips...</div>;

  if (savedTrips.length === 0)
    return (
      <div className="text-center p-10 border-2 border-dashed rounded-xl text-gray-500">
        <p className="text-xl font-semibold">No active trips found!</p>
        <p className="mt-2">Generate a trip or check your Previous Trips.</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6 border-b pb-2">
        ⭐ Your Saved Trip Plans
      </h1>

      <div className="space-y-6">
        {savedTrips.map((trip) => (
          <div
            key={trip._id}
            className="bg-white border rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-xl transition"
          >
            {/* IMAGE */}
            <div className="w-full md:w-60 h-48 flex-shrink-0 relative rounded-lg overflow-hidden">
              <Image
                src={trip.mainImage || FALLBACK_IMAGE}
                alt={trip.destination}
                fill
                sizes="(max-width: 768px) 100vw, 250px"
                className="object-cover"
              />
            </div>

            {/* DETAILS */}
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-indigo-700">{trip.destination}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Created on: {new Date(trip.createdAt).toLocaleDateString()}
              </p>

              <p className="text-gray-600 mb-3 line-clamp-2">{trip.summary}</p>

              {/* New Info Chips */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                 <span className="flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                   <FaUsers /> {trip.members || 1} People
                 </span>
                 <span className="flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded">
                   <FaDollarSign /> {trip.budget || "Medium"}
                 </span>
                 <span className="flex items-center gap-1 text-xs font-semibold bg-purple-50 text-purple-700 px-2 py-1 rounded">
                   <FaHeart /> {trip.interests?.join(", ") || "General"}
                 </span>
                 <span className="flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded">
                   <FaMapMarkerAlt /> {trip.dailyPlan?.length || 3} Days
                 </span>
              </div>

              <div className="text-lg font-bold text-green-600">
                 Est. Cost: ${trip.estimatedTotalBudgetUSD || "N/A"}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col justify-between items-end gap-2 min-w-[140px]">
              <Link href={`/trip/${encodeURIComponent(trip.destination)}`} className="w-full">
                <button className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm font-medium">
                  View Plan
                </button>
              </Link>

              <button
                onClick={() => handleComplete(trip._id)}
                className="w-full px-3 py-2 text-green-700 border border-green-600 rounded-md hover:bg-green-50 transition flex items-center justify-center gap-2 text-sm font-medium"
              >
                <FaCheckCircle /> Complete
              </button>

              <button
                onClick={() => handleDelete(trip._id)}
                className="w-full px-3 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-50 transition flex items-center justify-center gap-2 text-sm font-medium"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
