
import React from 'react';
import { Filter, ChevronRight } from 'lucide-react';

interface DiscoverFiltersProps {
  show: boolean;
  onClose: () => void;
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
    <div className="bg-zinc-900 p-6 border-b border-zinc-800 animate-scale-in mb-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-lg text-white flex items-center gap-2 font-display uppercase tracking-wider">
          <Filter size={18} className="text-volt" /> Filters
        </h4>
        <button onClick={onClose} className="text-xs text-zinc-400 font-bold hover:text-white uppercase">Reset</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-500 uppercase block tracking-wider">Max Price</label>
          <div className="relative pt-1">
            <input 
              type="range" 
              min="500" max="3000" step="100" 
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-volt"
            />
            <div className="flex justify-between mt-3">
              <span className="text-xs font-bold text-zinc-500">₹500</span>
              <span className="text-sm font-black text-black bg-volt px-2 py-0.5">₹{priceRange}</span>
              <span className="text-xs font-bold text-zinc-500">₹3000+</span>
            </div>
          </div>
        </div>

        {/* Time Availability */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-500 uppercase block tracking-wider">Time Availability</label>
          <div className="relative">
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full bg-black border border-zinc-700 p-3 text-sm font-bold text-white outline-none focus:border-volt appearance-none uppercase tracking-wide"
            >
              <option value="any">Any Time</option>
              <option value="morning">Morning (6AM - 12PM)</option>
              <option value="evening">Evening (4PM - 9PM)</option>
              <option value="night">Night (9PM - 12AM)</option>
            </select>
            <ChevronRight className="absolute right-3 top-3.5 text-zinc-500 rotate-90" size={16} />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-zinc-500 uppercase block tracking-wider">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.slice(0, 5).map(amenity => (
              <button 
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-2 text-[10px] font-bold border transition-all uppercase tracking-wider ${selectedAmenities.includes(amenity) ? 'bg-volt text-black border-volt' : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}
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
