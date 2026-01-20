
import React, { useState } from 'react';
import { X, Shield, Plus, Users, Flag } from 'lucide-react';
import { Sport } from '../lib/types';

interface CreateTeamModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string, sport: Sport) => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSport, setSelectedSport] = useState<Sport>(Sport.FOOTBALL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name, description, selectedSport);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-md p-6 relative animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white">
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-3">
             <Shield size={32} className="text-electric" />
          </div>
          <h3 className="text-xl font-bold text-midnight dark:text-white">Create Your Team</h3>
          <p className="text-sm text-gray-500">Form a squad, challenge others, and climb the leaderboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team Name</label>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl focus-within:ring-2 focus-within:ring-electric transition-all">
               <Flag size={18} className="text-gray-400" />
               <input 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder="e.g. Thunder Strikers"
                 className="bg-transparent w-full outline-none text-sm font-bold text-midnight dark:text-white placeholder-gray-400"
                 required
                 autoFocus
               />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Sport</label>
            <select 
               value={selectedSport}
               onChange={(e) => setSelectedSport(e.target.value as Sport)}
               className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl outline-none text-sm font-bold text-midnight dark:text-white focus:ring-2 focus:ring-electric transition-all"
            >
               {(Object.values(Sport) as string[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Motto / Description</label>
             <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="We play to win!"
               className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-xl outline-none text-sm text-midnight dark:text-white focus:ring-2 focus:ring-electric transition-all resize-none h-24"
             />
          </div>

          <button 
            type="submit"
            className="w-full bg-electric text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Create Team
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;
