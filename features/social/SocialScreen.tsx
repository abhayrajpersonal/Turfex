
import React from 'react';
import { Crown, Wallet, Shield, BadgeCheck, Copy, UserPlus, Flame, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { UserTier } from '../../lib/types';

const SocialScreen: React.FC = () => {
  const { user } = useAuth();
  const { activities } = useData();
  const { setActiveModal, showToast } = useUI();

  const copyReferral = () => {
     navigator.clipboard.writeText(user?.referral_code || '');
     showToast("Referral code copied!");
  };

  const sendFriendRequest = () => {
     showToast("Friend request sent!");
  };

  // Mock Tier Logic
  const nextTier = user?.tier === UserTier.FREE ? 'GOLD' : user?.tier === UserTier.GOLD ? 'PLATINUM' : 'MAX';
  const pointsRequired = user?.tier === UserTier.FREE ? 2000 : user?.tier === UserTier.GOLD ? 5000 : user?.turfex_points;
  const progressPercent = Math.min(100, (user?.turfex_points || 0) / (pointsRequired || 1) * 100);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white dark:bg-darkcard rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full -z-0" />

         <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
             <div className="relative group cursor-pointer">
                <img src={user?.avatar_url} className={`w-28 h-28 rounded-full object-cover border-4 ${user?.tier === UserTier.GOLD ? 'border-yellow-400' : 'border-gray-100 dark:border-gray-800'} shadow-lg group-hover:scale-105 transition-transform duration-500`} alt="Avatar" />
                {user?.tier === UserTier.GOLD && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md whitespace-nowrap">
                     <Crown size={10} fill="white" /> GOLD MEMBER
                  </div>
                )}
             </div>
             
             <div className="flex-1 text-center md:text-left w-full">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <h2 className="text-3xl font-display font-bold text-midnight dark:text-white">{user?.full_name}</h2>
                        {user?.kyc_status === 'VERIFIED' && <BadgeCheck className="text-blue-500" size={24} />}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">@{user?.username}</p>
                  </div>
                  <div className="flex gap-2 justify-center md:justify-end">
                    <button 
                      onClick={() => setActiveModal('wallet')}
                      className="bg-electric text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      <Wallet size={18} /> ₹{user?.wallet_balance.toLocaleString()}
                    </button>
                    <button 
                      onClick={() => setActiveModal('profile')}
                      className="bg-gray-100 dark:bg-gray-800 text-midnight dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
               </div>

               {/* Stats Row */}
               <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-100 dark:border-gray-800 py-4 my-4">
                  <div className="text-center md:text-left border-r border-gray-100 dark:border-gray-800 last:border-0">
                     <span className="block font-black text-2xl text-midnight dark:text-white">{user?.turfex_points}</span>
                     <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Points</span>
                  </div>
                  <div className="text-center md:text-left border-r border-gray-100 dark:border-gray-800 last:border-0">
                     <span className="block font-black text-2xl text-midnight dark:text-white">14</span>
                     <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Friends</span>
                  </div>
                  <div className="text-center md:text-left">
                     <span className="block font-black text-2xl text-orange-500 flex items-center justify-center md:justify-start gap-1"><Flame size={24} className="fill-orange-500" /> {user?.streak_days}</span>
                     <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Day Streak</span>
                  </div>
               </div>
               
               {/* Tier Progress */}
               {nextTier !== 'MAX' && (
                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <div className="flex justify-between text-xs font-bold mb-2">
                       <span className="text-gray-500">Progress to {nextTier}</span>
                       <span className="text-electric">{user?.turfex_points} / {pointsRequired} pts</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000" style={{width: `${progressPercent}%`}} />
                    </div>
                 </div>
               )}
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Badges */}
         <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-midnight dark:text-white flex items-center gap-2">
                <Shield size={20} className="text-gray-400" />
                Badges
                </h3>
                <span className="text-xs font-bold text-gray-400">{user?.badges.length} Earned</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {user?.badges.map(badge => (
                <div key={badge} className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/10 px-4 py-2 rounded-xl border border-orange-100 dark:border-orange-800/30">
                   <Star size={14} className="text-orange-500 fill-orange-500" />
                   <span className="text-sm font-bold text-orange-700 dark:text-orange-400">{badge}</span>
                </div>
              ))}
              {(!user?.badges || user.badges.length === 0) && (
                <p className="text-sm text-gray-500 italic">Play matches to earn badges!</p>
              )}
            </div>
         </div>
         
         {/* Referrals */}
         <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
               <h3 className="font-bold text-xl mb-1 flex items-center gap-2"><UserPlus size={20}/> Invite Friends</h3>
               <p className="text-white/80 text-sm mb-6">Earn 500 points for every friend who joins Turfex.</p>
            </div>
            <button 
               onClick={copyReferral}
               className="relative z-10 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:bg-white/30 transition-all active:scale-95"
            >
               <span className="font-mono font-bold tracking-widest text-lg">{user?.referral_code}</span>
               <div className="bg-white text-indigo-600 p-2 rounded-lg">
                   <Copy size={16} />
               </div>
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Activity Feed */}
         <div className="md:col-span-2 bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-lg text-midnight dark:text-white mb-6">Activity Feed</h3>
            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
               {activities.map(act => (
                  <div key={act.id} className="flex gap-4 relative">
                     <div className="relative z-10">
                        <img src={act.avatar_url} className="w-10 h-10 rounded-full object-cover border-4 border-white dark:border-darkcard" alt="Avatar"/>
                     </div>
                     <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl flex-1 -mt-1">
                        <p className="text-sm text-midnight dark:text-white"><span className="font-bold">{act.username}</span> {act.action} <span className="font-bold">{act.target}</span></p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">{act.timestamp}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Friend Search */}
         <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-midnight dark:text-white">Find Friends</h3>
                <button className="text-xs font-bold text-electric">View All</button>
            </div>
            <div className="flex gap-2 mb-6">
               <input placeholder="Search username" className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm px-4 py-3 dark:text-white outline-none focus:ring-2 focus:ring-electric/20 transition-all" />
            </div>
            <div className="space-y-4">
               {['Rahul K.', 'Sneha P.', 'Vikram S.'].map((name, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400`}>
                            {name.charAt(0)}
                        </div>
                        <div>
                            <span className="block text-sm font-bold dark:text-white group-hover:text-electric transition-colors">{name}</span>
                            <span className="text-xs text-gray-400">2 mutual friends</span>
                        </div>
                    </div>
                    <button onClick={sendFriendRequest} className="text-gray-400 hover:text-electric hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition-all"><UserPlus size={18}/></button>
                </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SocialScreen;
