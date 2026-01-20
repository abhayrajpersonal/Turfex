
import React from 'react';
import { Clock } from 'lucide-react';
import { Sport, OpenMatch } from '../../lib/types';

interface ScoreboardDisplayProps {
  match: OpenMatch;
  scoreboard: any;
}

const ScoreboardDisplay: React.FC<ScoreboardDisplayProps> = ({ match, scoreboard }) => {
  return (
    <div className="bg-black text-white p-8 pb-12 text-center relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        
        {match.sport === Sport.CRICKET && scoreboard?.cricket && (
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-left">
                        <h3 className="font-bold text-lg opacity-90">{scoreboard.team_a_name}</h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-5xl font-black text-white">{scoreboard.cricket.team_a.runs}/{scoreboard.cricket.team_a.wickets}</p>
                        </div>
                        <p className="text-sm text-electric font-bold mt-1">{scoreboard.cricket.team_a.overs}.{scoreboard.cricket.team_a.balls} Overs</p>
                    </div>
                    <div className="text-right opacity-40 scale-90 origin-right">
                        <h3 className="font-bold text-lg">{scoreboard.team_b_name}</h3>
                        <p className="text-4xl font-black">{scoreboard.cricket.team_b.runs}/{scoreboard.cricket.team_b.wickets}</p>
                        <p className="text-sm text-gray-400">Yet to bat</p>
                    </div>
                </div>
                <div className="bg-white/10 rounded-full px-4 py-1.5 text-xs font-mono inline-block border border-white/10">
                      CRR: {((scoreboard.cricket.team_a.runs / (scoreboard.cricket.team_a.overs * 6 + scoreboard.cricket.team_a.balls || 1)) * 6).toFixed(2)}
                </div>
            </div>
        )}

        {match.sport === Sport.FOOTBALL && scoreboard?.football && (
            <div className="flex justify-center items-center gap-8 relative z-10 my-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3 mx-auto shadow-lg shadow-blue-900/50">{scoreboard.team_a_name[0]}</div>
                    <h3 className="font-bold text-lg">{scoreboard.team_a_name}</h3>
                    <p className="text-6xl font-black mt-2">{scoreboard.football.team_a}</p>
                </div>
                <div className="text-center flex flex-col items-center">
                    <div className="bg-red-600 px-3 py-1 rounded text-xs font-bold mb-2 animate-pulse">42:10</div>
                    <span className="text-gray-600 font-bold text-4xl">:</span>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3 mx-auto shadow-lg shadow-red-900/50">{scoreboard.team_b_name[0]}</div>
                    <h3 className="font-bold text-lg">{scoreboard.team_b_name}</h3>
                    <p className="text-6xl font-black mt-2">{scoreboard.football.team_b}</p>
                </div>
            </div>
        )}

        <p className="text-xs text-gray-500 mt-8 flex justify-center items-center gap-1 opacity-60">
            <Clock size={12}/> Last update: {scoreboard?.last_update}
        </p>
    </div>
  );
};

export default ScoreboardDisplay;
