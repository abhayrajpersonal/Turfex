
import React, { useState } from 'react';
import { X, Star, ThumbsUp, Zap } from 'lucide-react';
import { MOCK_SEARCHABLE_USERS } from '../../lib/mockData';

interface EndorsementModalProps {
  onClose: () => void;
  onSubmit: (skills: string[], playerId: string) => void;
}

const SKILLS = ['Pace', 'Finishing', 'Vision', 'Defense', 'Teamwork', 'Stamina', 'Dribbling', 'Reflexes'];

const EndorsementModal: React.FC<EndorsementModalProps> = ({ onClose, onSubmit }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Filter out current user in real app, here just taking slice
  const teammates = MOCK_SEARCHABLE_USERS.slice(1, 4);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 3) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedPlayer && selectedSkills.length > 0) {
        onSubmit(selectedSkills, selectedPlayer);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-2xl w-full max-w-sm p-6 relative animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
        
        <div className="mb-6 text-center">
           <div className="w-12 h-12 bg-electric/10 rounded-full flex items-center justify-center mx-auto mb-3 text-electric">
                <Zap size={24} />
           </div>
           <h3 className="text-xl font-bold text-midnight dark:text-white">Endorse Teammate</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400">Boost their Credibility Score!</p>
        </div>

        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Player</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {teammates.map(user => (
                        <button 
                            key={user.id}
                            onClick={() => setSelectedPlayer(user.id)}
                            className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${selectedPlayer === user.id ? 'border-electric bg-blue-50 dark:bg-blue-900/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" />
                            <span className="text-xs font-bold truncate w-14 text-center">{user.username}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Skills (Max 3)</label>
                <div className="flex flex-wrap gap-2">
                    {SKILLS.map(skill => (
                        <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${selectedSkills.includes(skill) ? 'bg-electric text-white border-electric' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                disabled={!selectedPlayer || selectedSkills.length === 0}
                onClick={handleSubmit}
                className="w-full bg-electric disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:shadow-none"
            >
                <ThumbsUp size={18} /> Submit Endorsement
            </button>
        </div>
      </div>
    </div>
  );
};

export default EndorsementModal;
