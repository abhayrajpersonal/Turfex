
import React from 'react';

interface CricketControlsProps {
  onUpdateScore: (runs: number, isWicket: boolean, isExtra: boolean) => void;
}

const CricketControls: React.FC<CricketControlsProps> = ({ onUpdateScore }) => {
  return (
      <div className="mt-6">
          <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3, 4, 6].map(run => (
                  <button key={run} onClick={() => onUpdateScore(run, false, false)} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800 font-black text-2xl text-midnight dark:text-white hover:bg-electric hover:text-white transition-colors shadow-sm">
                      {run}
                  </button>
              ))}
              <button onClick={() => onUpdateScore(0, false, false)} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800 font-black text-2xl text-gray-500 hover:bg-gray-200 transition-colors shadow-sm">
                  •
              </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
              <button onClick={() => onUpdateScore(1, false, true)} className="h-14 rounded-xl bg-orange-100 text-orange-700 font-bold text-lg hover:bg-orange-200">WD</button>
              <button onClick={() => onUpdateScore(1, false, true)} className="h-14 rounded-xl bg-orange-100 text-orange-700 font-bold text-lg hover:bg-orange-200">NB</button>
              <button onClick={() => onUpdateScore(0, true, false)} className="h-14 rounded-xl bg-red-500 text-white font-bold text-lg hover:bg-red-600 shadow-md shadow-red-500/30">OUT</button>
          </div>
      </div>
  );
};

export default CricketControls;
