
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Map, List, Filter, Users, Play } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { Sport, FriendActivity, OpenMatch } from '../../lib/types';
import { SPORTS_ICONS } from '../../lib/constants';
import { MOCK_TURFS, MOCK_TOURNAMENTS, MOCK_FRIENDS_ACTIVITY, MOCK_COACHES } from '../../lib/mockData';
import MapComponent from '../../components/common/MapComponent';
import { debounce } from '../../lib/utils';

// Refactored Components
import DiscoverFilters from './components/DiscoverFilters';
import LiveMatchesTicker from './components/LiveMatchesTicker';
import TurfGrid from './components/TurfGrid';
import OpenMatchesList from './components/OpenMatchesList';
import TournamentList from './components/TournamentList';
import CoachList from './components/CoachList';

const DiscoverScreen: React.FC = () => {
  const { openMatches, joinMatch } = useData();
  const { setActiveModal, showToast, setActiveTab } = useUI();
  const { user } = useAuth();
  
  const [discoverTab, setDiscoverTab] = useState<'turfs' | 'tournaments' | 'coaches'>('turfs');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSport, setSelectedSport] = useState<Sport | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [timeFilter, setTimeFilter] = useState<string>('any');
  
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
        .filter(t => selectedAmenities.length === 0 || selectedAmenities.every(a => t.facilities.includes(a)))
        .filter(t => t.price_per_hour <= priceRange)
        ;
  }, [selectedSport, debouncedSearch, selectedAmenities, priceRange]);

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
    showToast("Joined match successfully!", 'success');
    setActiveTab('matches');
  };

  const handleJoinNextGame = (match: OpenMatch) => {
      const startTime = new Date(match.start_time);
      const nextSlotTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Assume next hour
      const dateStr = nextSlotTime.toISOString().split('T')[0];
      
      if (match.turf) {
          showToast(`Joining queue for next game at ${match.turf.name}`);
          setActiveModal('booking', { 
              turf: match.turf,
              initialDate: dateStr
          });
      }
  };

  const handleFriendClick = (friend: FriendActivity) => {
      const turf = MOCK_TURFS.find(t => t.id === friend.turf_id);
      if (turf) {
          showToast(`Joining ${friend.username} at ${turf.name}`);
          setActiveModal('booking', { turf });
      } else {
          showToast(`Viewing ${friend.username}'s profile`);
      }
  };

  const toggleAmenity = (amenity: string) => {
      setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  const handleTournamentRegister = (tournament: any) => {
    setActiveModal('tournament_register', tournament);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedAmenities([]);
    setPriceRange(2000);
    setTimeFilter('any');
    setShowFilters(false);
  };

  const liveMatches = openMatches.filter(m => m.status === 'LIVE');

  const renderContent = () => {
      if (discoverTab === 'turfs') {
          return (
            <>
                {/* Friends Activity Rail (List View Only) */}
                {viewMode === 'list' && MOCK_FRIENDS_ACTIVITY.length > 0 && (
                    <div className="mb-6 animate-fade-in-up">
                        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                            <Users size={14} /> Friends Active
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                            {MOCK_FRIENDS_ACTIVITY.map(friend => (
                                <div 
                                    key={friend.id} 
                                    onClick={() => handleFriendClick(friend)}
                                    className="snap-start min-w-[220px] bg-white dark:bg-darkcard p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3 cursor-pointer hover:border-electric/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
                                >
                                    <div className="relative">
                                        <img src={friend.avatar_url} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600" />
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-darkcard ${friend.status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'} `}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate text-midnight dark:text-white">{friend.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{friend.sport}</p>
                                        <p className="text-[10px] text-electric font-bold truncate">@ {friend.turf_name}</p>
                                    </div>
                                    <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400 group-hover:bg-electric group-hover:text-white transition-colors">
                                        <Play size={12} fill="currentColor" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                    <TurfGrid 
                    turfs={filteredTurfs} 
                    isLoading={isLoading} 
                    onBook={handleBookClick} 
                    onClearFilters={resetFilters} 
                    />
                ) : (
                    <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl h-[600px] overflow-hidden relative shadow-inner border border-gray-200 dark:border-gray-700">
                        <MapComponent 
                            turfs={filteredTurfs} 
                            friends={MOCK_FRIENDS_ACTIVITY}
                            onMarkerClick={(turf) => handleBookClick(turf)} 
                        />
                        
                        <div className="absolute top-4 left-4 z-[500] bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg space-y-1">
                            <p className="text-xs font-bold text-midnight dark:text-white">{filteredTurfs.length} venues found</p>
                            {MOCK_FRIENDS_ACTIVITY.length > 0 && <p className="text-[10px] font-bold text-blue-500">{MOCK_FRIENDS_ACTIVITY.length} friends nearby</p>}
                        </div>
                    </div>
                )}

                {/* Open Matches Section */}
                {viewMode === 'list' && (
                <OpenMatchesList 
                    matches={openMatches} 
                    userId={user?.id}
                    onJoinMatch={handleJoinMatch}
                    onJoinNextGame={handleJoinNextGame}
                    onRingerAlert={() => showToast("📣 Ringer Alert sent!", "success")}
                />
                )}
            </>
          );
      } 
      
      if (discoverTab === 'tournaments') {
          return (
            <TournamentList 
                tournaments={MOCK_TOURNAMENTS}
                onBracketClick={() => setActiveModal('bracket')}
                onRegisterClick={handleTournamentRegister}
            />
          );
      }

      if (discoverTab === 'coaches') {
          return (
              <CoachList 
                 coaches={MOCK_COACHES} 
                 onBook={(coach) => setActiveModal('coach_booking', coach)} 
              />
          );
      }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Sticky Header & Search */}
      <div className="sticky top-[72px] md:top-0 bg-offwhite/95 dark:bg-darkbg/95 backdrop-blur-md z-30 pt-4 pb-4 -mt-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
            <h2 className="text-4xl font-display font-black text-midnight dark:text-white mb-2 hidden md:block">Discover</h2>
            <div className="flex gap-6 relative">
                <button 
                    onClick={() => setDiscoverTab('turfs')}
                    className={`text-sm font-bold pb-2 border-b-2 transition-all ${discoverTab === 'turfs' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                >
                    Turfs
                </button>
                <button 
                    onClick={() => setDiscoverTab('tournaments')}
                    className={`text-sm font-bold pb-2 border-b-2 transition-all ${discoverTab === 'tournaments' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                >
                    Tournaments
                </button>
                <button 
                    onClick={() => setDiscoverTab('coaches')}
                    className={`text-sm font-bold pb-2 border-b-2 transition-all ${discoverTab === 'coaches' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                >
                    Coaches
                </button>
            </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                type="text" 
                placeholder="Search..." 
                className="pl-12 pr-4 py-3 bg-white dark:bg-darkcard border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {discoverTab === 'turfs' && (
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors ${showFilters || selectedAmenities.length > 0 ? 'bg-electric text-white border-electric' : 'bg-white dark:bg-darkcard text-gray-400 hover:text-gray-600'}`}
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

      {/* Components Composition */}
      {discoverTab === 'turfs' && <LiveMatchesTicker matches={liveMatches} onMatchClick={(m) => setActiveModal('live_match', m)} />}

      <DiscoverFilters 
        show={showFilters}
        onClose={resetFilters}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        selectedAmenities={selectedAmenities}
        toggleAmenity={toggleAmenity}
        amenitiesList={amenitiesList}
      />

      {renderContent()}
    </div>
  );
};

export default DiscoverScreen;
