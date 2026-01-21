
import React from 'react';
import { Menu, X, Moon, Sun, Bell, MapPin, Calendar, Trophy, Briefcase, LogOut, User, Gamepad2, ShoppingBag } from 'lucide-react';
import { UserProfile, UserType } from '../../lib/types';
import Logo from '../common/Logo';

interface MobileHeaderProps {
  user: UserProfile | null;
  toggleMenu: () => void;
  isMenuOpen: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
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
      className={`relative flex items-center space-x-3 px-4 py-3 rounded-2xl w-full transition-all duration-200 group ${
        activeTab === id 
          ? 'bg-electric/10 text-electric font-bold' 
          : 'text-courtgray dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-midnight dark:hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
);

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  user, toggleMenu, isMenuOpen, isDarkMode, setIsDarkMode, 
  notificationCount, onOpenNotifications, bellShake,
  activeTab, setActiveTab, onLogout
}) => {
  return (
    <>
      <div className="md:hidden bg-white/90 dark:bg-darkcard/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 p-4 flex justify-between items-center sticky top-0 z-[40]">
        <Logo size={32} />
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)} 
             className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-midnight dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric active:scale-[0.9] active:brightness-110"
           >
             {isDarkMode ? <Sun size={20} className="transition-transform hover:rotate-90 duration-500"/> : <Moon size={20} className="transition-transform hover:-rotate-12"/>}
           </button>
           <button 
             onClick={onOpenNotifications} 
             className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-midnight dark:text-white relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-electric active:scale-[0.9] ${bellShake ? 'animate-[wiggle_0.5s_ease-in-out]' : ''}`}
           >
             <Bell size={20} />
             {notificationCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-turfgreen rounded-full ring-2 ring-white dark:ring-darkcard animate-ping"></span>}
             {notificationCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-turfgreen rounded-full ring-2 ring-white dark:ring-darkcard"></span>}
           </button>
           <button 
             onClick={toggleMenu} 
             className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-midnight dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric active:scale-[0.9]"
           >
             {isMenuOpen ? <X /> : <Menu />}
           </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white/95 dark:bg-darkbg/95 backdrop-blur-xl z-[45] pt-24 px-6 animate-scale-in">
           <nav className="space-y-3">
            <NavItem id="discover" icon={MapPin} label="Discover" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="matches" icon={Calendar} label="My Matches" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="scoreboard" icon={Gamepad2} label="Scoreboard" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="merch" icon={ShoppingBag} label="Store" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="social" icon={User} label="Social & Profile" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            <NavItem id="leaderboard" icon={Trophy} label="Leaderboard" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            {user?.user_type === UserType.OWNER && (
               <NavItem id="dashboard" icon={Briefcase} label="Owner Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} onClick={toggleMenu} />
            )}
            <div className="pt-8 mt-4 border-t border-gray-100 dark:border-gray-800">
               <button 
                 onClick={onLogout} 
                 className="flex items-center space-x-2 px-4 py-3 text-red-500 w-full hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-[0.98]"
               >
                  <LogOut size={20} />
                  <span>Logout</span>
               </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
