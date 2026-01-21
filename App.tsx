
import React from 'react';
import { Loader2, Bot, X } from 'lucide-react';
import Layout from './components/layout/Layout';
import ChatWindow from './components/ChatWindow';
import NotificationPanel from './components/feedback/NotificationPanel';
import ModalManager from './components/ModalManager';
import DevTools from './components/common/DevTools';

// Feature Screens
import LoginScreen from './features/auth/LoginScreen';
import DiscoverScreen from './features/discovery/DiscoverScreen';
import MyMatchesScreen from './features/booking/MyMatchesScreen';
import LeaderboardScreen from './features/social/LeaderboardScreen';
import SocialScreen from './features/social/SocialScreen';
import DashboardScreen from './features/dashboard/DashboardScreen';
import ScoreboardScreen from './features/scoreboard/ScoreboardScreen';
import MerchScreen from './features/merch/MerchScreen';
import SettingsScreen from './features/settings/SettingsScreen';

// Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider, useUI } from './context/UIContext';
import { DataProvider, useData } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { UserType } from './lib/types';

// The Main App Component logic isolated from Providers
const TurfexApp = () => {
  const { user, isLoading, logout } = useAuth();
  const { 
    activeTab, setActiveTab, setActiveModal, 
    isChatOpen, setIsChatOpen, 
    isNotificationPanelOpen, setIsNotificationPanelOpen 
  } = useUI();
  const { notifications, clearNotifications } = useData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="animate-spin text-black dark:text-white" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'discover': return <DiscoverScreen />;
      case 'matches': return <MyMatchesScreen />;
      case 'scoreboard': return <ScoreboardScreen />;
      case 'merch': return <MerchScreen />;
      case 'social': return <SocialScreen />;
      case 'leaderboard': return <LeaderboardScreen />;
      case 'settings': return <SettingsScreen />;
      case 'dashboard': 
        return (user.user_type === UserType.OWNER || user.user_type === UserType.MANAGER) ? <DashboardScreen /> : <DiscoverScreen />;
      default: return <DiscoverScreen />;
    }
  };

  // Adjust floating button position based on active tab
  const isLeaderboard = activeTab === 'leaderboard';
  const bottomPosition = isLeaderboard ? 'bottom-32 md:bottom-6' : 'bottom-24 md:bottom-6';

  return (
    <Layout 
      user={user} 
      onLogout={logout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      onUpgrade={() => setActiveModal('subscription', null)}
      notificationCount={notifications.filter(n => !n.is_read).length}
      onOpenNotifications={() => setIsNotificationPanelOpen(true)}
    >
      <div className="w-full h-full">
        {renderContent()}
      </div>

      {/* Floating Virtual Coach Button */}
      {user.user_type === UserType.PLAYER && (
          <button 
             onClick={() => setIsChatOpen(!isChatOpen)}
             className={`fixed ${bottomPosition} right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-40 active:scale-95 flex items-center justify-center border-2 border-white/10 ${isChatOpen ? 'bg-zinc-800 text-white' : 'bg-black text-volt hover:scale-110'}`}
             aria-label="Open Virtual Coach"
          >
             {isChatOpen ? <X /> : <Bot size={28} />}
          </button>
      )}

      {/* Global Overlays */}
      <NotificationPanel 
         isOpen={isNotificationPanelOpen} 
         onClose={() => setIsNotificationPanelOpen(false)} 
         notifications={notifications} 
         onClear={clearNotifications}
      />

      {isChatOpen && (
          <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} user={user} />
      )}

      <ModalManager />
      <DevTools />
    </Layout>
  );
};

// Root Component
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <UIProvider>
          <LanguageProvider>
             <TurfexApp /> 
          </LanguageProvider>
        </UIProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
