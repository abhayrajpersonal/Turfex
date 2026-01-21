
import React from 'react';
import { Activity } from 'lucide-react';
import { OpenMatch, Sport } from '../../../lib/types';

interface LiveMatchesTickerProps {
  matches: OpenMatch[];
  onMatchClick: (match: OpenMatch) => void;
}

const LiveMatchesTicker: React.FC<LiveMatchesTickerProps> = ({ matches, onMatchClick }) => {
  if (matches.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-4 -mt-4 scrollbar-hide">
      <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2 px-1">
        <Activity className="animate-pulse" size={14}/> Live Now
      </h3>
      <div className="flex gap-4">
        {matches.map(match => (
          <button 
            key={match.id}
            onClick={() => onMatchClick(match)}
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
                  {match.sport === Sport.CRICKET ? `${match.scoreboard?.cricket?.team_a.runs}/${match.scoreboard?.cricket?.team_a.wickets}` : match.scoreboard?.football?.team_a}
                </p>
              </div>
              <div className="text-xs font-bold text-gray-500">VS</div>
              <div className="text-right">
                <p className="font-bold text-sm">{match.scoreboard?.team_b_name}</p>
                <p className="text-xl font-black">
                  {match.sport === Sport.CRICKET ? `${match.scoreboard?.cricket?.team_b.runs}/${match.scoreboard?.cricket?.team_b.wickets}` : match.scoreboard?.football?.team_b}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LiveMatchesTicker;
