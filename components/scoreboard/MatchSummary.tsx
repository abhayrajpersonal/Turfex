
import React from 'react';
import { X, Trophy, Award, Clock, Share2 } from 'lucide-react';
import { OpenMatch, Sport } from '../../lib/types';

interface MatchSummaryProps {
  match: OpenMatch;
  scoreboard: any;
  onClose: () => void;
  onShare: () => void;
}

const MatchSummary: React.FC<MatchSummaryProps> = ({ match, scoreboard, onClose, onShare }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-[90] flex justify-center items-center backdrop-blur-md animate-scale-in">
        <div className="w-full h-full md:h-[80vh] md:w-[500px] md:rounded-3xl bg-white dark:bg-darkcard flex flex-col overflow-hidden shadow-2xl relative">
            <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/10 dark:bg-white/10 rounded-full text-midnight dark:text-white"><X size={20}/></button>
            
            <div className="bg-electric text-white p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <Trophy size={64} className="text-yellow-300 drop-shadow-lg mb-4 animate-bounce" />
                <h2 className="text-3xl font-black font-display uppercase tracking-widest">Match Finished</h2>
                <p className="text-white/80 font-bold mt-2">Winner: {match.summary?.winner || 'Undecided'}</p>
            </div>

            <div className="p-8 flex-1 bg-offwhite dark:bg-darkbg">
                <div className="bg-white dark:bg-darkcard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center mb-6">
                    <div className="flex justify-between items-center text-midnight dark:text-white">
                        <div className="text-center w-1/3">
                            <span className="block font-bold text-lg">{scoreboard?.team_a_name}</span>
                            <span className="block text-3xl font-black text-blue-600">
                                {match.sport === Sport.CRICKET ? `${scoreboard?.cricket?.team_a.runs}/${scoreboard?.cricket?.team_a.wickets}` : scoreboard?.football?.team_a}
                            </span>
                        </div>
                        <div className="w-1/3 text-gray-400 font-black text-xl">VS</div>
                        <div className="text-center w-1/3">
                            <span className="block font-bold text-lg">{scoreboard?.team_b_name}</span>
                            <span className="block text-3xl font-black text-red-600">
                                {match.sport === Sport.CRICKET ? `${scoreboard?.cricket?.team_b.runs}/${scoreboard?.cricket?.team_b.wickets}` : scoreboard?.football?.team_b}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-white dark:bg-darkcard p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600"><Award size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Man of the Match</p>
                            <p className="font-bold text-midnight dark:text-white">{match.summary?.mvp || 'TBD'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white dark:bg-darkcard p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600"><Clock size={20}/></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Duration</p>
                            <p className="font-bold text-midnight dark:text-white">{match.summary?.duration || '45 mins'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-darkcard border-t border-gray-100 dark:border-gray-700">
                <button onClick={onShare} className="w-full bg-midnight dark:bg-white text-white dark:text-midnight font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                    <Share2 size={18} /> Share Summary
                </button>
            </div>
        </div>
    </div>
  );
};

export default MatchSummary;
