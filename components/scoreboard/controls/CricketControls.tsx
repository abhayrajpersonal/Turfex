
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
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Runs</span>
              <button 
                onClick={onSwitchInnings}
                className="text-xs flex items-center gap-1 font-bold text-blue-500 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                  <ArrowLeftRight size={12}/> Switch Innings
              </button>
          </div>
          
          <div className="grid grid-cols-4 gap-3 mb-4">
              {[0, 1, 2, 3, 4, 6].map(run => (
                  <button key={run} onClick={() => onUpdateScore(run, false, false)} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-800 font-black text-xl text-midnight dark:text-white hover:bg-electric hover:text-white transition-colors shadow-sm">
                      {run}
                  </button>
              ))}
          </div>
          
          <div className="grid grid-cols-3 gap-3">
              <button onClick={() => onUpdateScore(1, false, true)} className="h-14 rounded-xl bg-orange-100 text-orange-700 font-bold text-lg hover:bg-orange-200 border border-orange-200">WD</button>
              <button onClick={() => onUpdateScore(1, false, true)} className="h-14 rounded-xl bg-orange-100 text-orange-700 font-bold text-lg hover:bg-orange-200 border border-orange-200">NB</button>
              <button onClick={() => onUpdateScore(0, true, false)} className="h-14 rounded-xl bg-red-500 text-white font-bold text-lg hover:bg-red-600 shadow-md shadow-red-500/30">OUT</button>
          </div>
      </div>
  );
};

export default CricketControls;
