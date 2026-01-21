
import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, UserX } from 'lucide-react';
import { MOCK_SEARCHABLE_USERS } from '../lib/mockData';

interface ReportPlayerModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const REPORT_REASONS = [
    { id: 'no_show', label: 'No Show', desc: 'Did not turn up for the match' },
    { id: 'aggressive', label: 'Aggressive Behavior', desc: 'Verbal or physical abuse' },
    { id: 'late', label: 'Extremely Late', desc: 'Delayed the game significantly' },
    { id: 'payment', label: 'Payment Issue', desc: 'Refused to pay split share' },
];

const ReportPlayerModal: React.FC<ReportPlayerModalProps> = ({ onClose, onSubmit }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState('');

  // In a real app, pass players from the specific match context
  const players = MOCK_SEARCHABLE_USERS.slice(1, 5); 

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPlayer || !reason) return;
      
      onSubmit({ playerId: selectedPlayer, reason, details });
  };

  return (
    <div className="fixed inset-0 bg-red-900/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-2xl w-full max-w-sm p-6 relative animate-scale-in border-2 border-red-100 dark:border-red-900/30 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
        
        <div className="mb-6 text-center">
           <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
                <ShieldAlert size={32} />
           </div>
           <h3 className="text-xl font-bold text-red-600 dark:text-red-500">Report Player</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400">Help keep Turfex safe and fun.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Who are you reporting?</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {players.map(user => (
                        <button 
                            type="button"
                            key={user.id}
                            onClick={() => setSelectedPlayer(user.id)}
                            className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all min-w-[70px] ${selectedPlayer === user.id ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <div className="relative">
                                <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                                {selectedPlayer === user.id && <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><UserX size={10}/></div>}
                            </div>
                            <span className="text-xs font-bold truncate w-16 text-center">{user.username}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reason</label>
                <div className="space-y-2">
                    {REPORT_REASONS.map(r => (
                        <button
                            type="button"
                            key={r.id}
                            onClick={() => setReason(r.id)}
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${reason === r.id ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${reason === r.id ? 'border-red-500' : 'border-gray-300'}`}>
                                {reason === r.id && <div className="w-2 h-2 bg-red-500 rounded-full"/>}
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${reason === r.id ? 'text-red-700 dark:text-red-400' : 'text-midnight dark:text-white'}`}>{r.label}</p>
                                <p className="text-[10px] text-gray-500">{r.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Additional Details</label>
                <textarea 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-red-500 h-20 resize-none"
                    placeholder="Describe the incident..."
                />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg flex gap-2 items-start border border-yellow-200 dark:border-yellow-900/30">
                <AlertTriangle size={14} className="text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-yellow-700 dark:text-yellow-400 leading-tight">
                    False reporting may affect your own Karma Score. Only report genuine toxic behavior.
                </p>
            </div>

            <button 
                type="submit"
                disabled={!selectedPlayer || !reason}
                className="w-full bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                Submit Report
            </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPlayerModal;
