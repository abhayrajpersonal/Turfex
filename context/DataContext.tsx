
import React, { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import { Booking, OpenMatch, Notification, ActivityLog, Team, CartItem, Tournament, InventoryItem, Bid, Turf } from '../lib/types';
import { MOCK_OPEN_MATCHES, MOCK_NOTIFICATIONS, MOCK_ACTIVITIES, MOCK_TEAMS, MOCK_TOURNAMENTS, MOCK_TURFS, MOCK_BOOKINGS } from '../lib/mockData';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sendBrowserNotification } from '../lib/utils';

interface DataContextType {
  turfs: Turf[];
  bookings: Booking[];
  openMatches: OpenMatch[];
  notifications: Notification[];
  activities: ActivityLog[];
  teams: Team[];
  cart: CartItem[];
  tournaments: Tournament[];
  inventory: InventoryItem[];
  bids: Bid[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  joinMatch: (matchId: string) => void;
  addMatch: (match: OpenMatch) => void;
  updateMatch: (matchId: string, updates: Partial<OpenMatch>) => void;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
  createTeam: (team: Team) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  updateInventory: (items: InventoryItem[]) => void;
  placeBid: (bid: Bid) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // State
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [openMatches, setOpenMatches] = useState<OpenMatch[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);

  // Initial Load & Realtime Setup
  useEffect(() => {
    const fetchData = async () => {
        if (isSupabaseConfigured()) {
            const [turfRes, bRes, mRes, tRes] = await Promise.all([
                api.data.getTurfs(),
                api.data.getBookings(user?.id),
                api.data.getOpenMatches(),
                api.data.getTeams()
            ]);
            
            if (turfRes.data) setTurfs(turfRes.data as any);
            if (bRes.data) setBookings(bRes.data as any);
            if (mRes.data) setOpenMatches(mRes.data as any);
            if (tRes.data) setTeams(tRes.data as any);
            
            // Mock data for things not yet in DB
            setTournaments(MOCK_TOURNAMENTS);
            setActivities(MOCK_ACTIVITIES);
            
            // Fetch real notifications if table existed, otherwise mock
            setNotifications(MOCK_NOTIFICATIONS);
        } else {
            // Fallback to Mock / LocalStorage
            const storedBookings = window.localStorage.getItem('turfex_bookings');
            setBookings(storedBookings ? JSON.parse(storedBookings) : []);
            setTurfs(MOCK_TURFS);
            setOpenMatches(MOCK_OPEN_MATCHES);
            setTeams(MOCK_TEAMS);
            setTournaments(MOCK_TOURNAMENTS);
            setNotifications(MOCK_NOTIFICATIONS);
            setActivities(MOCK_ACTIVITIES);
        }
    };

    fetchData();

    // Realtime Subscriptions
    if (isSupabaseConfigured()) {
        const bookingsChannel = supabase!.channel('public:bookings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
                if (payload.eventType === 'INSERT') setBookings(prev => [payload.new as any, ...prev]);
                if (payload.eventType === 'UPDATE') setBookings(prev => prev.map(b => b.id === payload.new.id ? payload.new as any : b));
            })
            .subscribe();

        const matchesChannel = supabase!.channel('public:open_matches')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'open_matches' }, (payload) => {
                if (payload.eventType === 'INSERT') setOpenMatches(prev => [payload.new as any, ...prev]);
                if (payload.eventType === 'UPDATE') setOpenMatches(prev => prev.map(m => m.id === payload.new.id ? payload.new as any : m));
            })
            .subscribe();

        const notificationsChannel = supabase!.channel('public:notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id}` }, (payload) => {
                const newNotif = payload.new as Notification;
                setNotifications(prev => [newNotif, ...prev]);
                sendBrowserNotification('Turfex Alert', newNotif.message);
            })
            .subscribe();

        return () => {
            supabase!.removeChannel(bookingsChannel);
            supabase!.removeChannel(matchesChannel);
            supabase!.removeChannel(notificationsChannel);
        };
    }
  }, [user]);

  const refreshData = async () => {
      // Manual refresh logic if needed
  };

  // Actions
  const addBooking = async (booking: Booking) => {
    // Optimistic Update
    setBookings(prev => [booking, ...prev]);
    // API Call
    const { error } = await api.data.createBooking(booking);
    if (error) {
        console.error('Booking failed', error);
    } else if (!isSupabaseConfigured()) {
        // Persist to local storage if demo
        const current = JSON.parse(window.localStorage.getItem('turfex_bookings') || '[]');
        window.localStorage.setItem('turfex_bookings', JSON.stringify([booking, ...current]));
    }
  };

  const cancelBooking = async (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
    await api.data.cancelBooking(bookingId);
  };

  const joinMatch = async (matchId: string) => {
    if (!user) return;
    setOpenMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return { ...m, joined_players: [...m.joined_players, user.id] };
      }
      return m;
    }));
    await api.data.joinMatch(matchId, user.id);
  };

  const addMatch = async (match: OpenMatch) => {
      setOpenMatches(prev => [match, ...prev]);
      await api.data.createMatch(match);
  };

  const updateMatch = async (matchId: string, updates: Partial<OpenMatch>) => {
    setOpenMatches(prev => prev.map(m => m.id === matchId ? { ...m, ...updates } : m));
    await api.data.updateMatch(matchId, updates);
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const createTeam = (team: Team) => {
    setTeams(prev => [team, ...prev]);
  };

  const updateTournament = (id: string, updates: Partial<Tournament>) => {
      setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const updateInventory = (items: InventoryItem[]) => {
      setInventory(items);
  };

  const placeBid = (bid: Bid) => {
      setBids(prev => [...prev, bid]);
  };

  // Cart Functions (Client Side Only)
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedColor === item.selectedColor && i.selectedSize === item.selectedSize);
      if (existing) {
        return prev.map(i => i.cartItemId === existing.cartItemId ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.cartItemId === cartItemId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <DataContext.Provider value={{ 
      turfs, bookings, openMatches, notifications, activities, teams, cart, tournaments, inventory, bids,
      addBooking, cancelBooking, joinMatch, addMatch, updateMatch, addNotification, clearNotifications,
      createTeam, addToCart, removeFromCart, updateCartQuantity, clearCart, updateTournament, updateInventory, placeBid, refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
