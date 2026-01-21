
import React from 'react';
import { TournamentBracketData } from '../../lib/types';

interface TournamentBracketProps {
  bracket: TournamentBracketData;
  onClose: () => void;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ bracket, onClose }) => {
  const rounds = [1, 2, 3]; // Simplified: QF, SF, Final

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-md overflow-x-auto">
        <div className="bg-white dark:bg-darkcard rounded-3xl p-6 min-w-[800px] max-w-5xl w-full h-[80vh] flex flex-col relative shadow-2xl border border-white/10">
            <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-800 p-2 rounded-full font-bold">Close</button>
            <h3 className="text-2xl font-bold font-display text-midnight dark:text-white mb-8">Tournament Bracket</h3>
            
            <div className="flex justify-between flex-1 items-center gap-8 px-4">
                {rounds.map((round, rIndex) => {
                    const matches = bracket.matches.filter(m => m.round === round);
                    const title = round === 1 ? 'Quarter Finals' : round === 2 ? 'Semi Finals' : 'Grand Final';
                    
                    return (
                        <div key={round} className="flex flex-col justify-around h-full flex-1 relative">
                            <h4 className="absolute -top-6 left-0 w-full text-center text-xs font-bold uppercase text-gray-400 tracking-wider">{title}</h4>
                            {matches.map((match, mIndex) => (
                                <div key={match.id} className="relative flex flex-col justify-center my-4">
                                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm relative z-10 w-full">
                                        <div className={`flex justify-between p-2 border-b border-gray-100 dark:border-gray-700 ${match.winner === match.team1.name ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                                            <span className="font-bold text-sm truncate">{match.team1.name}</span>
                                            <span className="font-mono font-bold">{match.team1.score ?? '-'}</span>
                                        </div>
                                        <div className={`flex justify-between p-2 ${match.winner === match.team2.name ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                                            <span className="font-bold text-sm truncate">{match.team2.name}</span>
                                            <span className="font-mono font-bold">{match.team2.score ?? '-'}</span>
                                        </div>
                                    </div>
                                    {/* Connecting Lines Logic */}
                                    {round < 3 && (
                                        <div className={`absolute top-1/2 -right-8 w-8 h-px bg-gray-300 dark:bg-gray-600`}></div>
                                    )}
                                    {/* Vertical Connectors for next round would go here in a complex implementation */}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default TournamentBracket;
