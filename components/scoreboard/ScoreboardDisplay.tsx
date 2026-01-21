
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Sport, OpenMatch } from '../../lib/types';

interface ScoreboardDisplayProps {
  match: OpenMatch;
  scoreboard: any;
}

const ScoreboardDisplay: React.FC<ScoreboardDisplayProps> = ({ match, scoreboard }) => {
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
      // Trigger animation whenever scoreboard updates
      setAnimateScore(true);
      const timer = setTimeout(() => setAnimateScore(false), 300);
      return () => clearTimeout(timer);
  }, [scoreboard]);

  const isRacquetSport = [Sport.BADMINTON, Sport.TENNIS, Sport.PICKLEBALL].includes(match.sport);

  return (
    <div className="bg-black text-white p-8 pb-12 text-center relative overflow-hidden shrink-0 min-h-[300px] flex flex-col justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        {/* Radial Gradient for focus */}
        <div className="absolute inset-0 bg-radial-gradient from-gray-800/50 to-black/90 pointer-events-none"></div>
        
        {/* CRICKET DISPLAY */}
        {match.sport === Sport.CRICKET && scoreboard?.cricket && (
            <div className="relative z-10 w-full max-w-md mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-left relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                        <h3 className="font-bold text-lg opacity-90 relative z-10 tracking-tight">{scoreboard.team_a_name}</h3>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <p className={`text-6xl font-black font-mono text-white transition-transform duration-300 drop-shadow-lg ${animateScore ? 'scale-110 text-electric' : 'scale-100'}`}>
                                {scoreboard.cricket.team_a.runs}/{scoreboard.cricket.team_a.wickets}
                            </p>
                        </div>
                        <p className="text-sm text-electric font-bold font-mono mt-1 relative z-10 bg-black/40 inline-block px-2 rounded-md">{scoreboard.cricket.team_a.overs}.{scoreboard.cricket.team_a.balls} Overs</p>
                    </div>
                    <div className="text-right opacity-50 scale-90 origin-right">
                        <h3 className="font-bold text-lg tracking-tight">{scoreboard.team_b_name}</h3>
                        <p className="text-4xl font-black font-mono">{scoreboard.cricket.team_b.runs}/{scoreboard.cricket.team_b.wickets}</p>
                        <p className="text-sm text-gray-400">Yet to bat</p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-mono inline-block border border-white/20">
                      CRR: {((scoreboard.cricket.team_a.runs / (scoreboard.cricket.team_a.overs * 6 + scoreboard.cricket.team_a.balls || 1)) * 6).toFixed(2)}
                </div>
            </div>
        )}

        {/* FOOTBALL DISPLAY */}
        {match.sport === Sport.FOOTBALL && scoreboard?.football && (
            <div className="flex justify-center items-center gap-4 md:gap-8 relative z-10 my-4 w-full">
                <div className="text-center flex-1">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3 mx-auto shadow-lg shadow-blue-900/50 border-4 border-blue-800">{scoreboard.team_a_name[0]}</div>
                    <h3 className="font-bold text-lg truncate px-2 tracking-tight">{scoreboard.team_a_name}</h3>
                    <p className={`text-7xl font-black font-mono mt-2 transition-transform duration-300 drop-shadow-2xl ${animateScore ? 'scale-125 text-yellow-400' : 'scale-100'}`}>
                        {scoreboard.football.team_a}
                    </p>
                </div>
                <div className="text-center flex flex-col items-center shrink-0">
                    <div className="bg-red-600 px-3 py-1 rounded text-xs font-bold mb-2 animate-pulse shadow-red-900/50 shadow-lg tracking-widest">LIVE</div>
                    <span className="text-gray-600 font-bold text-4xl">:</span>
                </div>
                <div className="text-center flex-1">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3 mx-auto shadow-lg shadow-red-900/50 border-4 border-red-800">{scoreboard.team_b_name[0]}</div>
                    <h3 className="font-bold text-lg truncate px-2 tracking-tight">{scoreboard.team_b_name}</h3>
                    <p className={`text-7xl font-black font-mono mt-2 transition-transform duration-300 drop-shadow-2xl ${animateScore ? 'scale-125 text-yellow-400' : 'scale-100'}`}>
                        {scoreboard.football.team_b}
                    </p>
                </div>
            </div>
        )}

        {/* RACQUET SPORTS DISPLAY (Badminton, Pickleball, Tennis) */}
        {isRacquetSport && scoreboard?.racquet && (
            <div className="relative z-10 w-full max-w-lg mx-auto">
                {/* Sets History */}
                <div className="flex justify-center gap-8 mb-6 opacity-70 text-sm font-mono">
                    <div className="flex gap-2">
                        {scoreboard.racquet.sets.map((set: any, i: number) => (
                            i < scoreboard.racquet.current_set && (
                                <div key={i} className="flex flex-col items-center bg-white/10 px-2 py-1 rounded">
                                    <span className="text-[10px] text-gray-400">SET {i+1}</span>
                                    <span className="font-bold">{set.a}-{set.b}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center relative">
                    {/* Team A */}
                    <div className="text-center flex-1 relative">
                        {scoreboard.racquet.server === 'A' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-400 animate-bounce tracking-widest">SERVING</div>
                        )}
                        <h3 className="font-bold text-xl mb-1 tracking-tight">{scoreboard.team_a_name}</h3>
                        <div className={`text-8xl font-black font-mono transition-all duration-300 ${animateScore ? 'scale-110 text-electric' : ''}`}>
                            {scoreboard.racquet.sets[scoreboard.racquet.current_set]?.a || 0}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-16 w-px bg-white/20 mx-4"></div>

                    {/* Team B */}
                    <div className="text-center flex-1 relative">
                        {scoreboard.racquet.server === 'B' && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-400 animate-bounce tracking-widest">SERVING</div>
                        )}
                        <h3 className="font-bold text-xl mb-1 tracking-tight">{scoreboard.team_b_name}</h3>
                        <div className={`text-8xl font-black font-mono transition-all duration-300 ${animateScore ? 'scale-110 text-red-500' : ''}`}>
                            {scoreboard.racquet.sets[scoreboard.racquet.current_set]?.b || 0}
                        </div>
                    </div>
                </div>
                
                <div className="mt-4 bg-white/5 inline-block px-4 py-1 rounded-full text-xs font-bold text-gray-400 border border-white/10 tracking-widest">
                    SET {scoreboard.racquet.current_set + 1}
                </div>
            </div>
        )}

        <p className="text-xs text-gray-500 mt-8 flex justify-center items-center gap-1 opacity-60 absolute bottom-4 w-full left-0">
            <Clock size={12}/> Last update: {scoreboard?.last_update}
        </p>
    </div>
  );
};

export default ScoreboardDisplay;
