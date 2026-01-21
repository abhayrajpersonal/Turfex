
import React from 'react';
import { User, Calendar, MapPin, Gamepad2, ShoppingBag } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-[40]">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-black/20 px-2 py-3 flex justify-between items-center relative overflow-hidden">
            {['discover', 'matches', 'scoreboard', 'merch', 'social'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                aria-label={tab}
                className={`flex flex-col items-center justify-center w-1/5 relative z-10 outline-none active:scale-90 transition-all duration-300 ${activeTab === tab ? 'text-electric -translate-y-1' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {activeTab === tab && (
                   <div className="absolute inset-0 bg-electric/10 rounded-xl -z-10 scale-125"></div>
                )}
                {tab === 'discover' && <MapPin size={activeTab === tab ? 24 : 22} className={activeTab === tab ? 'fill-current' : ''} />}
                {tab === 'matches' && <Calendar size={activeTab === tab ? 24 : 22} className={activeTab === tab ? 'fill-current' : ''} />}
                {tab === 'scoreboard' && <Gamepad2 size={activeTab === tab ? 24 : 24} className={activeTab === tab ? 'fill-current' : ''} />}
                {tab === 'merch' && <ShoppingBag size={activeTab === tab ? 24 : 22} className={activeTab === tab ? 'fill-current' : ''} />}
                {tab === 'social' && <User size={activeTab === tab ? 24 : 22} className={activeTab === tab ? 'fill-current' : ''} />}
              </button>
            ))}
        </div>
    </div>
  );
};

export default MobileNav;
