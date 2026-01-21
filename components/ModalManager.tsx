
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { MOCK_WALLET_TRANSACTIONS, MOCK_SEARCHABLE_USERS, MOCK_BRACKET } from '../lib/mockData';
import { Booking, Sport, Team, Tournament } from '../lib/types';
import Confetti from './common/Confetti';

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
const EndorsementModal = React.lazy(() => import('./social/EndorsementModal'));
const RingerModal = React.lazy(() => import('./booking/RingerModal'));
const TournamentBracket = React.lazy(() => import('./tournament/TournamentBracket'));
const ProductDetailsModal = React.lazy(() => import('./merch/ProductDetailsModal'));
const CartModal = React.lazy(() => import('./merch/CartModal'));
const TournamentRegistrationModal = React.lazy(() => import('./tournament/TournamentRegistrationModal'));
const CoachBookingModal = React.lazy(() => import('./CoachBookingModal'));

const ModalLoader = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-sm">
    <Loader2 className="animate-spin text-electric" size={48} />
  </div>
);

const ModalManager: React.FC = () => {
  const { activeModal, setActiveModal, modalData, showToast, triggerConfetti, showConfetti } = useUI();
  const { user, updateProfile, completeKyc, upgradeTier, updateWallet } = useAuth();
  const { bookings, addBooking, addNotification, createTeam, updateMatch, teams } = useData();

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

    handleClose();
    if (splitWith.length === 0) {
        showToast(`Booked ${modalData.turf.name} successfully!`, 'success');
        triggerConfetti();
    } else {
        showToast(`Payment requests sent to ${splitWith.length} friends`, 'success');
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
     triggerConfetti();
  };

  const handleWaitlist = () => {
      handleClose();
      showToast(`Added to Waitlist!`, 'success');
  };

  const handleShareMatch = () => {
      navigator.clipboard.writeText(`https://turfex.app/live/${modalData.id}`);
      showToast("Live Match Link Copied!", "success");
  };

  const handleEndorse = (skills: string[], playerId: string) => {
      handleClose();
      showToast(`Endorsed player for ${skills.join(', ')}!`, 'success');
      triggerConfetti();
  };

  const handleRinger = (role: string, bounty: string) => {
      handleClose();
      showToast(`Broadcast sent: Looking for ${role} (${bounty})`, 'success');
  };

  const handleMatchFinish = (summary: any) => {
      if (modalData?.id) {
          updateMatch(modalData.id, { 
              status: 'COMPLETED',
              summary: summary 
          });
          showToast("Match Completed!", 'success');
          triggerConfetti();
      }
  };

  const handleTournamentRegister = (teamId: string) => {
      if (!user || !modalData) return;
      const tournament = modalData as Tournament;
      const team = teams.find(t => t.id === teamId);
      
      // Simulate Payment
      updateWallet(-tournament.entry_fee);
      
      handleClose();
      showToast(`Registered ${team?.name} for ${tournament.name}!`, 'success');
      triggerConfetti();
      
      addNotification({
          id: `notif-${Date.now()}`,
          user_id: user.id,
          type: 'SYSTEM',
          message: `Registration confirmed for ${tournament.name}. Good luck!`,
          is_read: false,
          created_at: new Date().toISOString()
      });
  };

  const handleCoachBooking = (date: string, time: string) => {
      handleClose();
      showToast(`Session with ${modalData?.name} confirmed for ${date} at ${time}!`, 'success');
      triggerConfetti();
  };

  if (!activeModal || !user) return (
      <>
        {showConfetti && <Confetti />}
      </>
  );

  return (
    <Suspense fallback={<ModalLoader />}>
      {showConfetti && <Confetti />}
      
      {activeModal === 'booking' && modalData?.turf && (
        <BookingModal 
           turf={modalData.turf} 
           existingBookings={bookings} 
           onClose={handleClose} 
           onConfirm={confirmBooking}
           onWaitlist={handleWaitlist}
           initialDate={modalData.initialDate}
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
        <SubscriptionModal onClose={handleClose} onSubscribe={() => { upgradeTier(); handleClose(); showToast("Welcome to Gold!"); triggerConfetti(); }} />
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
        <LiveMatchModal 
            match={modalData} 
            onClose={handleClose} 
            onShare={handleShareMatch} 
            onFinish={handleMatchFinish} 
        />
      )}
      {activeModal === 'endorsement' && (
        <EndorsementModal onClose={handleClose} onSubmit={handleEndorse} />
      )}
      {activeModal === 'ringer' && (
        <RingerModal onClose={handleClose} onSubmit={handleRinger} />
      )}
      {activeModal === 'bracket' && (
        <TournamentBracket bracket={MOCK_BRACKET} onClose={handleClose} />
      )}
      {activeModal === 'product_details' && modalData && (
        <ProductDetailsModal product={modalData} onClose={handleClose} />
      )}
      {activeModal === 'cart' && (
        <CartModal onClose={handleClose} />
      )}
      {activeModal === 'tournament_register' && modalData && (
        <TournamentRegistrationModal 
            tournament={modalData} 
            onClose={handleClose} 
            onConfirm={handleTournamentRegister}
            onCreateTeamRedirect={() => setActiveModal('create_team')}
        />
      )}
      {activeModal === 'coach_booking' && modalData && (
        <CoachBookingModal 
            coach={modalData}
            onClose={handleClose}
            onConfirm={handleCoachBooking}
        />
      )}
    </Suspense>
  );
};

export default ModalManager;
