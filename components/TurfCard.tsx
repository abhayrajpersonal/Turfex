
import React, { useState } from 'react';
import { Star, MapPin, CheckCircle, Navigation, Heart } from 'lucide-react';
import { Turf } from '../lib/types';
import { useUI } from '../context/UIContext';

interface TurfCardProps {
  turf: Turf;
  onBook: (turf: Turf) => void;
}

const TurfCard: React.FC<TurfCardProps> = ({ turf, onBook }) => {
  const { setActiveModal } = useUI();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 overflow-hidden group hover:border-blue-500 dark:hover:border-volt/50 transition-all duration-300 relative flex flex-col h-full shadow-sm hover:shadow-xl rounded-2xl"
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={turf.images[0]} 
          alt={turf.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[10%] group-hover:grayscale-0"
        />
        {/* Soft fade gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
            {turf.is_verified && (
                <span className="bg-blue-600 dark:bg-volt text-white dark:text-black text-[10px] font-black px-2 py-1 uppercase tracking-wider flex items-center gap-1 rounded-md shadow-lg">
                    <CheckCircle size={10} fill="currentColor" className="text-white dark:text-black" /> Pro
                </span>
            )}
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider flex items-center gap-1 border border-white/20 rounded-md">
                <Star size={10} className="fill-yellow-400 text-yellow-400" /> {turf.rating}
            </span>
        </div>

        <button 
          onClick={toggleFavorite}
          className="absolute top-4 right-4 p-2 bg-black/40 text-white hover:text-red-500 hover:bg-black/60 transition-all backdrop-blur-md rounded-full"
        >
          <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display font-bold text-2xl text-white leading-none mb-2 tracking-wide uppercase italic drop-shadow-md">
                {turf.name}
            </h3>
            <div className="flex items-center text-gray-300 text-xs font-mono font-medium gap-4">
                <span className="flex items-center gap-1 truncate max-w-[150px]"><MapPin size={12} className="text-blue-400 dark:text-volt"/> {turf.location.split(',')[0]}</span>
                <span className="flex items-center gap-1"><Navigation size={12} className="text-blue-400 dark:text-volt"/> 2.4 km</span>
            </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="flex flex-wrap gap-2 mb-6">
          {turf.sports_supported.map((sport) => (
            <span key={sport} className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider border border-gray-200 dark:border-zinc-700 rounded-md">
              {sport}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
          <div>
            <span className="text-2xl font-display font-bold text-midnight dark:text-white">₹{turf.price_per_hour}</span>
            <span className="text-xs text-gray-400 font-bold uppercase ml-1">/ hr</span>
          </div>
          <button 
            onClick={() => onBook(turf)}
            className="bg-midnight dark:bg-white text-white dark:text-black text-xs font-bold px-6 py-3 uppercase tracking-wider hover:bg-black dark:hover:bg-gray-200 transition-colors rounded-xl shadow-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;
