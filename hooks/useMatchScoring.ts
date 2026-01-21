import { useState } from 'react';
import { OpenMatch, Sport } from '../lib/types';

export const useMatchScoring = (match: OpenMatch, onUpdate?: (newScoreboard: any) => void) => {
  const [scoreboard, setScoreboard] = useState(match.scoreboard);

  const updateCricketScore = (runs: number, isWicket: boolean, isExtra: boolean) => {
    if (!scoreboard?.cricket) return;
    const currentTeamKey = 'team_a'; // Simplified: Assume Team A batting for demo
    const teamScore = { ...scoreboard.cricket[currentTeamKey] };

    if (isWicket) {
        teamScore.wickets += 1;
        teamScore.balls += 1;
    } else if (isExtra) {
        teamScore.runs += 1; // Wide/NoBall
    } else {
        teamScore.runs += runs;
        teamScore.balls += 1;
    }

    if (teamScore.balls === 6) {
        teamScore.overs += 1;
        teamScore.balls = 0;
    }

    const newScoreboard = {
        ...scoreboard,
        cricket: { ...scoreboard.cricket, [currentTeamKey]: teamScore },
        last_update: 'Just now'
    };

    setScoreboard(newScoreboard);
    if(onUpdate) onUpdate(newScoreboard);
  };

  const updateFootballScore = (team: 'A' | 'B') => {
      if (!scoreboard?.football) return;
      const newScore = { ...scoreboard.football };
      if (team === 'A') newScore.team_a += 1;
      else newScore.team_b += 1;
      
      const newScoreboard = {
          ...scoreboard,
          football: newScore,
          last_update: 'Goal scored!'
      };

      setScoreboard(newScoreboard);
      if(onUpdate) onUpdate(newScoreboard);
  };

  const updateRacquetScore = (team: 'A' | 'B') => {
      if (!scoreboard?.racquet) return;
      
      const currentSetIdx = scoreboard.racquet.current_set;
      const currentSets = [...scoreboard.racquet.sets];
      
      // Initialize set if needed
      if (!currentSets[currentSetIdx]) {
          currentSets[currentSetIdx] = { a: 0, b: 0 };
      }

      const currentSetScore = { ...currentSets[currentSetIdx] };
      
      if (team === 'A') {
          currentSetScore.a += 1;
      } else {
          currentSetScore.b += 1;
      }
      
      currentSets[currentSetIdx] = currentSetScore;

      // Check for set completion (Simple rule: 21 points, win by 2)
      // For demo we use 21 for all, ideally this would be configurable based on Sport
      const WIN_POINT = match.sport === Sport.PICKLEBALL ? 11 : 21;
      const isSetComplete = (currentSetScore.a >= WIN_POINT || currentSetScore.b >= WIN_POINT) && Math.abs(currentSetScore.a - currentSetScore.b) >= 2;

      let nextSetIdx = currentSetIdx;
      if (isSetComplete) {
          nextSetIdx += 1;
          currentSets.push({ a: 0, b: 0 }); // Prep next set
      }

      const newScoreboard = {
          ...scoreboard,
          racquet: {
              ...scoreboard.racquet,
              sets: currentSets,
              current_set: nextSetIdx,
              server: team // Winner serves usually
          },
          last_update: isSetComplete ? `Set ${currentSetIdx + 1} Finished!` : 'Point Scored'
      };

      setScoreboard(newScoreboard);
      if (onUpdate) onUpdate(newScoreboard);
  };

  const toggleServer = () => {
      if (!scoreboard?.racquet) return;
      const newServer: 'A' | 'B' = scoreboard.racquet.server === 'A' ? 'B' : 'A';
      const newScoreboard = {
          ...scoreboard,
          racquet: {
              ...scoreboard.racquet,
              server: newServer
          }
      };
      setScoreboard(newScoreboard);
      if (onUpdate) onUpdate(newScoreboard);
  };

  return {
    scoreboard,
    updateCricketScore,
    updateFootballScore,
    updateRacquetScore,
    toggleServer
  };
};
