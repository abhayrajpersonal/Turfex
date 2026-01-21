
import React, { useState, useMemo } from 'react';
import { Trophy, Crown, TrendingUp, TrendingDown, Flame, Swords, Globe, Users, Minus } from 'lucide-react';
import { MOCK_LEADERBOARD, MOCK_TEAMS, MOCK_USER } from '../../lib/mockData';
import { UserTier, Sport } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import CountUp from '../../components/common/CountUp';
import PodiumItem from './components/Podium';

const LeaderboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useUI();
  
  // State
  const [leaderboardType, setLeaderboardType] = useState<'players' | 'teams'>('players');
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');
  const [selectedSport, setSelectedSport] = useState<Sport | 'All'>('All');
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [showPointsTooltip, setShowPointsTooltip] = useState<string | null>(null);

  // Enhanced Mock Data Generator (Simulating Trends & Streaks)
  const enhancedData = useMemo(() => {
    const baseData = leaderboardType === 'players' ? MOCK_LEADERBOARD : MOCK_TEAMS;
    
    // Simulate data shuffling for different timeframes/sports to make it feel alive
    let processed = [...baseData].map(item => ({
        ...item,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
        trendValue: Math.floor(Math.random() * 5) + 1,
        streak: Math.floor(Math.random() * 15),
        isHot: Math.random() > 0.7
    }));

    if (friendsOnly) {
        // Mock filtering friends - just taking a slice for demo
        processed = processed.slice(0, 3); 
    }

    return processed.sort((a: any, b: any) => {
        const scoreA = a.points ?? (a.wins ? a.wins * 3 : 0);
        const scoreB = b.points ?? (b.wins ? b.wins * 3 : 0);
        return scoreB - scoreA;
    });
  }, [leaderboardType, timeframe, selectedSport, friendsOnly]);

  const top3 = enhancedData.slice(0, 3);
  const rest = enhancedData.slice(3);

  // Find current user rank (Mocking it if not in list)
  const currentUserRank = enhancedData.findIndex((i: any) => (i.user_id && i.user_id === user?.id) || (i.id && i.id === 'tm1')) + 1 || 42;
  const foundUserEntry = enhancedData.find((i: any) => (i.user_id && i.user_id === user?.id) || (i.id && i.id === 'tm1'));
  
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
    <div className="max-w-2xl mx-auto animate-fade-in-up pb-32"> {/* Added extra padding bottom for sticky footer */}
      
      {/* Header & Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
             <h2 className="text-3xl font-bold font-display text-midnight dark:text-white flex items-center gap-2">
                 Leaderboard <Trophy className="text-yellow-500 fill-yellow-500 animate-pulse" />
             </h2>
             
             {/* Friends Toggle */}
             <button 
                onClick={() => setFriendsOnly(!friendsOnly)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${friendsOnly ? 'bg-electric text-white border-electric' : 'bg-white dark:bg-darkcard text-gray-500 border-gray-200 dark:border-gray-700'}`}
             >
                 {friendsOnly ? <Users size={14} /> : <Globe size={14} />}
                 {friendsOnly ? 'Friends' : 'Global'}
             </button>
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* Type Toggle */}
            <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex shrink-0">
               <button onClick={() => setLeaderboardType('players')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${leaderboardType === 'players' ? 'bg-white dark:bg-darkcard text-midnight dark:text-white shadow-sm' : 'text-gray-500'}`}>Players</button>
               <button onClick={() => setLeaderboardType('teams')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${leaderboardType === 'teams' ? 'bg-white dark:bg-darkcard text-midnight dark:text-white shadow-sm' : 'text-gray-500'}`}>Teams</button>
            </div>

            {/* Timeframe */}
            <select 
               value={timeframe} 
               onChange={(e) => setTimeframe(e.target.value as any)}
               className="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 text-midnight dark:text-white text-xs font-bold px-3 py-2 rounded-xl outline-none"
            >
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="all_time">All Time</option>
            </select>

            {/* Sport Filter */}
            <select 
               value={selectedSport} 
               onChange={(e) => setSelectedSport(e.target.value as any)}
               className="bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 text-midnight dark:text-white text-xs font-bold px-3 py-2 rounded-xl outline-none"
            >
                <option value="All">All Sports</option>
                {Object.values(Sport).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </div>

      {/* Podium Section */}
      <div className="flex justify-center items-end gap-2 md:gap-6 mb-10 px-4 min-h-[260px] pt-8">
         {top3[1] && <PodiumItem item={top3[1]} place={2} />}
         {top3[0] && <PodiumItem item={top3[0]} place={1} />}
         {top3[2] && <PodiumItem item={top3[2]} place={3} />}
      </div>

      {/* List Section */}
      <div className="bg-white dark:bg-darkcard rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative z-0">
        <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rank</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Points</span>
        </div>

        {rest.map((entry: any, index) => {
            const rank = index + 4;
            const isUser = entry.user_id === user?.id;
            
            return (
                <div key={entry.id || entry.user_id} className={`flex items-center p-4 border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors ${isUser ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                    {/* Rank & Trend */}
                    <div className="w-12 text-center mr-2 flex flex-col items-center justify-center">
                        <span className="font-black text-gray-500 text-sm">#{rank}</span>
                        {entry.trend === 'up' && <span className="text-[10px] font-bold text-green-500 flex items-center"><TrendingUp size={10} className="mr-0.5"/> {entry.trendValue}</span>}
                        {entry.trend === 'down' && <span className="text-[10px] font-bold text-red-500 flex items-center"><TrendingDown size={10} className="mr-0.5"/> {entry.trendValue}</span>}
                        {entry.trend === 'stable' && <span className="text-[10px] font-bold text-gray-400 flex items-center"><Minus size={10} className="mr-0.5"/></span>}
                    </div>

                    {/* Avatar */}
                    <div className="relative mr-4">
                        <img src={entry.avatar_url || entry.logo_url} alt={entry.username || entry.name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
                        {entry.isHot && (
                            <div className="absolute -top-1 -right-1 bg-orange-500 text-white p-0.5 rounded-full border border-white dark:border-darkcard">
                                <Flame size={10} fill="currentColor" />
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm ${isUser ? 'text-electric' : 'text-midnight dark:text-white'}`}>{entry.username || entry.name}</h4>
                            {entry.tier === UserTier.GOLD && <Crown size={12} className="text-yellow-500 fill-yellow-500"/>}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            {entry.matches_played || 0} matches
                            {entry.streak > 3 && <span className="text-orange-500 font-bold">🔥 {entry.streak} streak</span>}
                        </p>
                    </div>

                    {/* Points & Action */}
                    <div className="text-right flex items-center gap-4">
                        <div 
                            className="relative cursor-pointer group"
                            onClick={() => setShowPointsTooltip(showPointsTooltip === entry.user_id ? null : entry.user_id)}
                        >
                            <span className="block font-black text-electric text-lg"><CountUp end={entry.points || (entry.wins * 3)} /></span>
                            
                            {/* Points Breakdown Tooltip */}
                            {showPointsTooltip === (entry.user_id || entry.id) && (
                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 text-white text-xs p-3 rounded-xl shadow-xl z-50 animate-scale-in">
                                    <div className="flex justify-between mb-1"><span>Match Wins</span> <span className="font-bold text-green-400">+500</span></div>
                                    <div className="flex justify-between mb-1"><span>MVP Awards</span> <span className="font-bold text-yellow-400">+200</span></div>
                                    <div className="flex justify-between"><span>Reliability</span> <span className="font-bold text-blue-400">+50</span></div>
                                    <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-black/90 rotate-45"></div>
                                </div>
                            )}
                        </div>

                        {!isUser && (
                            <button 
                                onClick={() => handleChallenge(entry.username || entry.name)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 text-midnight dark:text-white rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <Swords size={18} />
                            </button>
                        )}
                    </div>
                </div>
            );
        })}
      </div>

      {/* Sticky "My Rank" Footer */}
      <div className="fixed bottom-24 md:bottom-8 left-0 right-0 px-4 md:px-0 z-40 flex justify-center pointer-events-none">
          <div className="bg-midnight dark:bg-white text-white dark:text-midnight w-full max-w-2xl rounded-2xl shadow-2xl p-4 flex items-center justify-between pointer-events-auto border border-white/10 dark:border-gray-200 animate-slide-up">
              <div className="flex items-center gap-4">
                  <div className="text-center">
                       <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold">My Rank</span>
                       <p className="text-xl font-black leading-none">#{(currentUserData as any).rank || '-'}</p>
                  </div>
                  <div className="h-8 w-px bg-white/20 dark:bg-black/10"></div>
                  <div className="flex items-center gap-3">
                      <img src={(currentUserData as any).avatar_url || (currentUserData as any).logo_url || user?.avatar_url} className="w-10 h-10 rounded-full border-2 border-electric" />
                      <div>
                          <p className="font-bold text-sm">{(currentUserData as any).username || (currentUserData as any).name || 'You'}</p>
                          <p className="text-xs opacity-70 flex items-center gap-1">
                              {(currentUserData as any).trend === 'up' ? <TrendingUp size={12} className="text-green-400"/> : <TrendingDown size={12} className="text-red-400"/>}
                              {(currentUserData as any).trend === 'up' ? 'Climbing' : 'Sliding'}
                          </p>
                      </div>
                  </div>
              </div>
              <div className="text-right">
                   <p className="text-2xl font-black text-electric"><CountUp end={(currentUserData as any).points || ((currentUserData as any).wins ? (currentUserData as any).wins * 3 : 0) || 0} /></p>
                   <p className="text-[10px] opacity-60 uppercase font-bold">Total Points</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
