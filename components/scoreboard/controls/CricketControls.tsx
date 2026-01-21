
import React from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface CricketControlsProps {
  onUpdateScore: (runs: number, isWicket: boolean, isExtra: boolean) => void;
  onSwitchInnings: () => void;
  isBattingFirst?: boolean;
}

const CricketControls: React.FC<CricketControlsProps> = ({ onUpdateScore, onSwitchInnings }) => {
  return (
      <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scoring Pad</span>
              <button 
                onClick={onSwitchInnings}
                className="text-xs flex items-center gap-1 font-bold text-blue-500 hover:bg-blue-50/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-colors"
              >
                  <ArrowLeftRight size={12}/> Switch Innings
              </button>
          </div>
          
          {/* Numpad Layout: 3x3 Grid + Bottom Row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Row 1 */}
              <button onClick={() => onUpdateScore(0, false, false)} className="aspect-[4/3] rounded-2xl bg-zinc-800 border-2 border-zinc-700 font-bold text-3xl text-white hover:bg-zinc-700 transition-colors">0</button>
              <button onClick={() => onUpdateScore(1, false, false)} className="aspect-[4/3] rounded-2xl bg-zinc-800 border-2 border-zinc-700 font-bold text-3xl text-white hover:bg-zinc-700 transition-colors">1</button>
              <button onClick={() => onUpdateScore(2, false, false)} className="aspect-[4/3] rounded-2xl bg-zinc-800 border-2 border-zinc-700 font-bold text-3xl text-white hover:bg-zinc-700 transition-colors">2</button>
              
              {/* Row 2 */}
              <button onClick={() => onUpdateScore(3, false, false)} className="aspect-[4/3] rounded-2xl bg-zinc-800 border-2 border-zinc-700 font-bold text-3xl text-white hover:bg-zinc-700 transition-colors">3</button>
              <button onClick={() => onUpdateScore(4, false, false)} className="aspect-[4/3] rounded-2xl bg-purple-900/30 border-2 border-purple-500/50 text-purple-400 font-black text-3xl hover:bg-purple-900/50 transition-colors">4</button>
              <button onClick={() => onUpdateScore(6, false, false)} className="aspect-[4/3] rounded-2xl bg-volt/10 border-2 border-volt text-volt font-black text-3xl hover:bg-volt hover:text-black transition-colors">6</button>
              
              {/* Row 3 - Extras & Wicket */}
              <button onClick={() => onUpdateScore(1, false, true)} className="aspect-[4/3] rounded-2xl bg-orange-900/20 border-2 border-orange-500/50 text-orange-500 font-bold text-xl hover:bg-orange-900/40 transition-colors flex flex-col items-center justify-center leading-none">
                  WD <span className="text-[10px] opacity-70 mt-1">+1</span>
              </button>
              <button onClick={() => onUpdateScore(1, false, true)} className="aspect-[4/3] rounded-2xl bg-orange-900/20 border-2 border-orange-500/50 text-orange-500 font-bold text-xl hover:bg-orange-900/40 transition-colors flex flex-col items-center justify-center leading-none">
                  NB <span className="text-[10px] opacity-70 mt-1">+1</span>
              </button>
              <button onClick={() => onUpdateScore(0, true, false)} className="aspect-[4/3] rounded-2xl bg-red-600 border-2 border-red-500 text-white font-black text-xl hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                  OUT
              </button>
          </div>
      </div>
  );
};

export default CricketControls;
