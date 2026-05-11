"use client";
import { useState } from "react";
import HeroSection from "@/Components/HeroSection";
import TripResult from "@/Components/TripResult";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/Components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  const [itinerary, setItinerary] = useState("");

  return (
    <div className="flex-1">
      <HeroSection setItinerary={setItinerary} />
      <TripResult itinerary={itinerary} />
    
    </div>
  );
}
