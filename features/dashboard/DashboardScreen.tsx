
import React from 'react';
import OwnerDashboard from '../../components/OwnerDashboard';
import { useData } from '../../context/DataContext';
import { Booking } from '../../lib/types';
import { useUI } from '../../context/UIContext';
import { api } from '../../services/api';

const DashboardScreen: React.FC = () => {
  const { bookings, addBooking } = useData();
  const { showToast } = useUI();

  const handleOwnerOfflineBooking = async (partialBooking: any) => {
      // Optimistic update
      const newBooking: Booking = {
          id: `off-${Date.now()}`,
          turf_id: 't1', // In real app, from user profile
          end_time: partialBooking.start_time, // should calculate +1 hr
          is_recurring: false,
          user_id: partialBooking.user_id || 'walk-in',
          ...partialBooking
      };
      
      addBooking(newBooking);
      
      // Real API Call to Block/Book
      await api.data.createBooking(newBooking);
      
      if (partialBooking.status === 'MAINTENANCE') {
          showToast("Slot blocked successfully", "success");
      } else {
          showToast("Offline booking confirmed", "success");
      }
  };

  return <OwnerDashboard bookings={bookings} onAddOfflineBooking={handleOwnerOfflineBooking} />;
};

export default DashboardScreen;
