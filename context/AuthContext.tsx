
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserType, KycStatus, UserTier } from '../lib/types';
import { MOCK_USER, MOCK_OWNER_USER } from '../lib/mockData';
import { api } from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, city: string) => void;
  upgradeTier: () => void;
  completeKyc: () => void;
  updateWallet: (amount: number) => void;
  updateUserFields: (fields: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session?.user) {
          const { data: profile } = await api.auth.getProfile(session.user.id);
          if (profile) setUser(profile as UserProfile);
        }
      } else {
        // Load from local storage in demo mode
        const stored = window.localStorage.getItem('turfex_user');
        if (stored) setUser(JSON.parse(stored));
      }
      setIsLoading(false);
    };
    initSession();

    // Listen for auth changes
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
           const { data: profile } = await api.auth.getProfile(session.user.id);
           if (profile) setUser(profile as UserProfile);
        } else if (event === 'SIGNED_OUT') {
           setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (phone: string) => {
    setIsLoading(true);
    
    // DEMO MODE BYPASS
    if (!isSupabaseConfigured()) {
        setTimeout(() => {
            let mockUser = MOCK_USER;
            if (phone.endsWith('9')) mockUser = MOCK_OWNER_USER;
            if (phone.endsWith('8')) mockUser = { ...MOCK_OWNER_USER, id: 'm1', full_name: 'Manager Mike', user_type: UserType.MANAGER };
            
            setUser(mockUser);
            window.localStorage.setItem('turfex_user', JSON.stringify(mockUser));
            setIsLoading(false);
        }, 1000);
        return;
    }

    // REAL SUPABASE LOGIN
    const { error } = await api.auth.signInWithOtp(phone);
    if (error) {
        console.error('Login error:', error);
        alert('Error sending OTP: ' + error.message);
    }
    setIsLoading(false);
  };

  const verifyOtp = async (phone: string, token: string): Promise<boolean> => {
      if (!isSupabaseConfigured()) return true; // Already handled in login mock

      const { data, error } = await api.auth.verifyOtp(phone, token);
      if (error || !data.session?.user) {
          console.error('Verify error:', error);
          return false;
      }
      
      // Fetch or Create Profile
      let { data: profile } = await api.auth.getProfile(data.session.user.id);
      
      if (!profile) {
          // Create new profile
          const newProfile: UserProfile = {
              id: data.session.user.id,
              phone: phone,
              username: `user_${phone.slice(-4)}`,
              full_name: 'New Player',
              city: 'Mumbai',
              sports_preferences: [],
              user_type: UserType.PLAYER,
              kyc_status: KycStatus.NONE,
              turfex_points: 0,
              tier: UserTier.FREE,
              badges: [],
              wallet_balance: 0,
              streak_days: 0,
              referral_code: Math.random().toString(36).substring(7),
              stats: { matches_played: 0, matches_won: 0, man_of_the_match: 0, total_score: 0, mvp_badges: 0 }
          };
          // Insert logic should be here, but usually handled by DB triggers in Supabase
          // For now, let's assume we update it locally or via API
          setUser(newProfile);
      } else {
          setUser(profile as UserProfile);
      }
      return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
        await supabase!.auth.signOut();
    } else {
        window.localStorage.removeItem('turfex_user');
        setUser(null);
    }
  };

  const updateProfile = async (name: string, city: string) => {
    if (user) {
        const updated = { ...user, full_name: name, city };
        setUser(updated);
        if(isSupabaseConfigured()) await api.auth.updateProfile(user.id, { full_name: name, city });
        else window.localStorage.setItem('turfex_user', JSON.stringify(updated));
    }
  };

  const upgradeTier = async () => {
    if (user) {
        const updated = { ...user, tier: UserTier.GOLD };
        setUser(updated);
        if(isSupabaseConfigured()) await api.auth.updateProfile(user.id, { tier: UserTier.GOLD });
    }
  };

  const completeKyc = async () => {
    if (user) {
        const updated = { ...user, kyc_status: KycStatus.VERIFIED };
        setUser(updated);
        if(isSupabaseConfigured()) await api.auth.updateProfile(user.id, { kyc_status: KycStatus.VERIFIED });
    }
  };

  const updateWallet = async (amount: number) => {
    if (user) {
        const updated = { ...user, wallet_balance: user.wallet_balance + amount };
        setUser(updated);
        if(isSupabaseConfigured()) await api.auth.updateProfile(user.id, { wallet_balance: updated.wallet_balance });
    }
  };

  const updateUserFields = async (fields: Partial<UserProfile>) => {
      if (user) {
          const updated = { ...user, ...fields };
          setUser(updated);
          if(isSupabaseConfigured()) await api.auth.updateProfile(user.id, fields);
      }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, verifyOtp, logout, updateProfile, upgradeTier, completeKyc, updateWallet, updateUserFields }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
