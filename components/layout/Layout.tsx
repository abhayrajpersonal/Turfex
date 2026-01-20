
import React, { useEffect } from 'react';
import { User, Home, Calendar, Trophy, MapPin, Menu, X, LogOut, Briefcase, Moon, Sun, Crown, Bell } from 'lucide-react';
import { UserProfile, UserType, UserTier } from '../../lib/types';
import Logo from '../common/Logo';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onUpgrade: () => void;
  notificationCount?: number;
  onOpenNotifications?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab, onUpgrade, notificationCount = 0, onOpenNotifications }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMenuOpen(false);
      }}
      aria-current={activeTab === id ? 'page' : undefined}
      className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl w-full transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 dark:focus-visible:ring-offset-darkcard ${
        activeTab === id 
          ? 'bg-electric/10 text-electric font-bold' 
          : 'text-courtgray dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-midnight dark:hover:text-white'
      }`}
    >
      <Icon size={20} className={activeTab === id ? 'stroke-[2.5px]' : ''} aria-hidden="true" />
      <span>{label}</span>
      {activeTab === id && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-electric rounded-r-full" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-offwhite dark:bg-darkbg flex flex-col md:flex-row font-sans transition-colors duration-200 selection:bg-electric selection:text-white">
      {/* Mobile Header (Glassmorphism) */}
      <div className="md:hidden bg-white/80 dark:bg-darkcard/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 p-4 flex justify-between items-center sticky top-0 z-50">
        <Logo size={32} />
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)} 
             aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
             className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-midnight dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric"
           >
             {isDarkMode ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
           </button>
           <button 
             onClick={onOpenNotifications} 
             aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} new)` : ''}`}
             className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-midnight dark:text-white relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric"
           >
             <Bell size={20} aria-hidden="true" />
             {notificationCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-turfgreen rounded-full ring-2 ring-white dark:ring-darkcard"></span>}
           </button>
           <button 
             onClick={toggleMenu} 
             aria-label="Toggle Menu"
             aria-expanded={isMenuOpen}
             className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-midnight dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric"
           >
             {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
           </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white/95 dark:bg-darkbg/95 backdrop-blur-xl z-40 pt-24 px-6 animate-scale-in">
           <nav className="space-y-3">
            <NavItem id="discover" icon={MapPin} label="Discover" />
            <NavItem id="matches" icon={Calendar} label="My Matches" />
            <NavItem id="social" icon={User} label="Social & Profile" />
            <NavItem id="leaderboard" icon={Trophy} label="Leaderboard" />
            {user?.user_type === UserType.OWNER && (
               <NavItem id="dashboard" icon={Briefcase} label="Owner Dashboard" />
            )}
            <div className="pt-8 mt-4 border-t border-gray-100 dark:border-gray-800">
               <button 
                 onClick={onLogout} 
                 className="flex items-center space-x-2 px-4 py-3 text-red-500 w-full hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500"
               >
                  <LogOut size={20} aria-hidden="true" />
                  <span>Logout</span>
               </button>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-darkcard border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0 z-10">
        <div className="p-8">
          <Logo size={40} />
          <p className="text-xs text-courtgray mt-4 font-bold tracking-widest uppercase">Sports Community</p>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          <NavItem id="discover" icon={MapPin} label="Discover" />
          <NavItem id="matches" icon={Calendar} label="My Matches" />
          <NavItem id="social" icon={User} label="Social & Profile" />
          <NavItem id="leaderboard" icon={Trophy} label="Leaderboard" />
          {user?.user_type === UserType.OWNER && (
              <NavItem id="dashboard" icon={Briefcase} label="Owner Dashboard" />
          )}
        </nav>

        {/* Upgrade Button - Visible ONLY to Players who are NOT Gold yet */}
        {user?.user_type === UserType.PLAYER && user?.tier !== UserTier.GOLD && (
          <div className="px-6 mb-6">
            <button 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-turfgreen to-emerald-600 text-white p-4 rounded-2xl shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all duration-300 group outline-none focus-visible:ring-4 focus-visible:ring-turfgreen/50 relative overflow-hidden"
            >
               {/* Sparkle effect */}
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
             <div className="flex items-center gap-3 bg-offwhite dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                 <button 
                   onClick={() => setIsDarkMode(!isDarkMode)} 
                   aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                   className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-courtgray dark:text-gray-200 hover:text-electric transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric"
                 >
                   {isDarkMode ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
                 </button>
                 <button 
                   onClick={onOpenNotifications} 
                   aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} new)` : ''}`}
                   className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-courtgray dark:text-gray-300 relative transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric"
                 >
                    <Bell size={16} aria-hidden="true" />
                    {notificationCount > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-turfgreen rounded-full border border-white dark:border-darkbg animate-pulse"></span>}
                 </button>
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
            className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-sm text-courtgray hover:text-red-500 transition-colors font-medium outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-offwhite dark:bg-darkbg text-midnight dark:text-white relative">
        <div className="p-4 md:p-8 pb-32 md:pb-8 max-w-6xl mx-auto">
           {children}
        </div>
      </main>

      {/* Floating Mobile Tab Bar (Glass Pill) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-full shadow-2xl shadow-black/10 px-6 py-4 flex justify-between items-center">
            <button 
              onClick={() => setActiveTab('discover')} 
              aria-label="Discover"
              aria-current={activeTab === 'discover' ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-xl ${activeTab === 'discover' ? 'text-electric -translate-y-1' : 'text-courtgray'}`}
            >
              <MapPin size={24} className={activeTab === 'discover' ? 'fill-current' : ''} aria-hidden="true" />
              {activeTab === 'discover' && <span className="text-[10px] font-bold mt-1 animate-scale-in">Explore</span>}
            </button>
            
            <button 
              onClick={() => setActiveTab('matches')} 
              aria-label="Matches"
              aria-current={activeTab === 'matches' ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-xl ${activeTab === 'matches' ? 'text-electric -translate-y-1' : 'text-courtgray'}`}
            >
              <Calendar size={24} className={activeTab === 'matches' ? 'fill-current' : ''} aria-hidden="true" />
              {activeTab === 'matches' && <span className="text-[10px] font-bold mt-1 animate-scale-in">Matches</span>}
            </button>
            
            <button 
              onClick={() => setActiveTab('social')} 
              aria-label="Profile"
              aria-current={activeTab === 'social' ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[48px] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-electric rounded-xl ${activeTab === 'social' ? 'text-electric -translate-y-1' : 'text-courtgray'}`}
            >
              <User size={24} className={activeTab === 'social' ? 'fill-current' : ''} aria-hidden="true" />
              {activeTab === 'social' && <span className="text-[10px] font-bold mt-1 animate-scale-in">Profile</span>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
