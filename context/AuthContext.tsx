
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserType, KycStatus, UserTier } from '../lib/types';
import { MOCK_USER, MOCK_OWNER_USER } from '../lib/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, city: string) => void;
  upgradeTier: () => void;
  completeKyc: () => void;
  updateWallet: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<UserProfile | null>('turfex_user', null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (phone: string) => {
    setIsLoading(true);
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (phone.endsWith('9')) {
          setUser(MOCK_OWNER_USER);
        } else {
          setUser(MOCK_USER);
        }
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('turfex_user');
  };

  const updateProfile = (name: string, city: string) => {
    if (user) setUser({ ...user, full_name: name, city });
  };

  const upgradeTier = () => {
    if (user) setUser({ ...user, tier: UserTier.GOLD });
  };

  const completeKyc = () => {
    if (user) setUser({ ...user, kyc_status: KycStatus.VERIFIED });
  };

  const updateWallet = (amount: number) => {
    if (user) setUser({ ...user, wallet_balance: user.wallet_balance + amount });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile, upgradeTier, completeKyc, updateWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
