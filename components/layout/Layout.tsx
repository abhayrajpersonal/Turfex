
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
  // Default to Dark Mode for the brand identity
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [bellShake, setBellShake] = useState(false);

  useEffect(() => {
    // Dynamically update the html class
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
    <div className="min-h-[100dvh] md:h-[100dvh] md:overflow-hidden bg-gray-50 dark:bg-black text-midnight dark:text-white flex flex-col md:flex-row font-sans transition-colors duration-200 selection:bg-volt selection:text-black relative">
      
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
      <main className="flex-1 md:overflow-y-auto bg-gray-50 dark:bg-black relative z-10 w-full transition-colors duration-200">
        {/* Background Mesh - Visible mostly in dark mode */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none fixed"></div>
        
        <div className="w-full max-w-[1600px] mx-auto p-4 xs:p-5 md:p-8 pb-28 md:pb-8 relative z-10">
           {children}
        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Layout;
