
import React from 'react';
import OwnerDashboard from '../../components/OwnerDashboard';
import { useData } from '../../context/DataContext';
import { Booking, Sport } from '../../lib/types';

const DashboardScreen: React.FC = () => {
  const { bookings, addBooking } = useData();

  const handleOwnerOfflineBooking = (partialBooking: any) => {
      const newBooking: Booking = {
          id: `off-${Date.now()}`,
          turf_id: 't1', // Mocking current turf
          user_id: 'walk-in',
          end_time: partialBooking.start_time, // Mock
          is_recurring: false,
          ...partialBooking
      };
      addBooking(newBooking);
  };

  return <OwnerDashboard bookings={bookings} onAddOfflineBooking={handleOwnerOfflineBooking} />;
};

export default DashboardScreen;
