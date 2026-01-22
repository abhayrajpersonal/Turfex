
import React from 'react';
import { Users, Plus, Award } from 'lucide-react';
import { Team } from '../../../lib/types';
import { SPORTS_ICONS } from '../../../lib/constants';

interface MyTeamsListProps {
  teams: Team[];
  onCreateTeam: () => void;
  onTeamClick?: (team: Team) => void;
}

const MyTeamsList: React.FC<MyTeamsListProps> = ({ teams, onCreateTeam, onTeamClick }) => {
  return (
    <div className="bg-white dark:bg-darkcard p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
       <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-lg text-midnight dark:text-white flex items-center gap-2">
               <Users size={20} className="text-electric" /> My Teams
           </h3>
           <button 
             onClick={onCreateTeam}
             className="text-xs bg-electric/10 text-electric px-3 py-1.5 rounded-lg font-bold hover:bg-electric/20 active:scale-95 transition-all flex items-center gap-1"
           >
               <Plus size={14} /> Create
           </button>
       </div>
       
       <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide snap-x">
           {teams.length > 0 ? teams.map(team => (
               <div 
                 key={team.id} 
                 onClick={() => onTeamClick && onTeamClick(team)}
                 className="min-w-[240px] bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 snap-start hover:border-electric dark:hover:border-electric transition-colors group cursor-pointer shadow-sm"
               >
                   <div className="flex items-center gap-3 mb-4">
                       <img src={team.logo_url} className="w-12 h-12 rounded-full bg-white object-cover shadow-sm border-2 border-white dark:border-gray-600 group-hover:scale-110 transition-transform" alt={team.name} />
                       <div className="min-w-0">
                           <h4 className="font-bold text-sm text-midnight dark:text-white truncate">{team.name}</h4>
                           <span className="text-[10px] text-gray-500 font-bold uppercase bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-100 dark:border-gray-600">{SPORTS_ICONS[team.primary_sport]} {team.primary_sport}</span>
                       </div>
                   </div>
                   <div className="flex justify-between text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-3">
                       <span className="font-medium">{team.members.length} Members</span>
                       <span className="font-bold text-green-600 flex items-center gap-1"><Award size={12}/> {team.wins} Wins</span>
                   </div>
               </div>
           )) : (
               <div className="w-full text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                   <Users size={32} className="mx-auto text-gray-300 mb-2" />
                   <p className="text-gray-400 text-sm font-medium">No teams yet.</p>
                   <button onClick={onCreateTeam} className="text-electric text-xs font-bold mt-1 hover:underline">Create your first squad</button>
               </div>
           )}
       </div>
    </div>
  );
};

export default MyTeamsList;
