
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { UserProfile } from '../lib/types';

interface EditProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (name: string, city: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.full_name);
  const [city, setCity] = useState(user.city);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-2xl w-full max-w-sm p-6 relative animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white"><X size={20}/></button>
        <h3 className="text-xl font-bold text-midnight dark:text-white mb-6">Edit Profile</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Full Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-midnight dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-electric/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">City</label>
            <input 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-midnight dark:text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-electric/20 outline-none"
            />
          </div>
          <button 
            onClick={() => onSave(name, city)}
            className="w-full bg-midnight dark:bg-white text-white dark:text-midnight font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-gray-200 transition-colors"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
