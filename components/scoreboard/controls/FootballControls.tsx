
import React from 'react';
import { Target } from 'lucide-react';

interface FootballControlsProps {
  teamA: string;
  teamB: string;
  onGoal: (team: 'A' | 'B') => void;
}

const FootballControls: React.FC<FootballControlsProps> = ({ teamA, teamB, onGoal }) => {
  return (
      <div className="flex justify-between items-center mt-8 gap-4">
          <button 
            onClick={() => onGoal('A')} 
            className="flex-1 py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-500/30 active:scale-95 transition-transform flex flex-col items-center hover:bg-blue-700 relative overflow-hidden"
          >
              <div className="absolute -right-4 -top-4 bg-white/10 w-20 h-20 rounded-full blur-xl"></div>
              <Target size={32} className="mb-2 text-blue-200" />
              <span>GOAL</span>
              <span className="text-xs font-bold opacity-80 mt-1 uppercase tracking-wider">{teamA}</span>
          </button>
          
          <button 
            onClick={() => onGoal('B')} 
            className="flex-1 py-6 bg-red-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-red-500/30 active:scale-95 transition-transform flex flex-col items-center hover:bg-red-700 relative overflow-hidden"
          >
              <div className="absolute -left-4 -top-4 bg-white/10 w-20 h-20 rounded-full blur-xl"></div>
              <Target size={32} className="mb-2 text-red-200" />
              <span>GOAL</span>
              <span className="text-xs font-bold opacity-80 mt-1 uppercase tracking-wider">{teamB}</span>
          </button>
      </div>
  );
};

export default FootballControls;
