
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
      // Simulate opening chat with a new context
      setIsChatOpen(true);
      showToast(`Chat started with ${item.owner_name} about renting ${item.name}`, 'success');
  };

  const handleListGear = () => {
      showToast("Listing flow coming soon!", "success");
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      {/* Sticky Header - Fixed overlap on mobile by adding top-[72px] */}
      <div className="sticky top-[72px] md:top-0 bg-offwhite/95 dark:bg-darkbg/95 backdrop-blur-md z-30 pt-4 pb-4 -mt-4 border-b border-gray-200/50 dark:border-gray-800/50">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-display font-black text-midnight dark:text-white">Turfex Store</h2>
            <button 
              onClick={() => setActiveModal('cart')}
              className="relative p-2 bg-white dark:bg-darkcard rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
               <ShoppingBag size={20} className="text-midnight dark:text-white" />
               {cart.length > 0 && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-electric text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-scale-in">
                   {cart.length}
                 </span>
               )}
            </button>
         </div>

         {/* Mode Toggle */}
         <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-4 max-w-sm">
             <button 
               onClick={() => setStoreMode('buy')}
               className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${storeMode === 'buy' ? 'bg-white dark:bg-darkcard text-midnight dark:text-white shadow-sm' : 'text-gray-500'}`}
             >
                 Buy New
             </button>
             <button 
               onClick={() => setStoreMode('rent')}
               className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${storeMode === 'rent' ? 'bg-white dark:bg-darkcard text-midnight dark:text-white shadow-sm' : 'text-gray-500'}`}
             >
                 <Repeat size={12}/> Rent (P2P)
             </button>
         </div>

         {storeMode === 'buy' && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-midnight dark:bg-white text-white dark:text-midnight shadow-lg' : 'bg-white dark:bg-darkcard text-gray-500 border border-gray-100 dark:border-gray-700'}`}
                >
                    {cat}
                </button>
                ))}
            </div>
         )}
      </div>

      {/* Hero Banner (Only for Buy Mode) */}
      {storeMode === 'buy' ? (
        <div className="relative rounded-3xl overflow-hidden h-64 md:h-80 shadow-2xl group">
            <img 
            src="https://images.unsplash.com/photo-1511886929837-354d827aae26?w=1200&auto=format&fit=crop&q=80" 
            alt="New Drop" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
                <span className="bg-electric text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider mb-3 inline-block">Season 2 Collection</span>
                <h3 className="text-3xl md:text-5xl font-display font-black text-white mb-2 leading-tight">Dominate the<br/>Turf in Style.</h3>
                <button className="bg-white text-midnight px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform mt-2">Shop The Collection</button>
            </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex items-center justify-between">
             <div className="relative z-10">
                 <h3 className="text-2xl font-bold font-display mb-2">Got spare gear?</h3>
                 <p className="text-sm opacity-90 mb-4 max-w-xs">Rent out your bats, rackets, or shoes to nearby players and earn cash.</p>
                 <button 
                   onClick={handleListGear}
                   className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors"
                 >
                     <Plus size={16}/> List Your Gear
                 </button>
             </div>
             <Repeat size={120} className="absolute -right-6 -bottom-6 opacity-20 rotate-12" />
        </div>
      )}

      {/* Grid */}
      <div>
         <h3 className="text-xl font-bold text-midnight dark:text-white mb-6 flex items-center gap-2">
            <Tag size={20} className="text-electric" /> 
            {storeMode === 'buy' ? (selectedCategory === 'All' ? 'Trending Gear' : `${selectedCategory}`) : 'Nearby Rentals'}
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
            <div className="text-center py-20">
               <p className="text-gray-400 font-medium">No items found.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default MerchScreen;
