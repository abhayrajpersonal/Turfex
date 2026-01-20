
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Booking, OpenMatch, Notification, ActivityLog, Turf, Sport } from '../lib/types';
import { MOCK_OPEN_MATCHES, MOCK_NOTIFICATIONS, MOCK_ACTIVITIES } from '../lib/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';

interface DataContextType {
  bookings: Booking[];
  openMatches: OpenMatch[];
  notifications: Notification[];
  activities: ActivityLog[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  joinMatch: (matchId: string) => void;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useLocalStorage<Booking[]>('turfex_bookings', []);
  const [openMatches, setOpenMatches] = useLocalStorage<OpenMatch[]>('turfex_matches', MOCK_OPEN_MATCHES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [activities, setActivities] = useState<ActivityLog[]>(MOCK_ACTIVITIES);

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

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <DataContext.Provider value={{ 
      bookings, 
      openMatches, 
      notifications, 
      activities, 
      addBooking, 
      cancelBooking, 
      joinMatch, 
      addNotification,
      clearNotifications
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
