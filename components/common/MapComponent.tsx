
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapComponentProps {
  turfs: any[];
  onMarkerClick: (turf: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ turfs, onMarkerClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // Initialize map centered on Mumbai
      mapInstance.current = L.map(mapContainer.current).setView([19.0760, 72.8777], 11);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);

      // Fix Leaflet's default icon path issues in React
      const DefaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
      });
      L.Marker.prototype.options.icon = DefaultIcon;
    }

    // Add markers
    if (mapInstance.current) {
       // Clear existing markers (simplistic approach for now)
       mapInstance.current.eachLayer((layer) => {
         if (layer instanceof L.Marker) {
           mapInstance.current?.removeLayer(layer);
         }
       });

       turfs.forEach(turf => {
         if (turf.lat && turf.lng) {
            const marker = L.marker([turf.lat, turf.lng])
              .addTo(mapInstance.current!)
              .bindPopup(`
                <div class="p-3 text-center">
                   <strong class="block text-sm mb-1">${turf.name}</strong>
                   <span class="text-xs text-gray-500">${turf.location}</span>
                   <button id="book-${turf.id}" class="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded w-full">View Details</button>
                </div>
              `);
            
            marker.on('popupopen', () => {
                const btn = document.getElementById(`book-${turf.id}`);
                if (btn) btn.onclick = () => onMarkerClick(turf);
            });
         }
       });
    }

    return () => {
      // Cleanup if needed, but keeping map instance alive for performace in this simple app
    };
  }, [turfs]);

  return <div ref={mapContainer} className="w-full h-full z-0" />;
};

export default MapComponent;
