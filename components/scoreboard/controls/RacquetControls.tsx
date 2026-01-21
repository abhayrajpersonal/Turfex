
import React from 'react';
import { ArrowLeftRight, Plus } from 'lucide-react';

interface RacquetControlsProps {
  teamA: string;
  teamB: string;
  server: 'A' | 'B';
  onPoint: (team: 'A' | 'B') => void;
  onToggleServer: () => void;
}

const RacquetControls: React.FC<RacquetControlsProps> = ({ teamA, teamB, server, onPoint, onToggleServer }) => {
  return (
      <div className="mt-6 space-y-6">
          <div className="flex justify-between items-center gap-4">
              <button 
                onClick={() => onPoint('A')} 
                className="flex-1 py-8 bg-blue-600 text-white rounded-2xl font-black text-2xl shadow-xl shadow-blue-500/30 active:scale-95 transition-transform flex flex-col items-center hover:bg-blue-700 relative overflow-hidden"
              >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <span className="relative z-10 flex items-center gap-1"><Plus size={24} strokeWidth={4}/> 1</span>
                  <span className="text-xs font-bold opacity-80 mt-1 uppercase tracking-wider relative z-10">{teamA}</span>
              </button>
              
              <button 
                onClick={() => onPoint('B')} 
                className="flex-1 py-8 bg-red-600 text-white rounded-2xl font-black text-2xl shadow-xl shadow-red-500/30 active:scale-95 transition-transform flex flex-col items-center hover:bg-red-700 relative overflow-hidden"
              >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <span className="relative z-10 flex items-center gap-1"><Plus size={24} strokeWidth={4}/> 1</span>
                  <span className="text-xs font-bold opacity-80 mt-1 uppercase tracking-wider relative z-10">{teamB}</span>
              </button>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Service</span>
              <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${server === 'A' ? 'text-blue-600' : 'text-gray-400'}`}>{teamA}</span>
                  <button 
                    onClick={onToggleServer}
                    className="p-2 bg-white dark:bg-darkcard rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:rotate-180 transition-transform"
                  >
                      <ArrowLeftRight size={16} className="text-midnight dark:text-white" />
                  </button>
                  <span className={`text-sm font-bold ${server === 'B' ? 'text-red-600' : 'text-gray-400'}`}>{teamB}</span>
              </div>
          </div>
      </div>
  );
};

export default RacquetControls;
