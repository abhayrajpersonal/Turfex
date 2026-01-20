
import React, { useState } from 'react';
import { Gamepad2, Plus, Play, Share2, ArrowRight, Trophy } from 'lucide-react';
import { Sport, OpenMatch, Team } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { SPORTS_ICONS } from '../../lib/constants';

const ScoreboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { openMatches } = useData();
  const { setActiveModal, showToast } = useUI();
  
  const [view, setView] = useState<'LANDING' | 'CREATE'>('LANDING');
  const [selectedSport, setSelectedSport] = useState<Sport>(Sport.FOOTBALL);
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');

  // Get user's hosted matches
  const myHostedMatches = openMatches.filter(m => m.host_id === user?.id && m.status !== 'COMPLETED');

  const handleStartGame = () => {
      if (!teamA || !teamB) {
          showToast("Please enter both team names", "error");
          return;
      }

      // In a real app, this would make an API call to create the match
      const newMatch: OpenMatch = {
          id: `live-${Date.now()}`,
          host_id: user?.id || 'guest',
          turf_id: 'custom',
          sport: selectedSport,
          required_players: 0,
          joined_players: [user?.id || ''],
          start_time: new Date().toISOString(),
          status: 'LIVE',
          scoreboard: {
              team_a_name: teamA,
              team_b_name: teamB,
              cricket: {
                  team_a: { runs: 0, wickets: 0, overs: 0, balls: 0, is_batting_first: true },
                  team_b: { runs: 0, wickets: 0, overs: 0, balls: 0, is_batting_first: false }
              },
              football: { team_a: 0, team_b: 0, time_elapsed: 0 },
              last_update: 'Match Started'
          }
      };

      // We trigger the modal directly with this new match object
      // Ideally we'd add it to context first, but for UI flow this works
      setActiveModal('live_match', newMatch);
      setView('LANDING');
      setTeamA('');
      setTeamB('');
  };

  if (view === 'CREATE') {
      return (
          <div className="animate-fade-in-up max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setView('LANDING')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">←</button>
                  <h2 className="text-2xl font-bold font-display text-midnight dark:text-white">Setup Match</h2>
              </div>

              <div className="bg-white dark:bg-darkcard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                  <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Sport</label>
                      <div className="grid grid-cols-3 gap-3">
                          {(Object.values(Sport) as string[]).map(sport => (
                              <button 
                                key={sport}
                                onClick={() => setSelectedSport(sport as Sport)}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedSport === sport ? 'bg-electric text-white border-electric shadow-lg shadow-blue-500/20' : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500 hover:bg-gray-100'}`}
                              >
                                  <span className="text-2xl">{SPORTS_ICONS[sport as Sport]}</span>
                                  <span className="text-xs font-bold">{sport}</span>
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Team A Name</label>
                          <input 
                            value={teamA}
                            onChange={(e) => setTeamA(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-electric font-bold text-midnight dark:text-white"
                            placeholder="Home Team"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Team B Name</label>
                          <input 
                            value={teamB}
                            onChange={(e) => setTeamB(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 outline-none focus:ring-2 focus:ring-electric font-bold text-midnight dark:text-white"
                            placeholder="Away Team"
                          />
                      </div>
                  </div>

                  <div className="pt-4">
                      <button 
                        onClick={handleStartGame}
                        className="w-full bg-electric text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                          <Play size={20} fill="currentColor" /> Start Live Match
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 max-w-md">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Live Scoring Engine
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">Broadcast your game to the world.</h2>
                <p className="text-indigo-100 mb-8 font-medium">Create a live scoreboard link for any match. Friends can watch real-time scores without logging in.</p>
                <button 
                  onClick={() => setView('CREATE')}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-lg active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} /> Start My Game
                </button>
            </div>
            <Gamepad2 size={200} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
        </div>

        {/* Active Matches Section */}
        <div>
            <h3 className="text-xl font-bold text-midnight dark:text-white mb-4 flex items-center gap-2">
                Your Active Matches 
                {myHostedMatches.length > 0 && <span className="bg-electric text-white text-xs px-2 py-0.5 rounded-full">{myHostedMatches.length}</span>}
            </h3>
            
            {myHostedMatches.length === 0 ? (
                <div className="bg-white dark:bg-darkcard border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                        <Trophy size={32} />
                    </div>
                    <p className="text-gray-400 font-medium">No matches running currently.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {myHostedMatches.map(match => (
                        <div key={match.id} className="bg-white dark:bg-darkcard p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded">{match.sport}</span>
                                <span className="text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">● LIVE</span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-center">
                                    <p className="font-bold text-lg text-midnight dark:text-white">{match.scoreboard?.team_a_name}</p>
                                </div>
                                <div className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">VS</div>
                                <div className="text-center">
                                    <p className="font-bold text-lg text-midnight dark:text-white">{match.scoreboard?.team_b_name}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                  onClick={() => setActiveModal('live_match', match)}
                                  className="flex-1 bg-electric text-white py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                                >
                                    Resume Scoring
                                </button>
                                <button 
                                  onClick={() => {
                                      navigator.clipboard.writeText(`https://turfex.app/live/${match.id}`);
                                      showToast("Link copied!");
                                  }}
                                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default ScoreboardScreen;
