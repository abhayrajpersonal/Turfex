
import React from 'react';
import { MapPin, MessageCircle } from 'lucide-react';
import { RentalItem } from '../../../lib/types';

interface RentalCardProps {
  item: RentalItem;
  onContact: (item: RentalItem) => void;
}

const RentalCard: React.FC<RentalCardProps> = ({ item, onContact }) => {
  return (
    <div className="bg-white dark:bg-darkcard rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img 
          src={item.image_url} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-midnight shadow-sm flex items-center gap-1">
            <MapPin size={10} className="text-electric" /> {item.distance_km} km away
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <img src={item.owner_avatar} className="w-6 h-6 rounded-full border border-white" alt={item.owner_name} />
            <span className="text-xs font-bold text-white shadow-sm bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">{item.owner_name}</span>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{item.category}</p>
        <h3 className="font-bold text-midnight dark:text-white text-base leading-tight mb-1">{item.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">{item.description}</p>
        
        <div className="flex items-center justify-between mt-auto border-t border-gray-100 dark:border-gray-800 pt-3">
           <div>
              <span className="text-lg font-black text-midnight dark:text-white">₹{item.daily_rate}</span>
              <span className="text-xs text-gray-400">/day</span>
           </div>
           <button 
             onClick={() => onContact(item)}
             className="bg-electric/10 text-electric hover:bg-electric hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
           >
             <MessageCircle size={14} /> Contact
           </button>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
