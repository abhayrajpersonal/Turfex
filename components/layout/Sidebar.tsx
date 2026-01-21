
import React from 'react';
import { User, Calendar, Trophy, MapPin, Briefcase, Moon, Sun, Crown, Bell, Gamepad2, ShoppingBag, LogOut, HelpCircle, Phone, Globe, Gift } from 'lucide-react';
import { UserProfile, UserType, UserTier } from '../../lib/types';
import Logo from '../common/Logo';
import { useUI } from '../../context/UIContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  user: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onUpgrade: () => void;
  notificationCount: number;
  onOpenNotifications: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  bellShake: boolean;
}

const NavItem = ({ id, icon: Icon, label, activeTab, setActiveTab }: { id: string, icon: any, label: string, activeTab: string, setActiveTab: (t: string) => void }) => (
  <button
    onClick={() => setActiveTab(id)}
    aria-current={activeTab === id ? 'page' : undefined}
    className={`relative flex items-center space-x-3 px-4 py-3 rounded-2xl w-full transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 dark:focus-visible:ring-offset-darkcard active:scale-[0.98] ${
      activeTab === id 
        ? 'bg-electric/10 text-electric font-bold' 
        : 'text-courtgray dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-midnight dark:hover:text-white'
    }`}
  >
    <Icon size={20} className={`transition-transform ${activeTab === id ? 'scale-110 stroke-[2.5px]' : 'group-hover:scale-110'}`} aria-hidden="true" />
    <span>{label}</span>
    {activeTab === id && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-electric rounded-r-full animate-scale-in shadow-[0_0_10px_rgba(0,87,255,0.5)]" />
    )}
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  user, activeTab, setActiveTab, onLogout, onUpgrade, 
  notificationCount, onOpenNotifications, isDarkMode, setIsDarkMode, bellShake 
}) => {
  const { setActiveModal } = useUI();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
      const langs = ['en', 'hi', 'mr', 'kn'];
      const currentIdx = langs.indexOf(language);
      const nextLang = langs[(currentIdx + 1) % langs.length];
      setLanguage(nextLang as any);
  };

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-darkcard border-r border-gray-200 dark:border-gray-800 h-full z-30 overflow-y-auto">
        <div className="p-8">
          <Logo size={40} />
          <p className="text-xs text-courtgray mt-4 font-bold tracking-widest uppercase">Sports Community</p>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          <NavItem id="discover" icon={MapPin} label={t('discover')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="matches" icon={Calendar} label={t('matches')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="scoreboard" icon={Gamepad2} label={t('scoreboard')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="merch" icon={ShoppingBag} label={t('store')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="social" icon={User} label={t('social')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="leaderboard" icon={Trophy} label={t('leaderboard')} activeTab={activeTab} setActiveTab={setActiveTab} />
          {user?.user_type === UserType.OWNER && (
              <NavItem id="dashboard" icon={Briefcase} label={t('dashboard')} activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
        </nav>

        {/* Feature: Daily Spin */}
        <div className="px-6 mb-2">
            <button 
                onClick={() => setActiveModal('daily_spin')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-md hover:scale-[1.02] active:scale-95 transition-all text-sm font-bold"
            >
                <Gift size={18} /> Daily Spin
            </button>
        </div>

        {/* Upgrade Button */}
        {user?.user_type === UserType.PLAYER && user?.tier !== UserTier.GOLD && (
          <div className="px-6 mb-6">
            <button 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-turfgreen to-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group outline-none focus-visible:ring-4 focus-visible:ring-turfgreen/50 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-50">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="#CCFF00"><path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10Z"/></svg>
              </div>
              <div className="bg-white/20 p-1.5 rounded-full group-hover:rotate-12 transition-transform">
                 <Crown size={16} fill="white" aria-hidden="true" />
              </div>
              <span className="font-bold text-sm">Upgrade to Gold</span>
            </button>
          </div>
        )}

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2 bg-offwhite dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700">
                 <button 
                   onClick={() => setIsDarkMode(!isDarkMode)} 
                   className="p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm text-courtgray dark:text-gray-200 hover:text-electric transition-colors"
                 >
                   {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                 </button>
                 <button 
                   onClick={onOpenNotifications} 
                   className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl text-courtgray dark:text-gray-300 relative transition-colors"
                 >
                    <Bell size={16} className={bellShake ? 'animate-[wiggle_0.5s_ease-in-out]' : ''} />
                    {notificationCount > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-turfgreen rounded-full border border-white dark:border-darkbg animate-pulse"></span>}
                 </button>
                 <button
                    onClick={toggleLanguage}
                    className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl text-courtgray dark:text-gray-300 relative transition-colors font-bold text-xs"
                 >
                     {language.toUpperCase()}
                 </button>
             </div>
             
             {/* Help & Emergency */}
             <div className="flex gap-2">
                 <button onClick={() => setActiveModal('support')} className="p-2 text-gray-400 hover:text-blue-500"><HelpCircle size={18}/></button>
                 <button onClick={() => setActiveModal('emergency')} className="p-2 text-gray-400 hover:text-red-500"><Phone size={18}/></button>
             </div>
           </div>
           
          <div className="flex items-center p-3 mb-4 bg-offwhite dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group" tabIndex={0} role="button" aria-label="View Profile">
             <div className="relative">
                <img src={user?.avatar_url || "https://picsum.photos/40"} alt="" className="w-10 h-10 rounded-full mr-3 object-cover group-hover:scale-110 transition-transform" />
                {user?.tier === UserTier.GOLD && <div className="absolute -bottom-1 -right-1 bg-turfgreen rounded-full p-0.5 border-2 border-white dark:border-darkbg"><Crown size={8} fill="white" className="text-white"/></div>}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-midnight dark:text-white group-hover:text-electric transition-colors">{user?.full_name || 'Guest'}</p>
                <p className="text-xs text-courtgray dark:text-gray-400 truncate">@{user?.username}</p>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm text-courtgray hover:text-red-500 transition-colors font-medium outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xl active:scale-[0.98]"
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
  );
};

export default Sidebar;
