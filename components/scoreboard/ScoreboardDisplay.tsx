
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
      setAnimateScore(true);
      const timer = setTimeout(() => setAnimateScore(false), 300);
      return () => clearTimeout(timer);
  }, [scoreboard]);

  const isRacquetSport = [Sport.BADMINTON, Sport.TENNIS, Sport.PICKLEBALL].includes(match.sport);

  return (
    <div className="bg-black text-white p-8 pb-12 text-center relative overflow-hidden shrink-0 min-h-[320px] flex flex-col justify-center border-b-4 border-volt">
        {/* Subtle mesh pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* CRICKET DISPLAY */}
        {match.sport === Sport.CRICKET && scoreboard?.cricket && (
            <div className="relative z-10 w-full max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="text-left">
                        <h3 className="font-display font-bold text-2xl uppercase tracking-wider text-gray-300 mb-1">{scoreboard.team_a_name}</h3>
                        <div className="flex items-baseline gap-3">
                            <p className={`text-7xl font-display font-bold text-white leading-none transition-transform ${animateScore ? 'text-volt scale-105' : ''}`}>
                                {scoreboard.cricket.team_a.runs}/{scoreboard.cricket.team_a.wickets}
                            </p>
                        </div>
                        <p className="text-sm text-volt font-bold font-mono mt-2 bg-white/10 inline-block px-2 py-1 rounded">
                            {scoreboard.cricket.team_a.overs}.{scoreboard.cricket.team_a.balls} OVERS
                        </p>
                    </div>
                    <div className="text-right opacity-60">
                        <h3 className="font-display font-bold text-2xl uppercase tracking-wider">{scoreboard.team_b_name}</h3>
                        <p className="text-4xl font-display font-bold">{scoreboard.cricket.team_b.runs}/{scoreboard.cricket.team_b.wickets}</p>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Innings 2</p>
                    </div>
                </div>
            </div>
        )}

        {/* FOOTBALL DISPLAY */}
        {match.sport === Sport.FOOTBALL && scoreboard?.football && (
            <div className="relative z-10 w-full">
                <div className="flex items-center justify-center gap-12">
                    <div className="text-center w-1/3">
                        <h3 className="font-display font-bold text-2xl uppercase tracking-wider mb-4 text-gray-300">{scoreboard.team_a_name}</h3>
                        <p className={`text-9xl font-display font-bold leading-none ${animateScore ? 'text-volt scale-110' : 'text-white'} transition-all`}>
                            {scoreboard.football.team_a}
                        </p>
                    </div>
                    <div className="h-24 w-px bg-white/20"></div>
                    <div className="text-center w-1/3">
                        <h3 className="font-display font-bold text-2xl uppercase tracking-wider mb-4 text-gray-300">{scoreboard.team_b_name}</h3>
                        <p className={`text-9xl font-display font-bold leading-none ${animateScore ? 'text-volt scale-110' : 'text-white'} transition-all`}>
                            {scoreboard.football.team_b}
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* RACQUET SPORTS */}
        {isRacquetSport && scoreboard?.racquet && (
            <div className="relative z-10 w-full max-w-lg mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <div className="flex gap-4">
                        {scoreboard.racquet.sets.map((set: any, i: number) => (
                            i < scoreboard.racquet.current_set && (
                                <span key={i} className="text-xl font-display font-bold text-gray-500">{set.a}-{set.b}</span>
                            )
                        ))}
                    </div>
                    <span className="bg-white/10 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-volt">Set {scoreboard.racquet.current_set + 1}</span>
                </div>

                <div className="flex justify-between items-center relative">
                    <div className="text-center flex-1">
                        {scoreboard.racquet.server === 'A' && <div className="w-2 h-2 bg-volt rounded-full mx-auto mb-2 animate-pulse"></div>}
                        <h3 className="font-display font-bold text-2xl uppercase mb-2">{scoreboard.team_a_name}</h3>
                        <div className={`text-8xl font-display font-bold ${animateScore ? 'text-volt' : ''}`}>{scoreboard.racquet.sets[scoreboard.racquet.current_set]?.a || 0}</div>
                    </div>
                    
                    <div className="text-center flex-1">
                        {scoreboard.racquet.server === 'B' && <div className="w-2 h-2 bg-volt rounded-full mx-auto mb-2 animate-pulse"></div>}
                        <h3 className="font-display font-bold text-2xl uppercase mb-2">{scoreboard.team_b_name}</h3>
                        <div className={`text-8xl font-display font-bold ${animateScore ? 'text-volt' : ''}`}>{scoreboard.racquet.sets[scoreboard.racquet.current_set]?.b || 0}</div>
                    </div>
                </div>
            </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-zinc p-3 flex justify-between items-center px-6">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Clock size={14} className="text-volt"/> Live Match
            </span>
            <span className="text-xs font-mono text-gray-500">{scoreboard?.last_update}</span>
        </div>
    </div>
  );
};

export default ScoreboardDisplay;
