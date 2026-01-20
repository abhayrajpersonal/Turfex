
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '../components/common/Toast';

export type ModalType = 'booking' | 'kyc' | 'profile' | 'subscription' | 'wallet' | 'qr' | 'review' | null;

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
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [activeModal, setActiveModalState] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const setActiveModal = (modal: ModalType, data: any = null) => {
    setModalData(data);
    setActiveModalState(modal);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
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
      setIsNotificationPanelOpen
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
