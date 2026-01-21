
import React from 'react';
import { Star, ShoppingBag, Plus } from 'lucide-react';
import { MerchItem } from '../../../lib/types';

interface ProductCardProps {
  item: MerchItem;
  onAddToCart: (item: MerchItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart }) => {
  return (
    <div 
      onClick={() => onAddToCart(item)}
      className="bg-white dark:bg-darkcard rounded-2xl border border-gray-100 dark:border-white/5 dark:bg-gradient-to-b dark:from-white/5 dark:to-transparent overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-t-2xl">
        <img 
          src={item.image_url} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {item.is_new && (
          <span className="absolute top-3 left-3 bg-electric text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-md border border-white/20">New Drop</span>
        )}
        {item.is_bestseller && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-md border border-white/20">Best Seller</span>
        )}
        {item.original_price && (
          <span className="absolute bottom-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md font-mono border border-white/20">
            {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
          </span>
        )}
        {/* UPDATED: opacity-100 by default on mobile, md:opacity-0 to hide on desktop until hover */}
        <button 
          className="absolute bottom-3 right-3 bg-white dark:bg-midnight text-midnight dark:text-white p-2 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-[0.9] active:brightness-90"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
           <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{item.category}</p>
           <div className="flex items-center gap-1 text-[10px] font-bold bg-gradient-to-r from-yellow-500/10 to-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/20">
              <Star size={10} className="fill-current" /> {item.rating}
           </div>
        </div>
        <h3 className="font-bold text-midnight dark:text-white text-base leading-tight mb-1 group-hover:text-electric transition-colors tracking-tight">{item.name}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">{item.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
           <div>
              <span className="text-lg font-black text-midnight dark:text-white font-mono">₹{item.price}</span>
              {item.original_price && (
                <span className="text-xs text-gray-400 line-through ml-2 font-mono">₹{item.original_price}</span>
              )}
           </div>
           {item.colors && (
             <div className="flex -space-x-1">
                {item.colors.map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border border-white dark:border-darkcard shadow-sm" style={{ backgroundColor: c }}></div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
