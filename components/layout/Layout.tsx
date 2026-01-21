
import React, { useEffect, useState } from 'react';
import { UserProfile } from '../../lib/types';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileNav from './MobileNav';

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
  const [bellShake, setBellShake] = useState(false);

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

  useEffect(() => {
      if (notificationCount > 0) {
          setBellShake(true);
          const timer = setTimeout(() => setBellShake(false), 500);
          return () => clearTimeout(timer);
      }
  }, [notificationCount]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-offwhite dark:bg-darkbg flex flex-col md:flex-row font-sans transition-colors duration-200 selection:bg-electric selection:text-white relative">
      {/* Noise Texture Overlay */}
      <div className="bg-noise mix-blend-overlay pointer-events-none fixed inset-0 z-0"></div>

      <MobileHeader 
        user={user}
        toggleMenu={toggleMenu}
        isMenuOpen={isMenuOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        notificationCount={notificationCount}
        onOpenNotifications={onOpenNotifications || (() => {})}
        bellShake={bellShake}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
      />

      <Sidebar 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        onUpgrade={onUpgrade}
        notificationCount={notificationCount}
        onOpenNotifications={onOpenNotifications || (() => {})}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        bellShake={bellShake}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:overflow-y-auto bg-offwhite dark:bg-darkbg text-midnight dark:text-white relative z-10">
        <div className="p-4 md:p-8 pb-28 md:pb-8 max-w-6xl mx-auto">
           {children}
        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Layout;
