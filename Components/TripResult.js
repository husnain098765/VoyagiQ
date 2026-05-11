// TripResult.js
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FaDollarSign, FaCar, FaLightbulb, FaHotel, FaSave } from "react-icons/fa"; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Map must be dynamically loaded
const isMapAvailable = typeof window !== 'undefined';
const MapComponent = isMapAvailable ? dynamic(() => import("./MapComponent"), { ssr: false }) : null;

const FALLBACK_IMAGE = "https://via.placeholder.com/800x600?text=Image+Loading+Failed";

const getFallbackImageUrl = (query) => {
    const seed = `${query}-main-hero-image-fallback`.replace(/\s/g, '_');
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/800`;
}

export default function TripResult({ itinerary }) {
    if (!itinerary) return null;

    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const {
        destination,
        summary,
        dailyPlan = [],
        hotels = [],
        estimatedTotalBudgetUSD,
        transportation = {},
        coordinates,
        mainImage,
        travelTips = []
    } = itinerary;

    const cleanedTravelTips = travelTips.filter(tip => !tip.includes('Altitude Awareness'));
    const mapMarkers = coordinates ? [{ position: coordinates, name: destination }] : [];
    const totalBudgetDisplay = estimatedTotalBudgetUSD ? `$${estimatedTotalBudgetUSD}` : 'Not Specified';
    const imageSrc = mainImage || getFallbackImageUrl(destination);

    // SAVE FUNCTION (Login check + MongoDB save)
    const handleSaveTrip = async () => {
        setIsSaving(true);

        try {
            // Check login session
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();

            if (!session?.user) {
                alert("Please log in to save your trip.");
                setIsSaving(false);
                return;
            }

            //  Add userEmail + status before saving
            const payload = {
                ...itinerary,
                userEmail: session.user.email,
                status: "saved"
            };

            //  Send to backend (MongoDB)
            const response = await fetch('/api/saved-trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Trip successfully saved!");
                router.push("/SavedTrips");
            } else {
                const errorData = await response.json();
                alert(`Failed to save trip: ${errorData.error || 'Server error'}`);
            }
        } catch (error) {
            console.error("Save failed:", error);
            alert("Unexpected error occurred while saving the trip.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="p-6">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-8 space-y-8">

                {/* HEADER */}
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-3xl font-extrabold text-gray-800">
                        {destination} Itinerary
                    </h2>

                    <button 
                        onClick={handleSaveTrip} 
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                    >
                        <FaSave />
                        {isSaving ? "Saving..." : "Save Trip"}
                    </button>
                </div>

                {/* MAIN IMAGE */}
                <div className="w-full h-80 overflow-hidden rounded-xl shadow-lg relative">
                    <Image
                        src={imageSrc}
                        alt={destination}
                        fill
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />
                    <div className="absolute inset-0 flex items-end p-6 bg-black bg-opacity-30">
                        <h2 className="text-4xl font-extrabold text-white">
                            🌍 {destination} Trip
                        </h2>
                    </div>
                </div>

                {/* SUMMARY */}
                <div className="pt-4 border-b pb-4">
                    <h3 className="text-2xl font-bold text-indigo-800 mb-2">Trip Summary</h3>
                    <p className="text-gray-700">{summary}</p>
                </div>

                {/* INFO CARDS */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-stretch">
                    <InfoCard 
                        icon={<FaDollarSign className="text-green-600" />} 
                        title="Total Budget Estimate" 
                        value={totalBudgetDisplay} 
                        description="3 days estimated cost"
                    />
                    <InfoCard 
                        icon={<FaCar className="text-blue-600" />} 
                        title="Transportation" 
                        value={`$${transportation.costEstimateUSD || 'N/A'}`}
                        description={transportation.summary || "Local travel advice"}
                    />
                    <InfoCard 
                        icon={<FaLightbulb className="text-yellow-600" />} 
                        title="Top Tip" 
                        value={cleanedTravelTips[0] || "Always check local customs and weather!"} 
                        description="From the AI planner"
                    />
                </div>

                {/* HOTELS */}
                <Section title="🏨 Recommended Hotels">
                    <HotelGrid hotels={hotels} />
                </Section>

                {/* DAY PLAN */}
                <Section title="🗓️ 3-Day Detailed Plan">
                    {dailyPlan.length === 0 && (
                        <p className="text-gray-500">No daily plan found.</p>
                    )}

                    {dailyPlan.map((day, i) => (
                        <div key={i} className="p-4 border rounded-xl bg-white shadow-sm mb-4">
                            <h4 className="text-xl font-bold text-indigo-700 mb-3">
                                {day.day}
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    (Budget: ${day.dailyBudgetUSD || 'N/A'})
                                </span>
                            </h4>

                            <div className="space-y-4">
                                {day.activities.map((act, index) => (
                                    <ActivityCard key={index} activity={act} />
                                ))}
                            </div>
                        </div>
                    ))}
                </Section>

                {/* MAP */}
                {isMapAvailable && MapComponent && coordinates ? (
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold text-indigo-800 mb-3">🗺️ Location Map</h3>
                        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border">
                            <MapComponent itineraryMarkers={mapMarkers} />
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 p-4 bg-gray-100 rounded-xl text-center">
                        <p className="font-semibold">
                            🗺️ Map Placeholder: Coordinates available but map component missing.
                        </p>
                        {coordinates && (
                            <p className="text-sm text-gray-600">
                                Center: Lat {coordinates.lat.toFixed(3)}, Lng {coordinates.lng.toFixed(3)}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ------- Shared Components ------- */

function InfoCard({ icon, title, value, description }) {
    return (
        <div className="p-4 border rounded-lg shadow-md bg-white flex flex-col h-full justify-between">
            <h4 className="font-bold flex items-center gap-2 text-lg mb-1">
                {icon} {title}
            </h4>

            <p className={`${title !== "Top Tip" ? "text-4xl" : "text-base"} font-extrabold text-gray-800 my-4 flex-grow`}>
                {value}
            </p>

            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    );
}

function HotelGrid({ hotels }) {
    if (hotels.length === 0)
        return <p className="text-gray-500">No hotel recommendations.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hotels.map((hotel, i) => (
                <div key={i} className="bg-white border rounded-xl shadow-md overflow-hidden">
                    <div className="w-full h-36 relative">
                        <Image
                            src={hotel.image || FALLBACK_IMAGE}
                            alt={hotel.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 25vw"
                            className="object-cover"
                            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                        />
                    </div>

                    <div className="p-3">
                        <h5 className="font-bold text-indigo-700 truncate" title={hotel.name}>
                            <FaHotel className="inline-block mr-2" />
                            {hotel.name}
                        </h5>

                        <p className="text-sm text-gray-600">Type: {hotel.type}</p>
                        <p className="text-sm font-semibold text-green-600">{hotel.priceRangeUSD}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ActivityCard({ activity }) {
    const getImageUrl = (query, time) => {
        const seed = `${query}-${time}-${Math.random()}`.replace(/\s/g, "_");
        return `https://picsum.photos/seed/${encodeURIComponent(seed)}/112/112`;
    };

    const displayCost = activity.costUSD > 0 ? activity.costUSD : 20;

    return (
        <div className="flex bg-white border p-3 rounded-lg shadow-sm">
            <div className="w-28 h-28 relative rounded-md overflow-hidden mr-4">
                <Image
                    src={activity.image || getImageUrl(activity.description, activity.time)}
                    alt={activity.description}
                    fill
                    sizes="112px"
                    className="object-cover"
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
            </div>

            <div className="flex-grow">
                <p className="font-semibold text-gray-800 text-lg">
                    {activity.time} - {activity.description}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                    Estimated Cost:
                    <span className="font-bold"> ${displayCost}</span>
                </p>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="border-t pt-6">
            <h3 className="text-2xl font-bold text-indigo-800 mb-4">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );
}
