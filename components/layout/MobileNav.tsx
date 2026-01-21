
import React from 'react';
import { User, Calendar, MapPin, Gamepad2, ShoppingBag } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[40]">
        {/* Gradient Fade for content behind nav */}
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
        
        <div className="bg-black border-t border-white/10 px-2 py-2 flex justify-between items-center relative pb-safe-bottom">
            {['discover', 'matches', 'scoreboard', 'merch', 'social'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                aria-label={tab}
                className={`flex flex-col items-center justify-center w-1/5 relative z-10 outline-none active:scale-90 transition-all duration-200 py-3 ${activeTab === tab ? 'text-volt' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                {activeTab === tab && (
                   <span className="absolute top-0 w-8 h-0.5 bg-volt"></span>
                )}
                {tab === 'discover' && <MapPin size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />}
                {tab === 'matches' && <Calendar size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />}
                {tab === 'scoreboard' && <Gamepad2 size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />}
                {tab === 'merch' && <ShoppingBag size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />}
                {tab === 'social' && <User size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />}
              </button>
            ))}
        </div>
    </div>
  );
};

export default MobileNav;
