
import React from 'react';
import { MapPin, GitCommit, Trophy } from 'lucide-react';
import { Tournament } from '../../../lib/types';

interface TournamentListProps {
  tournaments: Tournament[];
  onBracketClick: (t: Tournament) => void;
  onRegisterClick: (t: Tournament) => void;
}

const TournamentList: React.FC<TournamentListProps> = ({ tournaments, onBracketClick, onRegisterClick }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {tournaments.map(t => (
        <div key={t.id} className="bg-white dark:bg-darkcard rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row group hover:shadow-xl transition-all duration-300">
          <div className="md:w-1/3 h-56 md:h-auto relative overflow-hidden">
            <img src={t.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={t.name}/>
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-midnight uppercase tracking-wider">
              {t.sport}
            </div>
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-display font-bold text-2xl text-midnight dark:text-white mb-2">{t.name}</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1"><MapPin size={14}/> {t.location}</p>
              
              <div className="mt-6 flex gap-8 text-sm">
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Prize Pool</p>
                  <p className="font-black text-xl text-green-600 dark:text-green-400">₹{t.prize_pool.toLocaleString()}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Entry Fee</p>
                  <p className="font-bold text-lg text-midnight dark:text-white">₹{t.entry_fee}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Start Date</p>
                  <p className="font-bold text-lg text-midnight dark:text-white">{new Date(t.start_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-between items-end border-t border-gray-50 dark:border-gray-800 pt-4">
              <div>
                <p className="text-sm text-gray-500 mb-1"><span className="font-bold text-midnight dark:text-white">{t.registered_teams}/{t.max_teams}</span> Teams Registered</p>
                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{width: `${(t.registered_teams/t.max_teams)*100}%`}}></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onBracketClick(t)}
                  className="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-midnight dark:text-white px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                >
                  <GitCommit size={18} /> Bracket
                </button>
                <button 
                  onClick={() => onRegisterClick(t)} // This now opens the new modal via DiscoverScreen prop
                  className="bg-midnight dark:bg-white text-white dark:text-midnight px-6 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-lg shadow-gray-200/50 dark:shadow-none flex items-center gap-2"
                >
                   <Trophy size={16} /> Register Team
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentList;
