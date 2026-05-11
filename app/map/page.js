// "use client";

// import MapComponent from "@/Components/MapComponent";

// export default function MapPage() {
//   return (
//     <section className="mt-6">
//       <h1 className="text-2xl font-bold mb-4">🌍 Map View</h1>
//       <MapComponent />
//     </section>
//   );
// }


"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(
  () => import("@/Components/MapComponent"),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

export default function MapPage() {
  return (
    <section className="mt-6">
      <h1 className="text-2xl font-bold mb-4">
        🌍 Map View
      </h1>

      <MapComponent />
    </section>
  );
}