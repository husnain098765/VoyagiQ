"use client";

import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "https://via.placeholder.com/800x600?text=Trip+Image";

// Inline SVG Icons for better compatibility
const IconMapMarker = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
);
const IconDollarSign = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18 10h-2V7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2v3c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-3h2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2zM8 7h6v3H8V7z"/></svg>
);
const IconTrash = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
);

export default function PreviousTripsPage() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch completed trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/previous-trips");
        const data = await res.json();
        if (data.success) setTrips(data.trips);
      } catch (err) {
        console.error("Error fetching previous trips:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Delete functionality (Permanent delete)
  const handleDelete = async (id) => {
    if (!window.confirm("Do you want to permanently delete this trip?")) return; 
    try {
      const res = await fetch(`/api/saved-trips/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTrips(trips.filter(t => t._id !== id));
      } else {
        console.error("Failed to delete record:", data.error || data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="text-center p-10 text-xl">Loading history...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        📜 Your Travel History
      </h1>

      {trips.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed rounded-xl text-gray-500">
          <p className="text-xl font-semibold">No completed trips yet.</p>
          <p className="mt-2">Go on a trip and mark it as complete to see it here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {trips.map((trip) => (
            <div key={trip._id} className="bg-gray-50 border rounded-xl p-4 flex flex-col md:flex-row gap-4 opacity-90 hover:opacity-100 transition">
               {/* IMAGE */}
               <div className="w-full md:w-48 h-32 flex-shrink-0 relative rounded-lg overflow-hidden grayscale hover:grayscale-0 transition">
                <img
                  src={trip.mainImage || FALLBACK_IMAGE}
                  alt={trip.destination}
                  className="object-cover w-full h-full" 
                />
              </div>
              
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-700">{trip.destination}</h2>
                <p className="text-sm text-green-600 font-medium mb-2">
                  Completed on: {new Date(trip.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2">{trip.summary}</p>
                
                <div className="flex gap-4 mt-2 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                        <IconMapMarker className="w-3 h-3 text-indigo-400"/> {trip.dailyPlan?.length || 3} Days
                    </span>
                    <span className="flex items-center gap-1">
                        <IconDollarSign className="w-3 h-3 text-green-500"/> 
                        Budget: ${trip.estimatedTotalBudgetUSD || "N/A"} 
                        {trip.budget && ` (${trip.budget})`} 
                    </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 justify-center">
                 <a href={`/trip/${encodeURIComponent(trip.destination)}`}>
                    <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium w-full">Revisit Plan</button>
                 </a>
                 
                 <button 
                    onClick={() => handleDelete(trip._id)} 
                    className="px-4 py-2 text-red-500 border border-red-300 hover:bg-red-50 rounded-md transition text-sm flex items-center gap-1 justify-center font-medium"
                 >
                    <IconTrash className="w-4 h-4" /> Delete
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
