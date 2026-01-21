
import React from 'react';
import { MapPin, ArrowRight, Zap } from 'lucide-react';
import { FriendActivity } from '../../../lib/types';

interface FriendsActivityListProps {
  activities: FriendActivity[];
  onInteract: (activity: FriendActivity) => void;
}

const FriendsActivityList: React.FC<FriendsActivityListProps> = ({ activities, onInteract }) => {
  if (activities.length === 0) return null;

  return (
    <div className="mb-2 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4 px-1">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Friends Active</h3>
          <span className="bg-green-500/10 text-green-600 text-[10px] font-black px-1.5 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {activities.length}
          </span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
        {activities.map(activity => (
          <div key={activity.id} className="min-w-[280px] bg-white dark:bg-darkcard border border-gray-100 dark:border-white/5 p-4 rounded-2xl shadow-sm flex items-center gap-4 group hover:border-volt transition-colors relative overflow-hidden">
             {/* Background Mesh */}
             <div className="absolute top-0 right-0 w-16 h-16 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 rotate-45 pointer-events-none"></div>

             <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-gray-200 to-white dark:from-zinc-700 dark:to-zinc-800 shadow-inner">
                    <img src={activity.avatar_url} className="w-full h-full rounded-full object-cover" alt={activity.username} />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-white dark:border-zinc-800 uppercase tracking-tighter">
                    {activity.sport}
                </div>
             </div>
             
             <div className="flex-1 min-w-0 z-10">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-midnight dark:text-white truncate">{activity.username}</h4>
                    {activity.status === 'LIVE' && <Zap size={12} className="text-volt fill-volt animate-pulse" />}
                </div>
                
                <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                    <MapPin size={10}/> {activity.turf_name}
                </p>
                
                <button 
                    onClick={() => onInteract(activity)}
                    className="mt-3 w-full bg-gray-50 dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-midnight dark:text-white text-[10px] font-bold py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1 active:scale-95"
                >
                    Join Next Game <ArrowRight size={10} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsActivityList;
