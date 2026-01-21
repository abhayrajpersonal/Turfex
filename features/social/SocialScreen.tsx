
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { UserTier } from '../../lib/types';
import ProfileHeader from './components/ProfileHeader';
import CredibilityCard from './components/CredibilityCard';
import CareerStats from './components/CareerStats';
import MyTeamsList from './components/MyTeamsList';

const SocialScreen: React.FC = () => {
  const { user } = useAuth();
  const { teams } = useData();
  const { setActiveModal } = useUI();

  if (!user) return null;

  // Mock Tier Logic
  const nextTier = user.tier === UserTier.FREE ? 'GOLD' : user.tier === UserTier.GOLD ? 'PLATINUM' : 'MAX';
  const pointsRequired = user.tier === UserTier.FREE ? 2000 : user.tier === UserTier.GOLD ? 5000 : user.turfex_points;
  const progressPercent = Math.min(100, (user.turfex_points || 0) / (pointsRequired || 1) * 100);

  // Filter teams where user is a member
  const myTeams = teams.filter(t => t.members.includes(user.id || ''));

  return (
    <div className="space-y-6 animate-fade-in-up pb-24">
      <ProfileHeader 
        user={user}
        onOpenWallet={() => setActiveModal('wallet')}
        onEditProfile={() => setActiveModal('profile')}
        nextTier={nextTier}
        pointsRequired={pointsRequired || 0}
        progressPercent={progressPercent}
      />

      <CredibilityCard credibility={user.credibility} />
      
      <CareerStats stats={user.stats} />

      <MyTeamsList 
        teams={myTeams} 
        onCreateTeam={() => setActiveModal('create_team')}
      />
    </div>
  );
};

export default SocialScreen;
