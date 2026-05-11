// DestinationsGrid.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; //  router import kiya gaya

// Placeholder image (Jab real image load na ho sake)
const FALLBACK_IMAGE = "https://via.placeholder.com/800x600?text=Travel+Image+Not+Found";

export default function DestinationsGrid({ location, interests, budget, setItinerary }) {
  //  All Hooks must be at the top level
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState([]); 
  
  const router = useRouter(); //  useRouter Hook initialize kiya gaya

  // useEffect to set initial image URLs when destinations data arrives
  useEffect(() => {
    if (destinations.length > 0) {
        setImageUrls(destinations.map(d => d.image));
    }
  }, [destinations]);


  useEffect(() => {
    if (!location) return;

    const fetchDestinations = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/ai/generate-destinations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location,
            interests,
            budget,
          }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "API Failed");

        setDestinations(data.destinations);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [location, interests, budget]);

  const handleImageError = (index) => {
    setImageUrls(prevUrls => {
      const newUrls = [...prevUrls];
      if (newUrls[index] !== FALLBACK_IMAGE) {
        newUrls[index] = FALLBACK_IMAGE;
      }
      return newUrls;
    });
  };

  //  Conditional returns must come AFTER all hooks

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-medium animate-pulse">
        Generating travel recommendations with AI...
      </div>
    );
  }

  if (destinations.length === 0) {
    return <p className="text-center mt-10 text-gray-500">No destinations found.</p>;
  }

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Recommended Destinations in "{location}" 
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {destinations.map((d, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition cursor-pointer"
            // State change ke bajaye, naye page par redirect karo
            onClick={() => {
                const encodedDestination = encodeURIComponent(d.name);
                router.push(`/trip/${encodedDestination}`); 
            }} 
          >
            {/* Image tag with dynamic URL and onError fallback */}
            <img 
              src={imageUrls[idx] || FALLBACK_IMAGE} 
              alt={d.name} 
              className="h-40 w-full object-cover" 
              onError={() => handleImageError(idx)} 
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold">{d.name}</h3>
              <p className="text-sm text-gray-600">{d.country}</p>

              <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                {d.shortDescription}
              </p>

              <p className="mt-3 text-sm font-medium text-indigo-600">
                Estimated Budget: ${d.estimatedBudgetUSD}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}