
import React, { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import { Booking, OpenMatch, Notification, ActivityLog, Turf, Sport, Team, CartItem, Tournament, InventoryItem, Bid } from '../lib/types';
import { MOCK_OPEN_MATCHES, MOCK_NOTIFICATIONS, MOCK_ACTIVITIES, MOCK_TEAMS, MOCK_TOURNAMENTS } from '../lib/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { sendBrowserNotification } from '../lib/utils';

interface DataContextType {
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
  addMatch: (match: OpenMatch) => void; // Added for Scoreboard
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useLocalStorage<Booking[]>('turfex_bookings', []);
  const [openMatches, setOpenMatches] = useLocalStorage<OpenMatch[]>('turfex_matches', MOCK_OPEN_MATCHES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activities, setActivities] = useState<ActivityLog[]>(MOCK_ACTIVITIES);
  const [teams, setTeams] = useLocalStorage<Team[]>('turfex_teams', MOCK_TEAMS);
  const [cart, setCart] = useLocalStorage<CartItem[]>('turfex_cart', []);
  const [tournaments, setTournaments] = useLocalStorage<Tournament[]>('turfex_tournaments', MOCK_TOURNAMENTS);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('turfex_inventory', []);
  const [bids, setBids] = useLocalStorage<Bid[]>('turfex_bids', []);

  // Refs for polling interval to access latest state
  const bookingsRef = useRef(bookings);
  const matchesRef = useRef(openMatches);
  const userRef = useRef(user);
  const notifiedEventsRef = useRef<Set<string>>(new Set());

  useEffect(() => { bookingsRef.current = bookings; }, [bookings]);
  useEffect(() => { matchesRef.current = openMatches; }, [openMatches]);
  useEffect(() => { userRef.current = user; }, [user]);

  // Reminder Polling Logic
  useEffect(() => {
    const checkUpcomingEvents = () => {
        const currentUser = userRef.current;
        if (!currentUser) return;

        const now = new Date();
        const upcomingThreshold = 60 * 60 * 1000; // 1 hour
        
        const notify = (id: string, startStr: string, title: string, body: string) => {
            if (notifiedEventsRef.current.has(id)) return;

            const startTime = new Date(startStr);
            const timeDiff = startTime.getTime() - now.getTime();

            // Notify if between 0 and 60 minutes
            if (timeDiff > 0 && timeDiff <= upcomingThreshold) {
                const mins = Math.ceil(timeDiff / 60000);
                const notificationTitle = `Upcoming: ${title}`;
                const notificationBody = `${body} starts in ${mins} mins!`;

                // Add to In-App
                const newNotif: Notification = {
                    id: `rem-${Date.now()}-${id}`,
                    user_id: currentUser.id,
                    type: 'SYSTEM',
                    message: notificationBody,
                    is_read: false,
                    created_at: new Date().toISOString()
                };
                setNotifications(prev => [newNotif, ...prev]);

                // Send Browser Push
                sendBrowserNotification(notificationTitle, notificationBody);

                // Mark as notified
                notifiedEventsRef.current.add(id);
            }
        };

        bookingsRef.current.forEach(b => {
            if (b.user_id === currentUser.id && b.status === 'CONFIRMED') {
                notify(b.id, b.start_time, 'Booking Reminder', `${b.sport} at ${b.turf?.name || 'Venue'}`);
            }
        });

        matchesRef.current.forEach(m => {
            if (m.joined_players.includes(currentUser.id) && m.status !== 'COMPLETED') {
                notify(m.id, m.start_time, 'Match Reminder', `${m.sport} Match`);
            }
        });
    };

    const intervalId = setInterval(checkUpcomingEvents, 60000); 
    checkUpcomingEvents(); 

    return () => clearInterval(intervalId);
  }, []); 

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
  };

  const joinMatch = (matchId: string) => {
    if (!user) return;
    setOpenMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return { ...m, joined_players: [...m.joined_players, user.id] };
      }
      return m;
    }));
  };

  const addMatch = (match: OpenMatch) => {
      setOpenMatches(prev => [match, ...prev]);
  };

  const updateMatch = (matchId: string, updates: Partial<OpenMatch>) => {
    setOpenMatches(prev => prev.map(m => m.id === matchId ? { ...m, ...updates } : m));
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

  // Cart Functions
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
      bookings, 
      openMatches, 
      notifications, 
      activities, 
      teams,
      cart,
      tournaments,
      inventory,
      bids,
      addBooking, 
      cancelBooking, 
      joinMatch,
      addMatch,
      updateMatch,
      addNotification,
      clearNotifications,
      createTeam,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      updateTournament,
      updateInventory,
      placeBid
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
