// /app/trip/[destinationName]/page.js (Updated & Fixed)

import TripResult from "@/Components/TripResult"; 
import { Suspense } from 'react';
import Loading from './loading'; 

// Server side data fetching function
async function fetchTripData(destinationName) {
    // Ensure the destination name is correctly decoded before use in the body and URL
    const decodedDestination = decodeURIComponent(destinationName);

    //  SERVER_URL environment variable
    const baseUrl = process.env.SERVER_URL; 
    
    // Use full URL if SERVER_URL is set, otherwise fallback to relative path
    const apiUrl = baseUrl ? `${baseUrl}/api/ai/generate-trip` : "/api/ai/generate-trip"; 

    try {
        const response = await fetch(apiUrl, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                destination: decodedDestination, 
                budget: 'mid-range', 
                members: 2,          
                interests: ['general'] 
            }),
            cache: 'no-store' 
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to fetch trip data (${response.status} for ${decodedDestination}):`, errorText);
            return null;
        }
        
        const data = await response.json();
        return data.itinerary; 
    } catch (error) {
        console.error("Network or parsing error during trip data fetch:", error);
        return null;
    }
}


export default async function TripPage({ params }) {
    //  Await params for modern Server Components
    const resolvedParams = await params;
    const destinationName = resolvedParams.destinationName;

    const itinerary = await fetchTripData(destinationName);

    if (!itinerary) {
        return (
            <div className="text-center p-20 text-xl text-red-600">
                ❌ Error: Trip plan for "{decodeURIComponent(destinationName)}" could not be loaded. Please try again.
            </div>
        );
    }

    return (
        <Suspense fallback={<Loading />}> 
           <TripResult itinerary={itinerary} />
        </Suspense>
    );
}
