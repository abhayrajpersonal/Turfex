
import React from 'react';
import OwnerDashboard from '../../components/OwnerDashboard';
import { useData } from '../../context/DataContext';
import { Booking, Sport } from '../../lib/types';
import { useUI } from '../../context/UIContext';

const DashboardScreen: React.FC = () => {
  const { bookings, addBooking } = useData();
  const { showToast } = useUI();

  const handleOwnerOfflineBooking = (partialBooking: any) => {
      const newBooking: Booking = {
          id: `off-${Date.now()}`,
          turf_id: 't1', // Mocking current turf
          end_time: partialBooking.start_time, // In real app, calculate based on duration
          is_recurring: false,
          user_id: partialBooking.user_id || 'walk-in',
          ...partialBooking
      };
      
      addBooking(newBooking);
      
      if (partialBooking.status === 'MAINTENANCE') {
          showToast("Slot blocked successfully", "success");
      } else {
          showToast("Offline booking confirmed", "success");
      }
  };

  return <OwnerDashboard bookings={bookings} onAddOfflineBooking={handleOwnerOfflineBooking} />;
};

export default DashboardScreen;
