
import React from 'react';
import { Loader2, MessageCircle, X } from 'lucide-react';
import Layout from './components/layout/Layout';
import ChatWindow from './components/ChatWindow';
import NotificationPanel from './components/feedback/NotificationPanel';
import ModalManager from './components/ModalManager';

// Feature Screens
import LoginScreen from './features/auth/LoginScreen';
import DiscoverScreen from './features/discovery/DiscoverScreen';
import MyMatchesScreen from './features/booking/MyMatchesScreen';
import LeaderboardScreen from './features/social/LeaderboardScreen';
import SocialScreen from './features/social/SocialScreen';
import DashboardScreen from './features/dashboard/DashboardScreen';
import ScoreboardScreen from './features/scoreboard/ScoreboardScreen';
import MerchScreen from './features/merch/MerchScreen';

// Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { UIProvider, useUI } from './context/UIContext';
import { DataProvider, useData } from './context/DataContext';
import { MOCK_CHATS } from './lib/mockData';
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-darkbg">
        <Loader2 className="animate-spin text-electric" size={48} />
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
      case 'dashboard': 
        return user.user_type === UserType.OWNER ? <DashboardScreen /> : <DiscoverScreen />;
      default: return <DiscoverScreen />;
    }
  };

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

      {/* Floating Chat Button - Moved UP to bottom-24 on mobile to clear nav pill */}
      {user.user_type === UserType.PLAYER && (
          <button 
             onClick={() => setIsChatOpen(!isChatOpen)}
             className="fixed bottom-24 md:bottom-6 right-6 bg-electric text-white p-4 rounded-full shadow-lg shadow-blue-500/40 hover:bg-blue-600 transition-all z-40 active:scale-95"
          >
             {isChatOpen ? <X /> : <MessageCircle />}
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
          <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} chats={MOCK_CHATS} user={user} />
      )}

      <ModalManager />
    </Layout>
  );
};

// Root Component
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <UIProvider>
           <TurfexApp /> 
        </UIProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
