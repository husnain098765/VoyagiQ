"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import L from "leaflet";

// Fix Leaflet default icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src || markerIcon,
  iconRetinaUrl: markerIcon2x.src || markerIcon2x,
  shadowUrl: markerShadow.src || markerShadow,
});

// Red icon for trip destinations
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow.src || markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// FlyTo component
function FlyToLocation({ position, name, zoomLevel }) {
  const map = useMap();
  const validPosition =
    position && position.length === 2 && position[0] !== 0 && position[1] !== 0;

  if (validPosition) {
    map.flyTo(position, zoomLevel || 10);
  }

  return null;
}

// Main Map Component
export default function MapComponent({
  itineraryMarkers = [],
  smallView = false,
  mapHeight = 400,
}) {
  const center = useMemo(() => {
    return itineraryMarkers.length > 0
      ? itineraryMarkers[0].position
      : [30.3753, 69.3451];
  }, [itineraryMarkers]);

  const zoom = smallView ? 8 : 10;
  const markerName =
    itineraryMarkers.length > 0 ? itineraryMarkers[0].name : "Destination";

  return (
    <div className="w-full">
      <div
        className="w-full rounded-lg overflow-hidden relative z-0"
        style={{ height: `${mapHeight}px` }}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={!smallView}
          dragging={!smallView}
          doubleClickZoom={!smallView}
          zoomControl={!smallView}
          minZoom={3}
          maxZoom={18}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {itineraryMarkers.map((marker, index) => (
            <Marker
              key={`m-${index}`}
              position={marker.position}
              icon={redIcon}
            >
              <Popup>
                <b>{marker.name}</b>
              </Popup>
            </Marker>
          ))}

          <FlyToLocation position={center} name={markerName} zoomLevel={zoom} />
        </MapContainer>
      </div>
    </div>
  );
}
