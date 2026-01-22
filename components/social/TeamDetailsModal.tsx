
import React from 'react';
import { X, Users, Trophy, MapPin, UserPlus, Settings } from 'lucide-react';
import { Team, UserProfile } from '../../lib/types';
import { useAuth } from '../../context/AuthContext';

interface TeamDetailsModalProps {
  team: Team;
  onClose: () => void;
  onAddMember: () => void;
}

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ team, onClose, onAddMember }) => {
  const { user } = useAuth();
  const isCaptain = user?.id === team.captain_id;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-darkcard rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh] animate-scale-in">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors"><X size={20}/></button>
            <div className="absolute -bottom-10 left-6 p-1 bg-white dark:bg-darkcard rounded-full">
                <img src={team.logo_url} alt={team.name} className="w-20 h-20 rounded-full object-cover" />
            </div>
        </div>

        <div className="pt-12 px-6 pb-6 flex-1 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-midnight dark:text-white leading-tight">{team.name}</h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={12} /> {team.city} • {team.primary_sport}</p>
                </div>
                {isCaptain && (
                    <button className="text-gray-400 hover:text-midnight dark:hover:text-white">
                        <Settings size={20} />
                    </button>
                )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 italic">
                "{team.description || 'No description yet.'}"
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Matches</p>
                    <p className="text-2xl font-black text-midnight dark:text-white">{team.matches_played}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-center border border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Win Rate</p>
                    <p className="text-2xl font-black text-green-500">
                        {team.matches_played > 0 ? Math.round((team.wins / team.matches_played) * 100) : 0}%
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-midnight dark:text-white flex items-center gap-2">
                        <Users size={18} className="text-electric" /> Roster
                    </h3>
                    {isCaptain && (
                        <button 
                            onClick={onAddMember}
                            className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                        >
                            <UserPlus size={14} /> Add Player
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {team.members.map((memberId, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-bold text-gray-600 text-xs">
                                {memberId.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-midnight dark:text-white">Player {memberId}</p>
                                <p className="text-[10px] text-gray-500">{memberId === team.captain_id ? 'Captain' : 'Member'}</p>
                            </div>
                            {memberId === team.captain_id && <Trophy size={14} className="text-yellow-500" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsModal;
