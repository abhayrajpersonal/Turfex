
import React from 'react';
import { User, Calendar, Trophy, MapPin, Briefcase, Moon, Sun, Crown, Bell, Gamepad2, ShoppingBag, LogOut, Gift, Settings } from 'lucide-react';
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
  toggleTheme: () => void;
  bellShake: boolean;
}

const NavItem = ({ id, icon: Icon, label, activeTab, setActiveTab }: { id: string, icon: any, label: string, activeTab: string, setActiveTab: (t: string) => void }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`group flex items-center space-x-4 px-6 py-4 w-full transition-all duration-200 border-r-2 outline-none ${
        isActive 
          ? 'border-volt text-midnight dark:text-white bg-gray-100 dark:bg-zinc-900' 
          : 'border-transparent text-gray-500 dark:text-zinc-500 hover:text-midnight dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900/50'
      }`}
    >
      <Icon size={20} className={`transition-colors ${isActive ? 'text-blue-600 dark:text-volt' : 'group-hover:text-midnight dark:group-hover:text-white'}`} strokeWidth={2} />
      <span className={`text-sm uppercase tracking-widest ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ 
  user, activeTab, setActiveTab, onLogout, onUpgrade, 
  notificationCount, onOpenNotifications, isDarkMode, toggleTheme, bellShake 
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
    <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-black border-r border-gray-200 dark:border-white/5 h-full z-30 overflow-y-auto transition-colors duration-200">
        <div className="p-8 border-b border-gray-100 dark:border-white/5">
          <Logo size={32} />
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          <NavItem id="discover" icon={MapPin} label={t('discover')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="matches" icon={Calendar} label={t('matches')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="scoreboard" icon={Gamepad2} label={t('scoreboard')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="merch" icon={ShoppingBag} label={t('store')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="social" icon={User} label={t('social')} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="leaderboard" icon={Trophy} label={t('leaderboard')} activeTab={activeTab} setActiveTab={setActiveTab} />
          {(user?.user_type === UserType.OWNER || user?.user_type === UserType.MANAGER) && (
              <NavItem id="dashboard" icon={Briefcase} label={t('dashboard')} activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
        </nav>

        <div className="px-6 mb-6">
            <button 
                onClick={() => setActiveModal('daily_spin')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-900 border border-gray-200 dark:border-zinc-800 text-midnight dark:text-white hover:border-blue-500 dark:hover:border-volt hover:text-blue-600 dark:hover:text-volt transition-colors text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
            >
                <Gift size={16} /> Daily Rewards
            </button>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-zinc-950 transition-colors">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                 <button 
                   onClick={onOpenNotifications} 
                   className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-midnight dark:hover:text-white relative transition-colors"
                 >
                    <Bell size={18} className={bellShake ? 'animate-pulse text-red-500 dark:text-volt' : ''} />
                    {notificationCount > 0 && <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-red-500 dark:bg-volt rounded-full"></span>}
                 </button>
                 <button
                    onClick={toggleLanguage}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-midnight dark:hover:text-white font-bold text-xs uppercase"
                 >
                     {language}
                 </button>
                 <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-midnight dark:hover:text-white transition-colors"
                 >
                     {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                 </button>
             </div>
           </div>
           
          <div className="flex items-center gap-4 mb-4 cursor-pointer group" onClick={() => setActiveTab('social')}>
             <div className="relative">
                <img src={user?.avatar_url || "https://picsum.photos/40"} alt="" className="w-10 h-10 object-cover grayscale group-hover:grayscale-0 transition-all border border-gray-300 dark:border-zinc-700 rounded-full" />
                {user?.tier === UserTier.GOLD && <div className="absolute -top-1 -right-1 bg-volt text-black p-0.5 rounded-full"><Crown size={8} fill="currentColor"/></div>}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-midnight dark:text-white font-display uppercase tracking-wide truncate">{user?.full_name || 'Guest'}</p>
                <p className="text-xs text-gray-500 dark:text-zinc-500 truncate font-mono">@{user?.username}</p>
             </div>
          </div>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className="flex items-center space-x-2 text-xs font-bold text-zinc-500 hover:text-midnight dark:hover:text-white transition-colors uppercase tracking-wider mb-3"
          >
            <Settings size={14} />
            <span>Settings</span>
          </button>

          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 text-xs font-bold text-zinc-500 hover:text-red-500 transition-colors uppercase tracking-wider"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
  );
};

export default Sidebar;
