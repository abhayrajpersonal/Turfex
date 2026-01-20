
import React from 'react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import BookingModal from './BookingModal';
import KycModal from './KycModal';
import EditProfileModal from './EditProfileModal';
import SubscriptionModal from './SubscriptionModal';
import WalletModal from './WalletModal';
import QRCodeModal from './QRCodeModal';
import ReviewModal from './ReviewModal';
import { MOCK_WALLET_TRANSACTIONS } from '../lib/mockData';
import { Booking, Sport } from '../lib/types';

const ModalManager: React.FC = () => {
  const { activeModal, setActiveModal, modalData, showToast } = useUI();
  const { user, updateProfile, completeKyc, upgradeTier, updateWallet } = useAuth();
  const { bookings, addBooking, addNotification } = useData();

  const handleClose = () => setActiveModal(null);

  const confirmBooking = (date: string, time: string, sport: Sport, addOns: string[], equipment: string[], price: number, splitWith: string[]) => {
    if (!user || !modalData?.turf) return;
    
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      turf_id: modalData.turf.id,
      user_id: user.id,
      sport: sport,
      start_time: `${date}T${time}`, 
      end_time: `${date}T${time}`,
      price: price, 
      status: 'CONFIRMED',
      turf: modalData.turf,
      payment_mode: splitWith.length > 0 ? 'SPLIT' : 'FULL',
      split_with: splitWith,
      is_recurring: false,
      rental_items: equipment,
      // @ts-ignore
      add_ons: addOns
    };

    addBooking(newBooking);
    updateWallet(-price);
    
    addNotification({
       id: `n-${Date.now()}`,
       user_id: user.id,
       type: 'BOOKING_CONFIRMED',
       message: `Booking confirmed at ${modalData.turf.name} for ${date}.`,
       is_read: false,
       created_at: new Date().toISOString()
    });

    handleClose();
    showToast(`Booked ${modalData.turf.name} successfully!`);
  };

  const handleWaitlist = () => {
      handleClose();
      showToast(`Added to Waitlist!`, 'success');
  };

  if (!activeModal || !user) return null;

  return (
    <>
      {activeModal === 'booking' && modalData?.turf && (
        <BookingModal 
           turf={modalData.turf} 
           existingBookings={bookings} 
           onClose={handleClose} 
           onConfirm={confirmBooking}
           onWaitlist={handleWaitlist}
        />
      )}
      {activeModal === 'review' && modalData && (
         <ReviewModal booking={modalData} onClose={handleClose} onSubmit={() => { handleClose(); showToast("Thanks!"); }} />
      )}
      {activeModal === 'kyc' && (
        <KycModal onClose={handleClose} onComplete={() => { completeKyc(); handleClose(); showToast("KYC Verified!"); }} />
      )}
      {activeModal === 'profile' && (
        <EditProfileModal user={user} onClose={handleClose} onSave={(n, c) => { updateProfile(n, c); handleClose(); showToast("Profile Updated!"); }} />
      )}
      {activeModal === 'subscription' && (
        <SubscriptionModal onClose={handleClose} onSubscribe={() => { upgradeTier(); handleClose(); showToast("Welcome to Gold!"); }} />
      )}
      {activeModal === 'wallet' && (
        <WalletModal user={user} transactions={MOCK_WALLET_TRANSACTIONS} onClose={handleClose} />
      )}
      {activeModal === 'qr' && modalData && (
        <QRCodeModal booking={modalData} onClose={handleClose} />
      )}
    </>
  );
};

export default ModalManager;
