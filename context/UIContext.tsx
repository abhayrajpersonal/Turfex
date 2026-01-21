
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Toast from '../components/common/Toast';

export type ModalType = 'booking' | 'kyc' | 'profile' | 'subscription' | 'wallet' | 'qr' | 'review' | 'create_team' | 'live_match' | 'endorsement' | 'ringer' | 'bracket' | 'cart' | 'product_details' | 'tournament_register' | 'coach_booking' | 'daily_spin' | 'gallery' | 'support' | 'emergency' | 'report_player' | null;

interface UIContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType, data?: any) => void;
  modalData: any;
  showToast: (message: string, type?: 'success' | 'error') => void;
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  isNotificationPanelOpen: boolean;
  setIsNotificationPanelOpen: (isOpen: boolean) => void;
  showConfetti: boolean;
  triggerConfetti: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from URL
  const getInitialTab = () => {
      if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          return params.get('tab') || 'discover';
      }
      return 'discover';
  };

  const [activeTab, setActiveTabState] = useState<string>(getInitialTab);
  const [activeModal, setActiveModalState] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Sync Tab changes to URL
  const setActiveTab = (tab: string) => {
      setActiveTabState(tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url);
  };

  // Sync Modal changes to URL (Optional, mostly for sharing specific views)
  const setActiveModal = (modal: ModalType, data: any = null) => {
    setModalData(data);
    setActiveModalState(modal);
    
    // Only update URL for shareable modals like live matches
    if (modal === 'live_match' && data?.id) {
         const url = new URL(window.location.href);
         url.searchParams.set('match', data.id);
         window.history.pushState({}, '', url);
    } else if (modal === null) {
         const url = new URL(window.location.href);
         url.searchParams.delete('match');
         window.history.pushState({}, '', url);
    }
  };

  // Handle browser back/forward
  useEffect(() => {
      const handlePopState = () => {
          const params = new URLSearchParams(window.location.search);
          setActiveTabState(params.get('tab') || 'discover');
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const triggerConfetti = () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
  };

  return (
    <UIContext.Provider value={{
      activeTab,
      setActiveTab,
      activeModal,
      setActiveModal,
      modalData,
      showToast,
      isChatOpen,
      setIsChatOpen,
      isNotificationPanelOpen,
      setIsNotificationPanelOpen,
      showConfetti,
      triggerConfetti
    }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
