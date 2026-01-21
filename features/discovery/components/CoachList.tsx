
import React from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import { Coach } from '../../../lib/types';

interface CoachListProps {
  coaches: Coach[];
  onBook: (coach: Coach) => void;
}

const CoachList: React.FC<CoachListProps> = ({ coaches, onBook }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
      {coaches.map(coach => (
        <div key={coach.id} className="bg-white dark:bg-darkcard p-5 rounded-2xl border border-gray-100 dark:border-white/5 dark:bg-gradient-to-b dark:from-white/5 dark:to-transparent shadow-sm flex gap-4 hover:shadow-lg transition-all group">
          <div className="relative shrink-0">
            <img src={coach.avatar_url} alt={coach.name} className="w-20 h-20 rounded-2xl object-cover bg-gray-100" />
            {coach.is_verified && (
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-1 rounded-full border-2 border-white dark:border-darkcard shadow-md">
                <ShieldCheck size={12} />
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-midnight dark:text-white leading-tight tracking-tight">{coach.name}</h3>
                <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-gradient-to-r from-yellow-500/10 to-yellow-500/20 px-1.5 py-0.5 rounded border border-yellow-500/20">
                  <Star size={10} fill="currentColor" /> {coach.rating}
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium mb-2">{coach.sport} • {coach.specialization}</p>
              <div className="flex gap-2">
                 <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider">{coach.experience} Exp.</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="font-black text-lg text-midnight dark:text-white font-mono">₹{coach.rate_per_session}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wide">/session</span>
              </div>
              <button 
                onClick={() => onBook(coach)}
                className="bg-midnight dark:bg-white text-white dark:text-midnight px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform shadow-lg shadow-gray-200/50 dark:shadow-none active:scale-[0.98]"
              >
                Book Session
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoachList;
