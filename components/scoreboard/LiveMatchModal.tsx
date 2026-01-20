
import React, { useState } from 'react';
import { X, Share2, Award, Flag, Activity, MoreHorizontal } from 'lucide-react';
import { OpenMatch, Sport } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';
import { useMatchScoring } from '../../hooks/useMatchScoring';
import ScoreboardDisplay from './ScoreboardDisplay';
import CricketControls from './controls/CricketControls';
import FootballControls from './controls/FootballControls';
import MatchSummary from './MatchSummary';

interface LiveMatchModalProps {
  match: OpenMatch;
  onClose: () => void;
  onShare: () => void;
  onFinish?: (summary: any) => void;
}

const LiveMatchModal: React.FC<LiveMatchModalProps> = ({ match, onClose, onShare, onFinish }) => {
  const { user } = useAuth();
  const isHost = user?.id === match.host_id;
  const [status, setStatus] = useState(match.status);
  
  // Use the new hook for scoring logic
  const { scoreboard, updateCricketScore, updateFootballScore } = useMatchScoring(match);

  const handleFinishMatch = () => {
      if(!onFinish) return;
      
      let winner = 'Draw';
      if (match.sport === Sport.CRICKET && scoreboard?.cricket) {
          winner = scoreboard.cricket.team_a.runs > scoreboard.cricket.team_b.runs ? scoreboard.team_a_name : scoreboard.team_b_name;
      } else if (match.sport === Sport.FOOTBALL && scoreboard?.football) {
          winner = scoreboard.football.team_a > scoreboard.football.team_b ? scoreboard.team_a_name : 
                   scoreboard.football.team_b > scoreboard.football.team_a ? scoreboard.team_b_name : 'Draw';
      }

      setStatus('COMPLETED');
      onFinish({
          winner,
          mvp: 'Player of the Match',
          duration: '45 mins',
          highlights: ['Great game!', 'Amazing finish']
      });
  };

  if (status === 'COMPLETED') {
      return (
        <MatchSummary 
           match={match} 
           scoreboard={scoreboard} 
           onClose={onClose} 
           onShare={onShare} 
        />
      );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[90] flex justify-center items-center backdrop-blur-sm animate-fade-in-up">
        <div className="w-full h-full md:h-[85vh] md:w-[600px] md:rounded-3xl bg-white dark:bg-darkcard flex flex-col overflow-hidden shadow-2xl relative">
            
            {/* Header */}
            <div className="bg-gradient-to-b from-gray-900 to-black p-4 text-white flex justify-between items-center z-10 shrink-0">
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X /></button>
                <div className="flex items-center gap-2">
                    <span className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse flex items-center gap-1"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE</span>
                    <span className="font-bold tracking-wider uppercase text-sm">{match.sport}</span>
                </div>
                <button onClick={onShare} className="p-2 bg-electric rounded-full hover:bg-blue-600"><Share2 size={18} /></button>
            </div>

            {/* Scoreboard Display Area (Visible to ALL) */}
            <ScoreboardDisplay match={match} scoreboard={scoreboard} />

            {/* Input Pad (HOST ONLY) or Spectator Feed */}
            <div className="bg-white dark:bg-darkcard flex-1 overflow-y-auto rounded-t-3xl -mt-6 relative z-20 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                 {isHost ? (
                     <>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-midnight dark:text-white flex items-center gap-2"><Award className="text-electric"/> Scorer Console</h3>
                            <button 
                                onClick={handleFinishMatch}
                                className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
                            >
                                <Flag size={12}/> Finish Match
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mb-6">You are the host. Updates here reflect for all spectators.</p>
                        
                        {match.sport === Sport.CRICKET && <CricketControls onUpdateScore={updateCricketScore} />}
                        {match.sport === Sport.FOOTBALL && <FootballControls teamA={scoreboard?.team_a_name || 'A'} teamB={scoreboard?.team_b_name || 'B'} onGoal={updateFootballScore} />}
                        
                        {!['Cricket', 'Football'].includes(match.sport) && (
                            <div className="text-center py-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                                <MoreHorizontal size={48} className="text-gray-300 mb-4"/>
                                <p className="font-bold text-gray-400">Simple Scoreboard</p>
                                <p className="text-xs text-gray-400 mt-1">Coming soon for {match.sport}</p>
                            </div>
                        )}
                     </>
                 ) : (
                     // SPECTATOR VIEW
                     <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="font-bold text-midnight dark:text-white flex items-center gap-2"><Activity size={20} className="text-electric"/> Match Feed</h3>
                           <span className="text-xs text-gray-400 font-medium">Real-time</span>
                        </div>
                        <div className="space-y-6 pl-4 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="relative animate-fade-in-up" style={{animationDelay: `${i*100}ms`}}>
                                    <div className="absolute -left-[21px] top-0 w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-darkcard"></div>
                                    <div className="text-xs font-bold text-gray-400 mb-1">4{i}th Minute</div>
                                    <p className="text-sm text-midnight dark:text-white font-medium">
                                        {i === 1 ? "Goal! Striker blasts it into the top corner." : "Great save by the keeper to deny a certain goal."}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-center text-xs text-gray-500 mt-8">
                            Updates appear automatically as the host scores.
                        </div>
                     </div>
                 )}
            </div>
        </div>
    </div>
  );
};

export default LiveMatchModal;
