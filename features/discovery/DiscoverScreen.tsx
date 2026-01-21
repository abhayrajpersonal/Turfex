
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Map, List, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { Sport, FriendActivity, OpenMatch } from '../../lib/types';
import { MOCK_TURFS, MOCK_FRIENDS_ACTIVITY, MOCK_COACHES } from '../../lib/mockData';
import MapComponent from '../../components/common/MapComponent';
import { debounce } from '../../lib/utils';

// Refactored Components
import DiscoverFilters from './components/DiscoverFilters';
import LiveMatchesTicker from './components/LiveMatchesTicker';
import FriendsActivityList from './components/FriendsActivityList';
import TurfGrid from './components/TurfGrid';
import OpenMatchesList from './components/OpenMatchesList';
import TournamentList from './components/TournamentList';
import CoachList from './components/CoachList';

const DiscoverScreen: React.FC = () => {
  const { openMatches, joinMatch, tournaments } = useData();
  const { setActiveModal, showToast, setActiveTab } = useUI();
  const { user } = useAuth();
  
  const [discoverTab, setDiscoverTab] = useState<'turfs' | 'tournaments' | 'coaches'>('turfs');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSport, setSelectedSport] = useState<Sport | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [timeFilter, setTimeFilter] = useState<string>('any');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const amenitiesList = ['Parking', 'Showers', 'AC', 'Water', 'Floodlights', 'Changing Rooms'];

  const updateSearch = useMemo(
    () => debounce((val: string) => setDebouncedSearch(val), 300),
    []
  );

  useEffect(() => {
    updateSearch(searchTerm);
  }, [searchTerm, updateSearch]);

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
    joinMatch(matchId);
    showToast("Joined match successfully!", 'success');
    setActiveTab('matches');
  };

  const handleJoinNextGame = (match: OpenMatch) => {
      const startTime = new Date(match.start_time);
      const nextSlotTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 Hour
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
          setActiveModal('booking', { 
              turf,
              initialDate: new Date().toISOString().split('T')[0] 
          });
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

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Area */}
      <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
              <h1 className="text-4xl font-display font-bold uppercase italic tracking-tighter text-white">
                  Discover <span className="text-volt">.</span>
              </h1>
              <div className="flex bg-zinc-900 border border-zinc-800 p-1">
                  <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}><List size={20}/></button>
                  <button onClick={() => setViewMode('map')} className={`p-2 ${viewMode === 'map' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}><Map size={20}/></button>
              </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                  <input 
                    type="text" 
                    placeholder="SEARCH VENUES, SPORTS..." 
                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 text-sm font-bold outline-none focus:border-volt text-white placeholder-zinc-600 uppercase tracking-wide"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
              <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-4 font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-colors border ${showFilters ? 'bg-volt text-black border-volt' : 'bg-black text-white border-zinc-800 hover:border-zinc-600'}`}
              >
                  <Filter size={18} /> Filters
              </button>
          </div>

          {/* Sport Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button 
                onClick={() => setSelectedSport('All')}
                className={`px-6 py-2.5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${selectedSport === 'All' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-800 hover:text-white'}`}
              >
                  All Sports
              </button>
              {(Object.values(Sport) as string[]).map(sport => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport as Sport)}
                    className={`px-6 py-2.5 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${selectedSport === sport ? 'bg-white text-black border-white' : 'bg-black border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                  >
                      {sport}
                  </button>
              ))}
          </div>
      </div>

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

      {/* Content Switcher */}
      <div className="flex border-b border-zinc-800 mb-6">
          <button onClick={() => setDiscoverTab('turfs')} className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest ${discoverTab === 'turfs' ? 'border-b-2 border-volt text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Venues</button>
          <button onClick={() => setDiscoverTab('tournaments')} className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest ${discoverTab === 'tournaments' ? 'border-b-2 border-volt text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Tournaments</button>
          <button onClick={() => setDiscoverTab('coaches')} className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest ${discoverTab === 'coaches' ? 'border-b-2 border-volt text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Coaches</button>
      </div>

      {discoverTab === 'turfs' && (
          <>
            {/* Friends Activity Section */}
            {viewMode === 'list' && (
                <FriendsActivityList 
                    activities={MOCK_FRIENDS_ACTIVITY} 
                    onInteract={handleFriendClick}
                />
            )}

            <LiveMatchesTicker matches={liveMatches} onMatchClick={(m) => setActiveModal('live_match', m)} />
            
            {viewMode === 'list' ? (
                <TurfGrid turfs={filteredTurfs} isLoading={isLoading} onBook={handleBookClick} onClearFilters={resetFilters} />
            ) : (
                <div className="h-[600px] overflow-hidden relative border border-zinc-800">
                    <MapComponent turfs={filteredTurfs} friends={MOCK_FRIENDS_ACTIVITY} onMarkerClick={(turf) => handleBookClick(turf)} />
                </div>
            )}

            {viewMode === 'list' && <OpenMatchesList matches={openMatches} userId={user?.id} onJoinMatch={handleJoinMatch} onJoinNextGame={handleJoinNextGame} onRingerAlert={() => showToast("Ringer Alert sent!", "success")} />}
          </>
      )}

      {discoverTab === 'tournaments' && <TournamentList tournaments={tournaments} onBracketClick={() => setActiveModal('bracket')} onRegisterClick={handleTournamentRegister} />}
      
      {discoverTab === 'coaches' && <CoachList coaches={MOCK_COACHES} onBook={(coach) => setActiveModal('coach_booking', coach)} />}
    </div>
  );
};

export default DiscoverScreen;
