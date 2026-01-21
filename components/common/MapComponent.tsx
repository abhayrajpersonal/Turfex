
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapComponentProps {
  turfs: any[];
  friends?: any[];
  onMarkerClick: (turf: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ turfs, friends = [], onMarkerClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Function to get correct tile URL based on theme
  const getTileUrl = () => {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  };

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // Initialize map centered on Mumbai
      mapInstance.current = L.map(mapContainer.current).setView([19.0760, 72.8777], 11);

      tileLayerRef.current = L.tileLayer(getTileUrl(), {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);

      // Initialize LayerGroup for efficient marker management
      markersLayer.current = L.layerGroup().addTo(mapInstance.current);

      // Fix Leaflet's default icon path issues in React
      const DefaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
      });
      L.Marker.prototype.options.icon = DefaultIcon;
    }

    // Observer for Dark Mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
           if (tileLayerRef.current) {
             tileLayerRef.current.setUrl(getTileUrl());
           }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });

    // Update markers using LayerGroup
    if (markersLayer.current) {
       markersLayer.current.clearLayers();

       // Turf Markers
       turfs.forEach(turf => {
         if (turf.lat && turf.lng) {
            const marker = L.marker([turf.lat, turf.lng])
              .bindPopup(`
                <div class="p-3 text-center min-w-[150px] font-sans">
                   <strong class="block text-sm mb-1 text-gray-900">${turf.name}</strong>
                   <span class="text-xs text-gray-500 block mb-2">${turf.location}</span>
                   <button id="book-${turf.id}" class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer">
                      View Details
                   </button>
                </div>
              `);
            
            marker.on('popupopen', () => {
                const btn = document.getElementById(`book-${turf.id}`);
                if (btn) btn.onclick = () => onMarkerClick(turf);
            });

            markersLayer.current?.addLayer(marker);
         }
       });

       // Friend Markers
       friends.forEach(friend => {
         if (friend.lat && friend.lng) {
             const friendIcon = L.divIcon({
                 className: 'custom-div-icon',
                 html: `
                    <div class="relative w-10 h-10 group cursor-pointer transition-transform hover:scale-110">
                        <img src="${friend.avatar_url}" class="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover bg-gray-200" />
                        <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${friend.status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}"></div>
                    </div>
                 `,
                 iconSize: [40, 40],
                 iconAnchor: [20, 40],
                 popupAnchor: [0, -40]
             });

             // Use zIndexOffset to ensure friends are always on top of turfs
             const marker = L.marker([friend.lat, friend.lng], { icon: friendIcon, zIndexOffset: 1000 })
               .bindPopup(`
                 <div class="p-3 text-center min-w-[140px] font-sans">
                    <div class="flex items-center gap-2 mb-2 justify-center">
                        <img src="${friend.avatar_url}" class="w-8 h-8 rounded-full object-cover bg-gray-100" />
                        <div class="text-left">
                            <strong class="text-sm block leading-none text-gray-900">${friend.username}</strong>
                            <span class="text-[10px] text-gray-500">Is at ${friend.turf_name}</span>
                        </div>
                    </div>
                    <div class="text-xs font-bold ${friend.status === 'LIVE' ? 'text-green-600' : 'text-blue-600'} bg-gray-50 p-1 rounded mb-2">
                        ${friend.status === 'LIVE' ? 'Playing Now' : 'Playing Soon'} • ${friend.sport}
                    </div>
                 </div>
               `);
             
             markersLayer.current?.addLayer(marker);
         }
       });
    }

    return () => {
      observer.disconnect();
    };
  }, [turfs, friends]);

  return <div ref={mapContainer} className="w-full h-full z-0" />;
};

export default MapComponent;
