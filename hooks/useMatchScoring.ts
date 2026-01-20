
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

  return {
    scoreboard,
    updateCricketScore,
    updateFootballScore
  };
};
