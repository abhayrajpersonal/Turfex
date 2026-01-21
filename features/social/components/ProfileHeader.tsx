
import React from 'react';
import { Crown, Wallet, BadgeCheck, Flame, Edit3 } from 'lucide-react';
import { UserProfile, UserTier } from '../../../lib/types';
import CountUp from '../../../components/common/CountUp';

interface ProfileHeaderProps {
  user: UserProfile;
  onOpenWallet: () => void;
  onEditProfile: () => void;
  nextTier: string;
  pointsRequired: number;
  progressPercent: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, onOpenWallet, onEditProfile, nextTier, pointsRequired, progressPercent 
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
       {/* Background Pattern */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 rounded-bl-full pointer-events-none" />
       
       {user?.tier === UserTier.GOLD && (
           <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-lg flex items-center gap-1 z-20">
               <Crown size={10} fill="currentColor" /> GOLD MEMBER
           </div>
       )}

       <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
           {/* Avatar */}
           <div className="relative group cursor-pointer flex-shrink-0">
              <div className={`w-28 h-28 rounded-xl border-2 ${user?.tier === UserTier.GOLD ? 'border-yellow-500' : 'border-gray-200 dark:border-zinc-700'} shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-gray-100 dark:bg-zinc-800`}>
                  {user?.avatar_url ? (
                      <img src={user.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-gray-300 dark:text-zinc-600">
                          {user?.full_name?.charAt(0) || 'U'}
                      </div>
                  )}
              </div>
              <button onClick={onEditProfile} className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-lg border border-zinc-700 shadow-md hover:bg-volt hover:text-black transition-colors">
                  <Edit3 size={14} />
              </button>
           </div>
           
           {/* Info & Actions */}
           <div className="flex-1 w-full text-center md:text-left">
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <h2 className="text-3xl font-display font-black text-midnight dark:text-white uppercase italic leading-none">{user?.full_name}</h2>
                      {user?.kyc_status === 'VERIFIED' && <BadgeCheck size={20} fill="currentColor" className="text-blue-500 dark:text-blue-400 flex-shrink-0" />}
                  </div>
                  <p className="text-gray-500 dark:text-zinc-400 font-mono text-xs">@{user?.username} • {user?.city}</p>
                </div>
                
                <button 
                    onClick={onOpenWallet}
                    className="bg-zinc-100 dark:bg-black border border-gray-200 dark:border-zinc-700 text-midnight dark:text-white px-4 py-2 rounded-lg text-xs font-bold hover:border-volt hover:text-volt transition-all flex items-center justify-center gap-2 self-center md:self-start"
                >
                    <Wallet size={16} /> ₹{user?.wallet_balance.toLocaleString()}
                </button>
             </div>

             {/* Stats Row */}
             <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-zinc-800 bg-gray-50 dark:bg-black/50 rounded-xl p-4 border border-gray-100 dark:border-zinc-800">
                <div className="text-center px-2">
                   <CountUp end={user?.turfex_points || 0} className="block font-black text-2xl text-midnight dark:text-white leading-none mb-1" />
                   <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Points</span>
                </div>
                <div className="text-center px-2">
                   <span className="block font-black text-2xl text-midnight dark:text-white leading-none mb-1">{user?.stats?.matches_played || 0}</span>
                   <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Matches</span>
                </div>
                <div className="text-center px-2">
                   <span className="block font-black text-2xl text-orange-500 leading-none mb-1 flex items-center justify-center gap-1"><Flame size={18} className="fill-orange-500" /> {user?.streak_days}</span>
                   <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Streak</span>
                </div>
             </div>
             
             {/* Tier Progress */}
             {nextTier !== 'MAX' && (
               <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                     <span className="text-zinc-500">Next Rank: {nextTier}</span>
                     <span className="text-volt">{user?.turfex_points} / {pointsRequired}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-volt transition-all duration-[1500ms] ease-out rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
               </div>
             )}
           </div>
       </div>
    </div>
  );
};

export default ProfileHeader;
