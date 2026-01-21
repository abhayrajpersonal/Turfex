
import React from 'react';
import { Crown, Wallet, BadgeCheck, Flame } from 'lucide-react';
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
    <div className="bg-white dark:bg-darkcard rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
       {/* Background Decor */}
       <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full pointer-events-none" />

       <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
           {/* Avatar */}
           <div className="relative group cursor-pointer flex-shrink-0">
              <div className={`w-28 h-28 rounded-full border-4 ${user?.tier === UserTier.GOLD ? 'border-yellow-400' : 'border-gray-100 dark:border-gray-800'} shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-gray-200 dark:bg-gray-700`}>
                  {user?.avatar_url ? (
                      <img src={user.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-gray-400">
                          {user?.full_name?.charAt(0) || 'U'}
                      </div>
                  )}
              </div>
              {user?.tier === UserTier.GOLD && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap animate-scale-in border-2 border-white dark:border-darkcard">
                   <Crown size={10} fill="white" /> GOLD MEMBER
                </div>
              )}
           </div>
           
           {/* Info & Actions */}
           <div className="flex-1 w-full text-center md:text-left">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                      <h2 className="text-3xl font-display font-black text-midnight dark:text-white truncate">{user?.full_name}</h2>
                      {user?.kyc_status === 'VERIFIED' && <BadgeCheck className="text-blue-500 flex-shrink-0" size={24} />}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">@{user?.username}</p>
                </div>
                <div className="flex gap-2 justify-center md:justify-end">
                  <button 
                    onClick={onOpenWallet}
                    className="bg-electric text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Wallet size={18} /> ₹{user?.wallet_balance.toLocaleString()}
                  </button>
                  <button 
                    onClick={onEditProfile}
                    className="bg-gray-100 dark:bg-gray-800 text-midnight dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
                  >
                    Edit
                  </button>
                </div>
             </div>

             {/* Stats Row */}
             <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 border-t border-b border-gray-100 dark:border-gray-800 py-4 my-4">
                <div className="text-center px-2">
                   <CountUp end={user?.turfex_points || 0} className="block font-black text-2xl text-midnight dark:text-white" />
                   <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Points</span>
                </div>
                <div className="text-center px-2">
                   <span className="block font-black text-2xl text-midnight dark:text-white">14</span>
                   <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Friends</span>
                </div>
                <div className="text-center px-2">
                   <span className="block font-black text-2xl text-orange-500 flex items-center justify-center gap-1"><Flame size={20} className="fill-orange-500" /> {user?.streak_days}</span>
                   <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Streak</span>
                </div>
             </div>
             
             {/* Tier Progress */}
             {nextTier !== 'MAX' && (
               <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50">
                  <div className="flex justify-between text-xs font-bold mb-2">
                     <span className="text-gray-500">Progress to {nextTier}</span>
                     <span className="text-electric">{user?.turfex_points} / {pointsRequired} pts</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-[1500ms] ease-out rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
               </div>
             )}
           </div>
       </div>
    </div>
  );
};

export default ProfileHeader;
