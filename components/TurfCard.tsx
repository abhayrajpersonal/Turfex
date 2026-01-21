
import React, { useState } from 'react';
import { Star, MapPin, CheckCircle, Cloud, Sun, CloudRain, Navigation, Heart } from 'lucide-react';
import { Turf } from '../lib/types';
import { SPORTS_ICONS } from '../lib/constants';

interface TurfCardProps {
  turf: Turf;
  onBook: (turf: Turf) => void;
}

const TurfCard: React.FC<TurfCardProps> = ({ turf, onBook }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400); // Extended for spring effect
  };

  return (
    <div 
      className="bg-white dark:bg-darkcard rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 dark:bg-gradient-to-b dark:from-white/5 dark:to-transparent overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 transition-all duration-300 group hover:-translate-y-1 relative focus-within:ring-2 focus-within:ring-electric"
    >
      <div className="relative h-48 overflow-hidden rounded-t-3xl">
        <img 
          src={turf.images[0]} 
          alt={turf.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent opacity-60" aria-hidden="true" />

        {/* Favorite Button with Micro-Animation */}
        <button 
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all active:scale-90 outline-none focus-visible:ring-2 focus-visible:ring-white min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/20"
        >
          <Heart 
            size={20} 
            className={`transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} ${isAnimating ? 'scale-150' : 'scale-100'}`} 
            aria-hidden="true"
          />
        </button>
        
        {/* Rating Badge - Semantic Gradient */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-midnight flex items-center shadow-sm" aria-label={`Rating ${turf.rating} stars`}>
                <span className="text-xs mr-1 font-mono">{turf.rating}</span>
                <Star size={10} className="text-sparklime fill-sparklime" aria-hidden="true" />
            </div>
             {/* Verified Badge */}
            {turf.is_verified && (
            <div className="bg-gradient-to-r from-turfgreen/90 to-emerald-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] uppercase font-bold tracking-widest text-white flex items-center shadow-sm gap-1 border border-white/10" aria-label="Verified Turf">
                <CheckCircle size={10} className="text-white" aria-hidden="true" />
                Verified
            </div>
            )}
        </div>
        
        {/* Distance Badge */}
        <div className="absolute bottom-3 left-3 bg-midnight/40 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium text-white flex items-center border border-white/20" aria-label="Distance: 2.4 kilometers">
             <Navigation size={10} className="mr-1 text-sparklime" aria-hidden="true" />
             <span className="font-mono">2.4 km</span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-bold text-xl text-midnight dark:text-white leading-tight flex items-center gap-1 group-hover:text-electric transition-colors tracking-tight">
            {turf.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-courtgray dark:text-gray-400 text-xs font-medium tracking-wide">
            <MapPin size={12} className="mr-1" aria-hidden="true" />
            {turf.location}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Supported sports">
          {turf.sports_supported.map((sport) => (
            <span key={sport} role="listitem" className="inline-flex items-center px-2.5 py-1 bg-offwhite dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-300 font-bold border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform cursor-default tracking-wide uppercase">
              <span className="mr-1.5" aria-hidden="true">{SPORTS_ICONS[sport]}</span> {sport}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
          <div>
            <span className="text-xl font-black text-midnight dark:text-white tabular-nums font-mono">₹{turf.price_per_hour}</span>
            <span className="text-xs text-courtgray font-medium uppercase tracking-wider ml-1">/ hour</span>
          </div>
          <button 
            onClick={() => onBook(turf)}
            aria-label={`Book ${turf.name} for ₹${turf.price_per_hour} per hour`}
            className="bg-electric text-white hover:bg-blue-600 text-sm font-bold px-6 py-3 rounded-2xl transition-all active:scale-[0.98] active:brightness-110 shadow-[0_8px_30px_rgb(0,87,255,0.3)] hover:shadow-[0_8px_35px_rgb(0,87,255,0.4)] outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 dark:focus-visible:ring-offset-darkcard min-h-[44px]"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;
