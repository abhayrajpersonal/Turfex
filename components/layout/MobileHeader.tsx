
import React from 'react';
import { Menu, X, Moon, Sun, Bell, MapPin, Calendar, Trophy, Briefcase, LogOut, User, Gamepad2, ShoppingBag, Settings } from 'lucide-react';
import { UserProfile, UserType } from '../../lib/types';
import Logo from '../common/Logo';

interface MobileHeaderProps {
  user: UserProfile | null;
  toggleMenu: () => void;
  isMenuOpen: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  notificationCount: number;
  onOpenNotifications: () => void;
  bellShake: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const NavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, onClick }: any) => (
    <button
      onClick={() => {
        setActiveTab(id);
        onClick();
      }}
      className={`relative flex items-center space-x-4 px-4 py-4 w-full transition-all duration-200 border-l-2 ${
        activeTab === id 
          ? 'border-blue-600 dark:border-volt bg-gray-100 dark:bg-zinc-900 text-midnight dark:text-white font-bold' 
          : 'border-transparent text-gray-500 dark:text-zinc-500 hover:text-midnight dark:hover:text-white'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'text-blue-600 dark:text-volt' : ''} />
      <span className="uppercase tracking-widest text-sm">{label}</span>
    </button>
);

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  user, toggleMenu, isMenuOpen, isDarkMode, toggleTheme, 
  notificationCount, onOpenNotifications, bellShake,
  activeTab, setActiveTab, onLogout
}) => {
  return (
    <>
      <div className="md:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-white/10 p-4 flex justify-between items-center sticky top-0 z-[40] transition-colors">
        <Logo size={28} />
        <div className="flex items-center gap-2">
           <button 
             onClick={onOpenNotifications} 
             className={`p-2 flex items-center justify-center text-midnight dark:text-white relative hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all rounded-full ${bellShake ? 'animate-pulse' : ''}`}
           >
             <Bell size={20} />
             {notificationCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 dark:bg-volt rounded-full"></span>}
           </button>
           <button 
             onClick={toggleMenu} 
             className="p-2 flex items-center justify-center text-midnight dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
           >
             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-black z-[45] pt-24 px-0 animate-fade-in-up flex flex-col">
           <nav className="space-y-1 flex-1 overflow-y-auto">
            <NavItem id="discover" icon={MapPin} label="Discover" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="matches" icon={Calendar} label="Matches" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="scoreboard" icon={Gamepad2} label="Scoreboard" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="merch" icon={ShoppingBag} label="Store" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="social" icon={User} label="Profile" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="leaderboard" icon={Trophy} label="Rankings" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            {(user?.user_type === UserType.OWNER || user?.user_type === UserType.MANAGER) && (
               <NavItem id="dashboard" icon={Briefcase} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            )}
            <div className="h-px bg-gray-100 dark:bg-zinc-800 my-2 mx-4"></div>
            <NavItem id="settings" icon={Settings} label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
          </nav>
          
          <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-zinc-900 flex justify-between items-center shrink-0">
               <button 
                 onClick={toggleTheme}
                 className="flex items-center gap-2 text-sm font-bold text-midnight dark:text-white uppercase tracking-wider bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 px-4 py-3 rounded-lg shadow-sm"
               >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
               </button>

               <button 
                 onClick={onLogout} 
                 className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold uppercase tracking-wider text-sm"
               >
                  <LogOut size={18} />
               </button>
            </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
