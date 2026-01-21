
import React from 'react';
import { Plus, Megaphone, Ticket, Clock, ArrowRight } from 'lucide-react';
import { OpenMatch } from '../../../lib/types';

interface OpenMatchesListProps {
  matches: OpenMatch[];
  userId: string | undefined;
  onJoinMatch: (id: string) => void;
  onJoinNextGame: (match: OpenMatch) => void;
  onRingerAlert: () => void;
}

const OpenMatchesList: React.FC<OpenMatchesListProps> = ({ matches, userId, onJoinMatch, onJoinNextGame, onRingerAlert }) => {
  const sortedMatches = [...matches].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  if (sortedMatches.length === 0) return null;

  return (
    <div className="pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-midnight dark:text-white flex items-center tracking-tight">
          <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-1.5 rounded-lg mr-3 shadow-lg shadow-orange-500/20">
            <Plus size={20} />
          </span>
          Open Matches
        </h3>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedMatches.map(match => {
          const isJoined = match.joined_players.includes(userId || '');
          const slotsLeft = match.required_players - match.joined_players.length;
          const isActive = match.status === 'LIVE' || new Date(match.start_time) < new Date();
          
          return (
            <div key={match.id} className={`bg-white dark:bg-darkcard p-5 rounded-2xl border border-gray-100 dark:border-white/5 dark:bg-gradient-to-b dark:from-white/5 dark:to-transparent shadow-sm flex flex-col justify-between hover:border-blue-500 dark:hover:border-volt/50 transition-all duration-300 group relative overflow-hidden`}>
              {/* Active Match Indicator */}
              {isActive && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-md z-10 flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE
                  </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black text-blue-600 bg-gradient-to-r from-blue-500/10 to-blue-500/20 border border-blue-500/20 px-2 py-1 rounded-md uppercase tracking-widest">{match.sport}</span>
                  {!isActive && <span className="text-xs font-medium text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md font-mono">{new Date(match.start_time).toLocaleDateString()}</span>}
                </div>
                <h4 className="font-bold text-lg text-midnight dark:text-white group-hover:text-blue-600 dark:group-hover:text-volt transition-colors tracking-tight">{match.turf?.name}</h4>
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
                    +{match.joined_players.length} players
                  </span>
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center h-16">
                {isActive ? (
                    <div className="w-full flex justify-between items-center">
                        <span className="text-xs text-gray-400 font-bold italic flex items-center gap-1"><Clock size={12}/> Match in progress</span>
                        <button 
                            onClick={() => onJoinNextGame(match)}
                            className="bg-volt text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white transition-all flex items-center gap-1 shadow-lg shadow-volt/20"
                        >
                            Join Next Game <ArrowRight size={14} />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-sm dark:text-gray-300">
                        <span className="font-bold text-midnight dark:text-white text-lg font-mono">{slotsLeft}</span> <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Slots Left</span>
                        </div>
                        <div className="flex gap-2 items-center">
                        {slotsLeft > 0 && (
                            <button onClick={onRingerAlert} className="p-2.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-colors active:scale-95" title="Find Ringer">
                            <Megaphone size={20} />
                            </button>
                        )}

                        {isJoined ? (
                            <span className="bg-gradient-to-r from-green-500/10 to-green-500/20 text-green-700 dark:text-green-400 border border-green-500/20 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center"><Ticket size={16} className="mr-2"/> Joined</span>
                        ) : (
                            <button 
                            onClick={() => onJoinMatch(match.id)}
                            className="bg-zinc-800 text-white border border-zinc-700 hover:bg-volt hover:text-black hover:border-volt px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] shadow-sm"
                            >
                            Join Match
                            </button>
                        )}
                        </div>
                    </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenMatchesList;
