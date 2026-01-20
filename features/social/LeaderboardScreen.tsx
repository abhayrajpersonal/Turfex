
import React, { useState } from 'react';
import { Trophy, Crown, Medal } from 'lucide-react';
import { MOCK_LEADERBOARD, MOCK_TEAMS } from '../../lib/mockData';
import { UserTier } from '../../lib/types';

const LeaderboardScreen: React.FC = () => {
  const [leaderboardType, setLeaderboardType] = useState<'players' | 'teams'>('players');

  const data = leaderboardType === 'players' ? MOCK_LEADERBOARD : MOCK_TEAMS;
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const PodiumItem = ({ item, place }: { item: any, place: number }) => {
    const isFirst = place === 1;
    const height = isFirst ? 'h-48' : 'h-36';
    const color = isFirst ? 'bg-yellow-400' : place === 2 ? 'bg-gray-300' : 'bg-orange-400';
    const borderColor = isFirst ? 'border-yellow-400' : place === 2 ? 'border-gray-300' : 'border-orange-400';
    const icon = isFirst ? <Crown className="text-white" size={24} /> : <Medal className="text-white" size={20} />;

    return (
      <div className={`flex flex-col items-center justify-end ${isFirst ? '-mt-8 z-10' : ''}`}>
        <div className="relative mb-3">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${borderColor} p-1 bg-white dark:bg-darkcard`}>
                <img src={item.avatar_url || item.logo_url} alt={item.username || item.name} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${color} flex items-center justify-center border-2 border-white dark:border-darkcard shadow-sm`}>
                <span className="font-bold text-white text-sm">{place}</span>
            </div>
        </div>
        
        <div className="text-center mb-2">
            <p className="font-bold text-midnight dark:text-white text-sm truncate w-24">{item.username || item.name}</p>
            <p className="text-xs text-electric font-bold">{item.points || (item.wins * 3)} pts</p>
        </div>

        <div className={`w-24 md:w-28 ${height} ${color} bg-opacity-20 dark:bg-opacity-20 rounded-t-2xl flex items-end justify-center pb-4`}>
             {icon}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up pb-20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-display text-midnight dark:text-white">Leaderboard</h2>
        <div className="flex justify-center mt-4">
           <div className="bg-white dark:bg-darkcard p-1 rounded-lg border border-gray-200 dark:border-gray-700 flex gap-1 shadow-sm">
              <button 
                onClick={() => setLeaderboardType('players')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${leaderboardType === 'players' ? 'bg-electric text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                Players
              </button>
              <button 
                onClick={() => setLeaderboardType('teams')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${leaderboardType === 'teams' ? 'bg-electric text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                Teams
              </button>
           </div>
        </div>
      </div>

      {/* Podium Section */}
      <div className="flex justify-center items-end gap-2 md:gap-8 mb-8 px-4 min-h-[250px]">
         {top3[1] && <PodiumItem item={top3[1]} place={2} />}
         {top3[0] && <PodiumItem item={top3[0]} place={1} />}
         {top3[2] && <PodiumItem item={top3[2]} place={3} />}
      </div>

      {/* List Section */}
      <div className="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {leaderboardType === 'players' ? (
          rest.map((entry: any, index) => (
            <div key={entry.user_id} className="flex items-center p-4 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
               <div className="w-8 font-bold text-gray-400 text-center mr-4">
                 #{entry.rank}
               </div>
               <img src={entry.avatar_url} alt={entry.username} className="w-10 h-10 rounded-full object-cover mr-4" />
               <div className="flex-1">
                 <div className="flex items-center gap-2">
                   <h4 className="font-bold text-midnight dark:text-white text-sm">{entry.username}</h4>
                   {entry.tier === UserTier.GOLD && <Crown size={12} className="text-yellow-500 fill-yellow-500"/>}
                 </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{entry.matches_played} matches played</p>
               </div>
               <div className="text-right">
                 <span className="block font-bold text-electric">{entry.points}</span>
                 <span className="text-[10px] text-gray-400 uppercase font-medium">Points</span>
               </div>
            </div>
          ))
        ) : (
          rest.map((team: any, index) => (
             <div key={team.id} className="flex items-center p-4 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
               <div className="w-8 font-bold text-gray-400 text-center mr-4">#{index + 4}</div>
               <img src={team.logo_url} className="w-10 h-10 rounded-lg object-cover mr-4 bg-gray-100" />
               <div className="flex-1">
                 <h4 className="font-bold text-midnight dark:text-white text-sm">{team.name}</h4>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{team.city} • {team.wins} Wins</p>
               </div>
               <div className="text-right">
                 <span className="block font-bold text-electric">{team.wins * 3}</span>
                 <span className="text-[10px] text-gray-400 uppercase font-medium">Pts</span>
               </div>
             </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;
