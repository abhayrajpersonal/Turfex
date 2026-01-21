
import React, { useState, useMemo } from 'react';
import { Trophy, Crown, TrendingUp, TrendingDown, Flame, Swords, Globe, Users, Minus } from 'lucide-react';
import { MOCK_LEADERBOARD, MOCK_TEAMS, MOCK_USER } from '../../lib/mockData';
import { UserTier, Sport } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import CountUp from '../../components/common/CountUp';
import PodiumItem from './components/Podium';

// STABILIZATION: Move random generation outside component or use a seed.
// For this frontend demo, we generate it once at module level so it doesn't flicker on re-renders.
const ENHANCED_PLAYERS = MOCK_LEADERBOARD.map(item => ({
    ...item,
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
    trendValue: Math.floor(Math.random() * 5) + 1,
    streak: Math.floor(Math.random() * 15),
    isHot: Math.random() > 0.7
}));

const ENHANCED_TEAMS = MOCK_TEAMS.map(item => ({
    ...item,
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
    trendValue: Math.floor(Math.random() * 3) + 1,
    streak: Math.floor(Math.random() * 8),
    isHot: Math.random() > 0.8
}));

const LeaderboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useUI();
  
  // State
  const [leaderboardType, setLeaderboardType] = useState<'players' | 'teams'>('players');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');
  const [selectedSport, setSelectedSport] = useState<Sport | 'All'>('All');
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [showPointsTooltip, setShowPointsTooltip] = useState<string | null>(null);

  // Sorting Logic
  const displayData = useMemo(() => {
    let data = leaderboardType === 'players' ? [...ENHANCED_PLAYERS] : [...ENHANCED_TEAMS];

    // Filter Logic
    if (friendsOnly && leaderboardType === 'players') {
        data = data.slice(0, 3); // Mock filtering
    }

    // Sort Logic (Points or Wins)
    return data.sort((a: any, b: any) => {
        const scoreA = a.points ?? (a.wins ? a.wins * 3 : 0);
        const scoreB = b.points ?? (b.wins ? b.wins * 3 : 0);
        return scoreB - scoreA;
    });
  }, [leaderboardType, timeframe, selectedSport, friendsOnly]);

  const top3 = displayData.slice(0, 3);
  const rest = displayData.slice(3);

  // Find current user rank
  const currentUserRank = displayData.findIndex((i: any) => (i.user_id && i.user_id === user?.id) || (i.id && i.id === 'tm1')) + 1 || 42;
  const foundUserEntry = displayData.find((i: any) => (i.user_id && i.user_id === user?.id) || (i.id && i.id === 'tm1'));
  
  const currentUserData = foundUserEntry || {
      ...MOCK_USER,
      rank: currentUserRank,
      points: user?.turfex_points || 1250,
      trend: 'up',
      trendValue: 12
  };

  const handleChallenge = (opponentName: string) => {
      showToast(`Challenge sent to ${opponentName}! ⚔️`);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up pb-32">
      
      {/* Header & Controls */}
      <div className="mb-8 space-y-6">
        <div className="flex justify-between items-center">
             <h2 className="text-4xl font-display font-bold uppercase italic text-midnight dark:text-white tracking-tighter">
                 Rankings<span className="text-volt">.</span>
             </h2>
             
             {/* Friends Toggle */}
             <button 
                onClick={() => setFriendsOnly(!friendsOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all uppercase tracking-wider ${friendsOnly ? 'bg-volt text-black border-volt' : 'bg-transparent text-gray-500 border-gray-300 dark:border-zinc-700'}`}
             >
                 {friendsOnly ? <Users size={14} /> : <Globe size={14} />}
                 {friendsOnly ? 'Friends' : 'Global'}
             </button>
        </div>

        {/* Filters Row */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Type Toggle */}
            <div className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg flex shrink-0">
               <button onClick={() => setLeaderboardType('players')} className={`px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${leaderboardType === 'players' ? 'bg-white dark:bg-black text-midnight dark:text-white shadow-sm' : 'text-gray-500'}`}>Players</button>
               <button onClick={() => setLeaderboardType('teams')} className={`px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${leaderboardType === 'teams' ? 'bg-white dark:bg-black text-midnight dark:text-white shadow-sm' : 'text-gray-500'}`}>Teams</button>
            </div>

            {/* Timeframe */}
            <select 
               value={timeframe} 
               onChange={(e) => setTimeframe(e.target.value as any)}
               className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-midnight dark:text-white text-xs font-bold px-4 py-2 rounded-lg outline-none uppercase tracking-wide"
            >
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="all_time">All Time</option>
            </select>
        </div>
      </div>

      {/* Podium Section */}
      <div className="flex justify-center items-end gap-2 md:gap-4 mb-12 px-4 min-h-[280px]">
         {top3[1] && <PodiumItem item={top3[1]} place={2} />}
         {top3[0] && <PodiumItem item={top3[0]} place={1} />}
         {top3[2] && <PodiumItem item={top3[2]} place={3} />}
      </div>

      {/* List Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-none md:rounded-xl shadow-sm border-t md:border border-gray-200 dark:border-zinc-800 overflow-hidden relative z-0">
        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank & Player</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Points</span>
        </div>

        {rest.map((entry: any, index) => {
            const rank = index + 4;
            const isUser = entry.user_id === user?.id;
            
            return (
                <div key={entry.id || entry.user_id} className={`flex items-center p-4 border-b border-gray-100 dark:border-zinc-800 last:border-0 transition-colors ${isUser ? 'bg-blue-50/20 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>
                    {/* Rank */}
                    <div className="w-8 text-center mr-3 font-mono font-bold text-gray-400">
                        #{rank}
                    </div>

                    {/* Avatar */}
                    <div className="relative mr-4">
                        <img src={entry.avatar_url || entry.logo_url} alt={entry.username || entry.name} className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-zinc-700 grayscale hover:grayscale-0 transition-all" />
                        {entry.isHot && (
                            <div className="absolute -top-1 -right-1 bg-orange-500 text-white p-0.5 rounded-full border border-white dark:border-zinc-900">
                                <Flame size={8} fill="currentColor" />
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm truncate ${isUser ? 'text-blue-600 dark:text-blue-400' : 'text-midnight dark:text-white'}`}>{entry.username || entry.name}</h4>
                            {entry.tier === UserTier.GOLD && <Crown size={12} className="text-yellow-500 fill-yellow-500"/>}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                            {entry.trend === 'up' && <span className="text-[10px] font-bold text-green-500 flex items-center"><TrendingUp size={10} className="mr-0.5"/> {entry.trendValue}</span>}
                            {entry.trend === 'down' && <span className="text-[10px] font-bold text-red-500 flex items-center"><TrendingDown size={10} className="mr-0.5"/> {entry.trendValue}</span>}
                            <span className="text-[10px] text-gray-400">{entry.matches_played || 0} matches</span>
                        </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                        <span className="block font-black text-midnight dark:text-white text-lg leading-none tracking-tight"><CountUp end={entry.points || (entry.wins * 3)} /></span>
                    </div>
                </div>
            );
        })}
      </div>

      {/* Sticky "My Rank" Footer */}
      <div className="fixed bottom-24 md:bottom-8 left-0 right-0 px-4 md:px-0 z-40 flex justify-center pointer-events-none">
          <div className="bg-black text-white w-full max-w-xl rounded-xl shadow-2xl p-4 flex items-center justify-between pointer-events-auto border border-zinc-700 animate-slide-up">
              <div className="flex items-center gap-4">
                  <div className="text-center w-10">
                       <span className="text-[9px] text-zinc-500 uppercase font-bold">Rank</span>
                       <p className="text-xl font-mono font-bold leading-none text-volt">#{(currentUserData as any).rank || '-'}</p>
                  </div>
                  <div className="h-8 w-px bg-zinc-800"></div>
                  <div className="flex items-center gap-3">
                      <img src={(currentUserData as any).avatar_url || (currentUserData as any).logo_url || user?.avatar_url} className="w-10 h-10 rounded-full border border-zinc-600" />
                      <div>
                          <p className="font-bold text-sm">{(currentUserData as any).username || (currentUserData as any).name || 'You'}</p>
                          <p className="text-xs text-zinc-400">
                              {(currentUserData as any).points || 0} pts
                          </p>
                      </div>
                  </div>
              </div>
              <div className="text-right">
                   <button onClick={() => setFriendsOnly(!friendsOnly)} className="text-xs font-bold text-black bg-white px-3 py-1.5 rounded uppercase tracking-wider hover:bg-gray-200 transition-colors">
                       View Me
                   </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
