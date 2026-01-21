
import React, { useState } from 'react';
import { Search, ShoppingBag, Filter, Tag, Repeat, Plus } from 'lucide-react';
import { MOCK_MERCH_ITEMS, MOCK_RENTALS } from '../../lib/mockData';
import ProductCard from './components/ProductCard';
import RentalCard from './components/RentalCard';
import { useUI } from '../../context/UIContext';
import { useData } from '../../context/DataContext';

const CATEGORIES = ['All', 'Apparel', 'Equipment', 'Accessories'];

const MerchScreen: React.FC = () => {
  const { setActiveModal, showToast, setIsChatOpen } = useUI();
  const { cart } = useData();
  const [storeMode, setStoreMode] = useState<'buy' | 'rent'>('buy');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filteredItems = storeMode === 'buy' 
    ? MOCK_MERCH_ITEMS.filter(item => {
        const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      })
    : MOCK_RENTALS.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

  const handleProductClick = (item: any) => {
    setActiveModal('product_details', item);
  };

  const handleContactOwner = (item: any) => {
      setIsChatOpen(true);
      showToast(`Chat started with ${item.owner_name}`, 'success');
  };

  const handleListGear = () => {
      showToast("Listing flow coming soon!", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      {/* Sticky Header */}
      <div className="sticky top-[72px] md:top-0 bg-offwhite/95 dark:bg-black/95 backdrop-blur-md z-30 pt-4 pb-4 -mt-4 border-b border-gray-200/50 dark:border-white/10">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-display font-black text-midnight dark:text-white uppercase italic tracking-tighter">
                Store<span className="text-volt">.</span>
            </h2>
            <button 
              onClick={() => setActiveModal('cart')}
              className="relative p-2 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-volt transition-colors"
            >
               <ShoppingBag size={20} className="text-midnight dark:text-white" />
               {cart.length > 0 && (
                 <span className="absolute -top-2 -right-2 w-5 h-5 bg-volt text-black text-[10px] font-black flex items-center justify-center rounded-full animate-scale-in border-2 border-white dark:border-black">
                   {cart.length}
                 </span>
               )}
            </button>
         </div>

         {/* Mode Toggle */}
         <div className="flex bg-gray-200 dark:bg-zinc-900 p-1 rounded-lg mb-4 max-w-sm">
             <button 
               onClick={() => setStoreMode('buy')}
               className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${storeMode === 'buy' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-gray-500'}`}
             >
                 Official Merch
             </button>
             <button 
               onClick={() => setStoreMode('rent')}
               className={`flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${storeMode === 'rent' ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm' : 'text-gray-500'}`}
             >
                 <Repeat size={12}/> P2P Rentals
             </button>
         </div>

         {storeMode === 'buy' && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-black dark:bg-white text-white dark:text-black border-transparent' : 'bg-transparent text-gray-500 border-gray-300 dark:border-zinc-700 hover:border-gray-400'}`}
                >
                    {cat}
                </button>
                ))}
            </div>
         )}
      </div>

      {/* Hero Banner (Only for Buy Mode) */}
      {storeMode === 'buy' ? (
        <div className="relative rounded-xl overflow-hidden h-64 md:h-80 shadow-2xl group border border-white/10">
            <img 
            src="https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1200&auto=format&fit=crop&q=80" 
            alt="New Drop" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
                <span className="bg-volt text-black px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-3 inline-block">Season 2 Drop</span>
                <h3 className="text-4xl md:text-6xl font-display font-black text-white mb-2 leading-none italic uppercase">Unleash<br/>Speed.</h3>
                <button className="bg-white text-black px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors mt-4">
                    Shop Collection
                </button>
            </div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-white relative overflow-hidden flex items-center justify-between">
             <div className="relative z-10">
                 <h3 className="text-2xl font-display font-bold mb-2 uppercase">Monetize your gear</h3>
                 <p className="text-sm text-zinc-400 mb-6 max-w-xs">Rent out your spare bats, rackets, or shoes to nearby players safely.</p>
                 <button 
                   onClick={handleListGear}
                   className="bg-white text-black px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-gray-200 transition-colors"
                 >
                     <Plus size={16}/> List Item
                 </button>
             </div>
             <Repeat size={120} className="absolute -right-6 -bottom-6 text-zinc-800 rotate-12" />
        </div>
      )}

      {/* Grid */}
      <div>
         <h3 className="text-lg font-bold text-midnight dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
            {storeMode === 'buy' ? (selectedCategory === 'All' ? 'Trending' : `${selectedCategory}`) : 'Nearby'}
         </h3>
         
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {storeMode === 'buy' ? (
                filteredItems.map(item => (
                    <ProductCard key={item.id} item={item as any} onAddToCart={() => handleProductClick(item)} />
                ))
            ) : (
                filteredItems.map(item => (
                    <RentalCard key={item.id} item={item as any} onContact={handleContactOwner} />
                ))
            )}
         </div>
         
         {filteredItems.length === 0 && (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
               <p className="text-zinc-500 font-medium">No items found.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default MerchScreen;
