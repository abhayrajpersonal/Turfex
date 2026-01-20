
import React from 'react';

interface FootballControlsProps {
  teamA: string;
  teamB: string;
  onGoal: (team: 'A' | 'B') => void;
}

const FootballControls: React.FC<FootballControlsProps> = ({ teamA, teamB, onGoal }) => {
  return (
      <div className="flex justify-between items-center mt-8 gap-4">
          <button onClick={() => onGoal('A')} className="flex-1 py-8 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform flex flex-col items-center">
              <span>Goal</span>
              <span className="text-xs font-normal opacity-80 mt-1">{teamA}</span>
          </button>
          <button onClick={() => onGoal('B')} className="flex-1 py-8 bg-red-600 text-white rounded-2xl font-black text-xl shadow-lg active:scale-95 transition-transform flex flex-col items-center">
              <span>Goal</span>
              <span className="text-xs font-normal opacity-80 mt-1">{teamB}</span>
          </button>
      </div>
  );
};

export default FootballControls;
