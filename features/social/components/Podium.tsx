
import React from 'react';
import { Crown, Medal, Flame } from 'lucide-react';

interface PodiumItemProps {
  item: any;
  place: number;
}

const PodiumItem: React.FC<PodiumItemProps> = ({ item, place }) => {
  const isFirst = place === 1;
  const height = isFirst ? 'h-48' : 'h-36';
  
  const borderColor = (place: number) => isNaN(place) ? 'border-gray-200' : place === 1 ? 'border-yellow-400' : place === 2 ? 'border-gray-300' : 'border-orange-400';
  const badgeColor = (place: number) => place === 1 ? 'bg-yellow-500' : place === 2 ? 'bg-gray-400' : 'bg-orange-500';

  // Gradients for podium
  const colorClass = isFirst 
      ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-400' 
      : place === 2 
          ? 'bg-gradient-to-b from-gray-300 to-gray-400 border-gray-300' 
          : 'bg-gradient-to-b from-orange-300 to-orange-500 border-orange-400';
          
  const icon = isFirst ? <Crown className="text-white drop-shadow-md" size={32} /> : <Medal className="text-white drop-shadow-md" size={24} />;
  const glow = isFirst ? 'shadow-[0_0_30px_rgba(234,179,8,0.6)]' : '';

  return (
    <div className={`flex flex-col items-center justify-end ${isFirst ? '-mt-12 z-10' : 'z-0'} animate-fade-in-up transition-transform hover:scale-105 duration-300`}>
      <div className="relative mb-3 group">
          <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-4 p-1 bg-white dark:bg-darkcard ${borderColor(place)} ${glow} transition-all`}>
              <img src={item.avatar_url || item.logo_url} alt={item.username || item.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-darkcard shadow-sm font-black text-xs text-white ${badgeColor(place)}`}>
              {place}
          </div>
          {/* Hot Streak Badge on Podium */}
          {item.isHot && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white p-1 rounded-full border-2 border-white dark:border-darkcard animate-bounce">
                  <Flame size={12} fill="currentColor" />
              </div>
          )}
      </div>
      
      <div className="text-center mb-2">
          <p className="font-bold text-midnight dark:text-white text-sm truncate w-24">{item.username || item.name}</p>
          <p className="text-xs text-electric font-black">{item.points || (item.wins * 3)} pts</p>
      </div>

      <div className={`w-24 md:w-32 ${height} ${colorClass} rounded-t-2xl flex items-end justify-center pb-4 shadow-xl relative overflow-hidden`}>
           <div className="absolute inset-0 bg-white/10 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           {icon}
      </div>
    </div>
  );
};

export default PodiumItem;
