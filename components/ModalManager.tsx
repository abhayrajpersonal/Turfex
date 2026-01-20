
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { MOCK_WALLET_TRANSACTIONS, MOCK_SEARCHABLE_USERS } from '../lib/mockData';
import { Booking, Sport, Team } from '../lib/types';

// Lazy Load Modals
const BookingModal = React.lazy(() => import('./BookingModal'));
const KycModal = React.lazy(() => import('./KycModal'));
const EditProfileModal = React.lazy(() => import('./EditProfileModal'));
const SubscriptionModal = React.lazy(() => import('./SubscriptionModal'));
const WalletModal = React.lazy(() => import('./WalletModal'));
const QRCodeModal = React.lazy(() => import('./QRCodeModal'));
const ReviewModal = React.lazy(() => import('./ReviewModal'));
const CreateTeamModal = React.lazy(() => import('./CreateTeamModal'));
const LiveMatchModal = React.lazy(() => import('./scoreboard/LiveMatchModal'));

const ModalLoader = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-sm">
    <Loader2 className="animate-spin text-electric" size={48} />
  </div>
);

const ModalManager: React.FC = () => {
  const { activeModal, setActiveModal, modalData, showToast } = useUI();
  const { user, updateProfile, completeKyc, upgradeTier, updateWallet } = useAuth();
  const { bookings, addBooking, addNotification, createTeam } = useData();

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
    
    // Notify current user
    addNotification({
       id: `n-${Date.now()}`,
       user_id: user.id,
       type: 'BOOKING_CONFIRMED',
       message: `Booking confirmed at ${modalData.turf.name} for ${date}.`,
       is_read: false,
       created_at: new Date().toISOString()
    });

    // Simulate sending payment requests to split users
    if (splitWith.length > 0) {
       splitWith.forEach(username => {
          // Check if it's a real user handle
          if (username.startsWith('@')) {
             const cleanName = username.substring(1).toLowerCase();
             const foundUser = MOCK_SEARCHABLE_USERS.find(u => u.username.toLowerCase() === cleanName);
             if (foundUser) {
                // In a real app, we would send this to the backend
                console.log(`Sending payment request to ${foundUser.id} (${foundUser.username})`);
                // Simulate a toast for the sender
             }
          }
       });
       setTimeout(() => {
           showToast(`Payment requests sent to ${splitWith.length} friends`, 'success');
       }, 500);
    }

    handleClose();
    if (splitWith.length === 0) {
        showToast(`Booked ${modalData.turf.name} successfully!`);
    }
  };

  const handleCreateTeam = (name: string, description: string, sport: Sport) => {
     if(!user) return;
     const newTeam: Team = {
         id: `tm-${Date.now()}`,
         name,
         description,
         captain_id: user.id,
         logo_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
         members: [user.id],
         matches_played: 0,
         wins: 0,
         city: user.city,
         primary_sport: sport
     };
     createTeam(newTeam);
     handleClose();
     showToast(`Team ${name} created successfully!`, 'success');
  };

  const handleWaitlist = () => {
      handleClose();
      showToast(`Added to Waitlist!`, 'success');
  };

  const handleShareMatch = () => {
      navigator.clipboard.writeText(`https://turfex.app/live/${modalData.id}`);
      showToast("Live Match Link Copied!", "success");
  };

  if (!activeModal || !user) return null;

  return (
    <Suspense fallback={<ModalLoader />}>
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
      {activeModal === 'create_team' && (
        <CreateTeamModal onClose={handleClose} onCreate={handleCreateTeam} />
      )}
      {activeModal === 'live_match' && modalData && (
        <LiveMatchModal match={modalData} onClose={handleClose} onShare={handleShareMatch} />
      )}
    </Suspense>
  );
};

export default ModalManager;
