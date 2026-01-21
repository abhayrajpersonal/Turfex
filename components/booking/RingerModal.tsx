
import React, { useState } from 'react';
import { X, Megaphone, Clock, Coins } from 'lucide-react';
import { Sport } from '../../lib/types';

interface RingerModalProps {
  onClose: () => void;
  onSubmit: (role: string, bounty: string) => void;
}

const ROLES = ['Goalkeeper', 'Striker', 'Defender', 'All-Rounder', 'Batsman', 'Bowler'];

const RingerModal: React.FC<RingerModalProps> = ({ onClose, onSubmit }) => {
  const [role, setRole] = useState(ROLES[0]);
  const [bounty, setBounty] = useState('Free Game'); // or amount

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-2xl w-full max-w-sm p-6 relative animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
        
        <div className="mb-6 text-center">
           <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-500">
                <Megaphone size={32} />
           </div>
           <h3 className="text-xl font-bold text-midnight dark:text-white">Find a Sub (Ringer)</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400">Broadcast a request to nearby players.</p>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Position Needed</label>
                <select 
                   value={role} 
                   onChange={(e) => setRole(e.target.value)}
                   className="w-full bg-gray-50 dark:bg-gray-800 border-none p-3 rounded-xl font-bold text-sm outline-none"
                >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Offer / Bounty</label>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setBounty('Free Game')}
                        className={`p-3 rounded-xl border text-sm font-bold ${bounty === 'Free Game' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 dark:bg-gray-800 border-transparent'}`}
                    >
                        Free Game
                    </button>
                    <button 
                         onClick={() => setBounty('Split Cost')}
                         className={`p-3 rounded-xl border text-sm font-bold ${bounty === 'Split Cost' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 dark:bg-gray-800 border-transparent'}`}
                    >
                        Split Cost
                    </button>
                </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl flex gap-3 items-start">
                <Clock className="text-orange-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-orange-700 dark:text-orange-300">
                    This will send a push notification to 50+ eligible players in a 5km radius.
                </p>
            </div>

            <button 
                onClick={() => onSubmit(role, bounty)}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:bg-orange-600"
            >
                <Megaphone size={18} /> Broadcast Alert
            </button>
        </div>
      </div>
    </div>
  );
};

export default RingerModal;
