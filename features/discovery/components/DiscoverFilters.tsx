
import React from 'react';
import { Filter, ChevronRight } from 'lucide-react';

interface DiscoverFiltersProps {
  show: boolean;
  onClose: () => void; // Reset trigger
  priceRange: number;
  setPriceRange: (val: number) => void;
  timeFilter: string;
  setTimeFilter: (val: string) => void;
  selectedAmenities: string[];
  toggleAmenity: (val: string) => void;
  amenitiesList: string[];
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  show,
  onClose,
  priceRange,
  setPriceRange,
  timeFilter,
  setTimeFilter,
  selectedAmenities,
  toggleAmenity,
  amenitiesList
}) => {
  if (!show) return null;

  return (
    <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 animate-scale-in shadow-lg mb-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-lg text-midnight dark:text-white flex items-center gap-2">
          <Filter size={18} /> Filters
        </h4>
        <button onClick={onClose} className="text-xs text-blue-500 font-bold hover:underline">Reset All</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase block">Max Price</label>
          <div className="relative pt-1">
            <input 
              type="range" 
              min="500" max="3000" step="100" 
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-electric"
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs font-bold text-gray-500">₹500</span>
              <span className="text-sm font-black text-electric bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">₹{priceRange}</span>
              <span className="text-xs font-bold text-gray-500">₹3000+</span>
            </div>
          </div>
        </div>

        {/* Time Availability */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase block">Time Availability</label>
          <div className="relative">
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-sm font-bold text-midnight dark:text-white outline-none focus:ring-2 focus:ring-electric appearance-none"
            >
              <option value="any">Any Time</option>
              <option value="morning">Morning (6AM - 12PM)</option>
              <option value="evening">Evening (4PM - 9PM)</option>
              <option value="night">Night (9PM - 12AM)</option>
            </select>
            <ChevronRight className="absolute right-3 top-3.5 text-gray-400 rotate-90" size={16} />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase block">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.slice(0, 5).map(amenity => (
              <button 
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedAmenities.includes(amenity) ? 'bg-electric text-white border-electric shadow-md' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverFilters;
