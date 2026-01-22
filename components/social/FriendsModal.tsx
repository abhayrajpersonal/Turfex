
import React, { useState } from 'react';
import { X, Search, UserPlus, MessageCircle } from 'lucide-react';
import { MOCK_SEARCHABLE_USERS } from '../../lib/mockData';
import { useUI } from '../../context/UIContext';

interface FriendsModalProps {
  onClose: () => void;
}

const FriendsModal: React.FC<FriendsModalProps> = ({ onClose }) => {
  const { showToast, setIsChatOpen } = useUI();
  const [activeTab, setActiveTab] = useState<'MY_FRIENDS' | 'ADD_FRIEND'>('MY_FRIENDS');
  const [search, setSearch] = useState('');

  // Mock Data
  const friends = MOCK_SEARCHABLE_USERS.slice(0, 3);
  const suggestions = MOCK_SEARCHABLE_USERS.slice(3);

  const handleAdd = (name: string) => {
      showToast(`Friend request sent to ${name}`, 'success');
  };

  const handleMessage = (name: string) => {
      onClose();
      setIsChatOpen(true);
      showToast(`Chat started with ${name}`, 'success');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-md h-[600px] flex flex-col shadow-2xl relative animate-scale-in">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-midnight dark:text-white">Connections</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"><X size={20} className="text-gray-500 dark:text-gray-400"/></button>
        </div>

        <div className="flex p-2 gap-2 bg-gray-50 dark:bg-zinc-900 mx-6 mt-4 rounded-xl">
            <button 
                onClick={() => setActiveTab('MY_FRIENDS')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'MY_FRIENDS' ? 'bg-white dark:bg-black shadow-sm text-midnight dark:text-white' : 'text-gray-500'}`}
            >
                My Friends
            </button>
            <button 
                onClick={() => setActiveTab('ADD_FRIEND')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'ADD_FRIEND' ? 'bg-white dark:bg-black shadow-sm text-midnight dark:text-white' : 'text-gray-500'}`}
            >
                Find People
            </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
            {activeTab === 'MY_FRIENDS' ? (
                <div className="space-y-4">
                    {friends.map(friend => (
                        <div key={friend.id} className="flex items-center gap-4">
                            <div className="relative">
                                <img src={friend.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-darkcard"></div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-midnight dark:text-white">{friend.username}</h4>
                                <p className="text-xs text-gray-500">Online now</p>
                            </div>
                            <button 
                                onClick={() => handleMessage(friend.username)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                            >
                                <MessageCircle size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by username..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-electric"
                        />
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Suggestions</h4>
                        <div className="space-y-4">
                            {suggestions.map(user => (
                                <div key={user.id} className="flex items-center gap-4">
                                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-midnight dark:text-white">{user.username}</h4>
                                        <p className="text-[10px] text-gray-500">Mutual friends: 2</p>
                                    </div>
                                    <button 
                                        onClick={() => handleAdd(user.username)}
                                        className="text-xs font-bold bg-electric text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-600 transition-colors"
                                    >
                                        <UserPlus size={14} /> Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
