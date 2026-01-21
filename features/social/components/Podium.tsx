
import React from 'react';
import { Crown, Medal, Flame } from 'lucide-react';

interface PodiumItemProps {
  item: any;
  place: number;
}

const PodiumItem: React.FC<PodiumItemProps> = ({ item, place }) => {
  const isFirst = place === 1;
  const height = isFirst ? 'h-64' : 'h-48';
  
  const borderColor = (place: number) => isNaN(place) ? 'border-gray-200' : place === 1 ? 'border-yellow-400' : place === 2 ? 'border-zinc-400' : 'border-orange-700';
  const badgeColor = (place: number) => place === 1 ? 'bg-yellow-500 text-black' : place === 2 ? 'bg-zinc-400 text-black' : 'bg-orange-600 text-white';

  // Gradients for podium
  const podiumClass = isFirst 
      ? 'bg-gradient-to-b from-yellow-400/90 via-yellow-500/60 to-yellow-600/30 border-t-4 border-yellow-400' 
      : place === 2 
          ? 'bg-gradient-to-b from-zinc-300/80 via-zinc-400/50 to-zinc-500/20 border-t-4 border-zinc-300' 
          : 'bg-gradient-to-b from-orange-500/80 via-orange-600/50 to-orange-700/20 border-t-4 border-orange-500';
          
  const icon = isFirst ? <Crown className="text-yellow-200 drop-shadow-lg" size={40} fill="currentColor" /> : <Medal className="text-white/80 drop-shadow-md" size={28} />;
  
  // Stronger glow for #1
  const avatarGlow = isFirst ? 'shadow-[0_0_30px_rgba(250,204,21,0.5)]' : 'shadow-lg';

  return (
    <div className={`flex flex-col items-center justify-end ${isFirst ? '-mt-16 z-10' : 'z-0'} animate-fade-in-up transition-transform hover:scale-105 duration-300 relative`}>
      {/* Spotlight Effect for #1 */}
      {isFirst && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-500/20 blur-[50px] rounded-full pointer-events-none"></div>}

      <div className="relative mb-4 group">
          <div className={`w-16 h-16 md:w-28 md:h-28 rounded-full border-4 p-1 bg-black ${borderColor(place)} ${avatarGlow} transition-all relative z-10`}>
              <img src={item.avatar_url || item.logo_url} alt={item.username || item.name} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-4 border-black shadow-xl font-black text-sm z-20 ${badgeColor(place)}`}>
              {place}
          </div>
          {/* Hot Streak Badge on Podium */}
          {item.isHot && (
              <div className="absolute -top-2 -right-2 bg-orange-600 text-white p-1.5 rounded-full border-4 border-black z-20 animate-bounce">
                  <Flame size={14} fill="currentColor" />
              </div>
          )}
      </div>
      
      <div className="text-center mb-3 relative z-10">
          <p className="font-bold text-midnight dark:text-white text-base truncate w-28 drop-shadow-md">{item.username || item.name}</p>
          <p className="text-[10px] uppercase font-black text-volt tracking-widest bg-black/60 px-2 py-0.5 rounded-full inline-block backdrop-blur-sm border border-white/10 mt-1">{item.points || (item.wins * 3)} PTS</p>
      </div>

      <div className={`w-24 md:w-36 ${height} ${podiumClass} backdrop-blur-md rounded-t-2xl flex items-end justify-center pb-8 shadow-2xl relative overflow-hidden`}>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 to-transparent"></div>
           <div className="relative z-10 transform translate-y-2">
             {icon}
           </div>
      </div>
    </div>
  );
};

export default PodiumItem;
