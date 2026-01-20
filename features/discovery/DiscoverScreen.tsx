
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Ticket, Megaphone, Map, List, Filter, MapPin, X, Activity } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { Sport } from '../../lib/types';
import { SPORTS_ICONS } from '../../lib/constants';
import { MOCK_TURFS, MOCK_TOURNAMENTS } from '../../lib/mockData';
import TurfCard from '../../components/TurfCard';
import { TurfCardSkeleton } from '../../components/common/Skeleton';
import MapComponent from '../../components/common/MapComponent';
import { debounce } from '../../lib/utils';

const DiscoverScreen: React.FC = () => {
  const { openMatches, joinMatch } = useData();
  const { setActiveModal, showToast, setActiveTab } = useUI();
  const { user } = useAuth();
  
  const [discoverTab, setDiscoverTab] = useState<'turfs' | 'tournaments'>('turfs');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSport, setSelectedSport] = useState<Sport | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const amenitiesList = ['Parking', 'Showers', 'AC', 'Water', 'Floodlights', 'Changing Rooms'];

  // Debounce Search logic
  const updateSearch = useMemo(
    () => debounce((val: string) => setDebouncedSearch(val), 300),
    []
  );

  useEffect(() => {
    updateSearch(searchTerm);
  }, [searchTerm, updateSearch]);

  // Simulate data fetching delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBookClick = (turf: any) => {
    setActiveModal('booking', { turf });
  };

  const filteredTurfs = useMemo(() => {
      return MOCK_TURFS
        .filter(t => selectedSport === 'All' || t.sports_supported.includes(selectedSport))
        .filter(t => t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || t.location.toLowerCase().includes(debouncedSearch.toLowerCase()))
        .filter(t => selectedAmenities.length === 0 || selectedAmenities.every(a => t.facilities.includes(a)));
  }, [selectedSport, debouncedSearch, selectedAmenities]);

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

  const toggleAmenity = (amenity: string) => {
      setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  const registerTournament = () => {
    if(user?.wallet_balance && user.wallet_balance < 1500) {
       showToast("Insufficient wallet balance!", 'error');
       return;
    }
    showToast("Registered for Tournament!", 'success');
  };

  const liveMatches = openMatches.filter(m => m.status === 'LIVE');

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Sticky Header & Search - Improved UX */}
      <div className="sticky top-0 bg-offwhite/95 dark:bg-darkbg/95 backdrop-blur-md z-30 pt-4 pb-4 -mt-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
            <h2 className="text-4xl font-display font-black text-midnight dark:text-white mb-2 hidden md:block">Discover</h2>
            <div className="flex gap-6 relative">
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
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors ${showFilters || selectedAmenities.length > 0 ? 'bg-electric text-white' : 'bg-white dark:bg-darkcard text-gray-400'}`}
                    >
                        <Filter size={20} />
                    </button>
                    <div className="flex bg-white dark:bg-darkcard p-1 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hidden md:flex">
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
                </div>
            )}
            </div>
          </div>
      </div>

      {/* LIVE MATCHES TICKER */}
      {liveMatches.length > 0 && discoverTab === 'turfs' && (
          <div className="overflow-x-auto pb-4 -mt-4 scrollbar-hide">
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2 px-1"><Activity className="animate-pulse" size={14}/> Live Now</h3>
              <div className="flex gap-4">
                  {liveMatches.map(match => (
                      <button 
                        key={match.id}
                        onClick={() => setActiveModal('live_match', match)}
                        className="bg-gray-900 text-white p-4 rounded-xl min-w-[280px] shadow-lg hover:scale-105 transition-transform text-left"
                      >
                         <div className="flex justify-between items-start mb-3">
                             <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">LIVE</div>
                             <div className="text-xs text-gray-400">{match.sport} • {match.turf?.name}</div>
                         </div>
                         <div className="flex justify-between items-center">
                             <div>
                                 <p className="font-bold text-sm">{match.scoreboard?.team_a_name}</p>
                                 <p className="text-xl font-black text-electric">
                                     {match.sport === 'Cricket' ? `${match.scoreboard?.cricket?.team_a.runs}/${match.scoreboard?.cricket?.team_a.wickets}` : match.scoreboard?.football?.team_a}
                                 </p>
                             </div>
                             <div className="text-xs font-bold text-gray-500">VS</div>
                             <div className="text-right">
                                 <p className="font-bold text-sm">{match.scoreboard?.team_b_name}</p>
                                 <p className="text-xl font-black">
                                     {match.sport === 'Cricket' ? `${match.scoreboard?.cricket?.team_b.runs}/${match.scoreboard?.cricket?.team_b.wickets}` : match.scoreboard?.football?.team_b}
                                 </p>
                             </div>
                         </div>
                      </button>
                  ))}
              </div>
          </div>
      )}

      {/* Amenity Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-darkcard p-4 rounded-xl border border-gray-100 dark:border-gray-700 animate-scale-in">
           <div className="flex justify-between items-center mb-3">
             <h4 className="font-bold text-sm text-midnight dark:text-white">Filter Amenities</h4>
             <button onClick={() => setSelectedAmenities([])} className="text-xs text-blue-500 font-bold">Reset</button>
           </div>
           <div className="flex flex-wrap gap-2">
              {amenitiesList.map(amenity => (
                <button 
                   key={amenity}
                   onClick={() => toggleAmenity(amenity)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${selectedAmenities.includes(amenity) ? 'bg-electric text-white border-electric' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}
                >
                   {amenity}
                </button>
              ))}
           </div>
        </div>
      )}

      {discoverTab === 'turfs' ? (
        <>
            {/* Categories */}
            {viewMode === 'list' && (
                <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    <button 
                    onClick={() => setSelectedSport('All')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm snap-start ${selectedSport === 'All' ? 'bg-midnight text-white ring-2 ring-midnight ring-offset-2 dark:ring-offset-darkbg' : 'bg-white dark:bg-darkcard text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:border-gray-300'}`}
                    >
                    All Sports
                    </button>
                    {(Object.values(Sport) as string[]).map(sport => (
                    <button
                        key={sport}
                        onClick={() => setSelectedSport(sport as Sport)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm flex items-center snap-start ${selectedSport === sport ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-darkbg' : 'bg-white dark:bg-darkcard text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:border-gray-300'}`}
                    >
                        <span className="mr-2">{SPORTS_ICONS[sport as Sport]}</span> {sport}
                    </button>
                    ))}
                </div>
            )}

            {/* View Content */}
            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                      Array(6).fill(0).map((_, i) => <TurfCardSkeleton key={i} />)
                    ) : filteredTurfs.length > 0 ? (
                        filteredTurfs.map(turf => (
                          <TurfCard key={turf.id} turf={turf} onBook={() => handleBookClick(turf)} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-darkcard rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                           <p className="text-gray-400 font-bold">No turfs found matching your filters.</p>
                           <button onClick={() => { setSearchTerm(''); setSelectedAmenities([]); setSelectedSport('All'); }} className="text-blue-500 text-sm font-bold mt-2">Clear all filters</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl h-[600px] overflow-hidden relative shadow-inner border border-gray-200 dark:border-gray-700">
                     <MapComponent turfs={filteredTurfs} onMarkerClick={(turf) => handleBookClick(turf)} />
                     
                     <div className="absolute top-4 left-4 z-[500] bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
                        <p className="text-xs font-bold text-midnight dark:text-white">{filteredTurfs.length} venues found</p>
                     </div>
                </div>
            )}

            {/* Open Matches Section */}
            {viewMode === 'list' && (
                <div className="pt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-midnight dark:text-white flex items-center">
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-1.5 rounded-lg mr-3 shadow-lg shadow-orange-500/20"><Plus size={20} /></span>
                        Open Matches
                        </h3>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {openMatches.filter(m => m.status !== 'LIVE').map(match => {
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
                                    <button onClick={() => showToast("📣 Ringer Alert sent!")} className="p-2.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors" title="Find Ringer">
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
            )}
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
