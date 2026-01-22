
import React, { useMemo } from 'react';
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
  const { teams, bookings, openMatches } = useData(); // Get historical data
  const { setActiveModal } = useUI();

  // Dynamic Stats Calculation
  const stats = useMemo(() => {
      if (!user) return user?.stats;

      // 1. Calculate confirmed matches from bookings
      const bookingMatches = bookings.filter(b => b.user_id === user.id && b.status === 'COMPLETED').length;
      
      // 2. Calculate joined open matches
      const joinedMatchesCount = openMatches.filter(m => m.joined_players.includes(user.id) && m.status === 'COMPLETED').length;
      
      const totalMatches = bookingMatches + joinedMatchesCount + (user.stats?.matches_played || 0); // Add base mock stats for demo feel
      
      // 3. Mock logic for wins (In real app, this comes from match results)
      // Assuming 60% win rate for demo purposes on new matches
      const estimatedWins = Math.floor((bookingMatches + joinedMatchesCount) * 0.6) + (user.stats?.matches_won || 0);

      return {
          ...user.stats,
          matches_played: totalMatches,
          matches_won: estimatedWins,
          // Calculate total score based on activity
          total_score: (user.stats?.total_score || 0) + (bookingMatches * 10) + (joinedMatchesCount * 15)
      };
  }, [user, bookings, openMatches]);

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
      
      <CareerStats stats={stats} />

      <MyTeamsList 
        teams={myTeams} 
        onCreateTeam={() => setActiveModal('create_team')}
        onTeamClick={(team) => setActiveModal('team_details', team)}
      />
    </div>
  );
};

export default SocialScreen;
