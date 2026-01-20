
import React, { useState, useEffect } from 'react';
import { Search, Plus, Ticket, Megaphone, Map, List, Filter, MapPin } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { Sport } from '../../lib/types';
import { SPORTS_ICONS } from '../../lib/constants';
import { MOCK_TURFS, MOCK_TOURNAMENTS } from '../../lib/mockData';
import TurfCard from '../../components/TurfCard';
import { TurfCardSkeleton } from '../../components/common/Skeleton';

const DiscoverScreen: React.FC = () => {
  const { openMatches, joinMatch } = useData();
  const { setActiveModal, showToast, setActiveTab } = useUI();
  const { user } = useAuth();
  
  const [discoverTab, setDiscoverTab] = useState<'turfs' | 'tournaments'>('turfs');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSport, setSelectedSport] = useState<Sport | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching delay for "Feel"
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleBookClick = (turf: any) => {
    setActiveModal('booking', { turf });
  };

  const handleJoinMatch = (matchId: string) => {
    if (user?.kyc_status !== 'VERIFIED') {
        showToast("Verify ID to join open matches", 'error');
        setActiveModal('kyc');
        return;
    }
    const match = openMatches.find(m => m.id === matchId);
    if (match?.joined_players.includes(user.id)) {
        showToast("You have already joined this match", 'error');
        return;
    }
    joinMatch(matchId);
    showToast("Joined match successfully!");
    setActiveTab('matches');
  };

  const callRinger = () => {
    showToast("📣 Ringer Alert sent to 15 nearby Pros!");
  };

  const registerTournament = () => {
    if(user?.wallet_balance && user.wallet_balance < 1500) {
       showToast("Insufficient wallet balance!", 'error');
       return;
    }
    showToast("Registered for Tournament!", 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-midnight dark:text-white mb-2">Discover</h2>
          <div className="flex gap-6 mt-2 relative">
              <button 
                 onClick={() => setDiscoverTab('turfs')}
                 className={`text-sm font-bold pb-2 border-b-2 transition-all ${discoverTab === 'turfs' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                 Turfs & Matches
              </button>
              <button 
                 onClick={() => setDiscoverTab('tournaments')}
                 className={`text-sm font-bold pb-2 border-b-2 transition-all ${discoverTab === 'tournaments' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              >
                 Tournaments
              </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
              type="text" 
              placeholder="Search venues..." 
              className="pl-12 pr-4 py-3 bg-white dark:bg-darkcard border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
           </div>
           {discoverTab === 'turfs' && (
             <div className="flex bg-white dark:bg-darkcard p-1 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700 text-midnight dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                   <List size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-gray-100 dark:bg-gray-700 text-midnight dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                   <Map size={20} />
                </button>
             </div>
           )}
        </div>
      </div>

      {discoverTab === 'turfs' ? (
        <>
            {/* Categories */}
            <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                <button 
                onClick={() => setSelectedSport('All')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm snap-start ${selectedSport === 'All' ? 'bg-midnight text-white ring-2 ring-midnight ring-offset-2 dark:ring-offset-darkbg' : 'bg-white dark:bg-darkcard text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:border-gray-300'}`}
                >
                All Sports
                </button>
                {Object.values(Sport).map(sport => (
                <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm flex items-center snap-start ${selectedSport === sport ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-darkbg' : 'bg-white dark:bg-darkcard text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:border-gray-300'}`}
                >
                    <span className="mr-2">{SPORTS_ICONS[sport]}</span> {sport}
                </button>
                ))}
            </div>

            {/* View Content */}
            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                      // Render Skeletons
                      Array(6).fill(0).map((_, i) => <TurfCardSkeleton key={i} />)
                    ) : (
                      MOCK_TURFS
                      .filter(t => selectedSport === 'All' || t.sports_supported.includes(selectedSport))
                      .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.location.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(turf => (
                          <TurfCard key={turf.id} turf={turf} onBook={() => handleBookClick(turf)} />
                      ))
                    )}
                </div>
            ) : (
                // Map View Placeholder
                <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl h-[500px] flex flex-col items-center justify-center relative overflow-hidden group">
                     {/* Fake Map Pattern */}
                     <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center" />
                     <div className="z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md p-8 rounded-2xl text-center shadow-2xl border border-white/20">
                        <Map size={48} className="mx-auto mb-4 text-blue-600" />
                        <h3 className="text-xl font-bold text-midnight dark:text-white">Map View</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Interactive map is coming in the next update.</p>
                        <button onClick={() => setViewMode('list')} className="bg-midnight dark:bg-white text-white dark:text-midnight px-6 py-2 rounded-xl font-bold">Switch to List</button>
                     </div>
                </div>
            )}

            {/* Open Matches Section */}
            <div className="pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-midnight dark:text-white flex items-center">
                    <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-1.5 rounded-lg mr-3 shadow-lg shadow-orange-500/20"><Plus size={20} /></span>
                    Open Matches
                    </h3>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {openMatches.map(match => {
                    const isJoined = match.joined_players.includes(user?.id || '');
                    const slotsLeft = match.required_players - match.joined_players.length;
                    
                    return (
                    <div key={match.id} className="bg-white dark:bg-darkcard p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group">
                        <div>
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md uppercase tracking-wider">{match.sport}</span>
                            <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">{new Date(match.start_time).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-bold text-lg text-midnight dark:text-white group-hover:text-blue-600 transition-colors">{match.turf?.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{match.turf?.location}</p>
                        
                        <div className="mt-5 flex items-center space-x-2">
                            <div className="flex -space-x-3">
                            {match.joined_players.slice(0, 3).map((pid, i) => (
                                <div key={pid} className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-2 border-white dark:border-darkcard flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300">
                                {pid.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-2">
                            +{match.joined_players.length} joined
                            </span>
                        </div>
                        </div>
                        
                        <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                        <div className="text-sm dark:text-gray-300">
                            <span className="font-bold text-midnight dark:text-white text-lg">{slotsLeft}</span> <span className="text-gray-400 text-xs uppercase font-bold">Slots Left</span>
                        </div>
                        <div className="flex gap-2">
                            {/* Ringer Alert Button */}
                            {slotsLeft > 0 && (
                                <button onClick={callRinger} className="p-2.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors" title="Find Ringer">
                                <Megaphone size={18} />
                                </button>
                            )}

                            {isJoined ? (
                                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center"><Ticket size={16} className="mr-2"/> Joined</span>
                            ) : (
                                <button 
                                onClick={() => handleJoinMatch(match.id)}
                                className="bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white text-midnight dark:text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                                >
                                Join Match
                                </button>
                            )}
                        </div>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>
        </>
      ) : (
          /* Tournament View */
          <div className="space-y-6 animate-fade-in-up">
              {MOCK_TOURNAMENTS.map(t => (
                  <div key={t.id} className="bg-white dark:bg-darkcard rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row group hover:shadow-xl transition-all duration-300">
                      <div className="md:w-1/3 h-56 md:h-auto relative overflow-hidden">
                          <img src={t.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={t.name}/>
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-midnight uppercase tracking-wider">
                              {t.sport}
                          </div>
                      </div>
                      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                          <div>
                              <div className="flex justify-between items-start">
                                  <h3 className="font-display font-bold text-2xl text-midnight dark:text-white mb-2">{t.name}</h3>
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1"><MapPin size={14}/> {t.location}</p>
                              
                              <div className="mt-6 flex gap-8 text-sm">
                                  <div className="text-center md:text-left">
                                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Prize Pool</p>
                                      <p className="font-black text-xl text-green-600 dark:text-green-400">₹{t.prize_pool.toLocaleString()}</p>
                                  </div>
                                  <div className="text-center md:text-left">
                                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Entry Fee</p>
                                      <p className="font-bold text-lg text-midnight dark:text-white">₹{t.entry_fee}</p>
                                  </div>
                                  <div className="text-center md:text-left">
                                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Start Date</p>
                                      <p className="font-bold text-lg text-midnight dark:text-white">{new Date(t.start_date).toLocaleDateString()}</p>
                                  </div>
                              </div>
                          </div>
                          <div className="mt-8 flex justify-between items-end border-t border-gray-50 dark:border-gray-800 pt-4">
                              <div>
                                  <p className="text-sm text-gray-500 mb-1"><span className="font-bold text-midnight dark:text-white">{t.registered_teams}/{t.max_teams}</span> Teams Registered</p>
                                  <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-600 rounded-full" style={{width: `${(t.registered_teams/t.max_teams)*100}%`}}></div>
                                  </div>
                              </div>
                              <button onClick={registerTournament} className="bg-midnight dark:bg-white text-white dark:text-midnight px-8 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-200/50 dark:shadow-none">Register Team</button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default DiscoverScreen;
