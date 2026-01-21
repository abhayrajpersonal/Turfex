
import { useState, useEffect } from 'react';
import { OpenMatch, Sport } from '../lib/types';

export const useMatchScoring = (match: OpenMatch, updateMatchContext: (id: string, data: Partial<OpenMatch>) => void) => {
  // Initialize state from the match prop to ensure we pick up persisted data
  const [scoreboard, setScoreboard] = useState(match.scoreboard);

  // Sync local state if match prop updates externally (e.g. from context)
  useEffect(() => {
    setScoreboard(match.scoreboard);
  }, [match.scoreboard]);

  const persist = (newScoreboard: any) => {
      setScoreboard(newScoreboard);
      updateMatchContext(match.id, { scoreboard: newScoreboard });
  };

  const updateCricketScore = (runs: number, isWicket: boolean, isExtra: boolean) => {
    if (!scoreboard?.cricket) return;
    
    // Determine batting team based on is_batting_first flag
    // In a real app, this would be more complex state machine
    const battingTeamKey = scoreboard.cricket.team_a.is_batting_first ? 'team_a' : 'team_b';
    const bowlingTeamKey = battingTeamKey === 'team_a' ? 'team_b' : 'team_a';

    const battingTeamScore = { ...scoreboard.cricket[battingTeamKey] };
    const bowlingTeamScore = { ...scoreboard.cricket[bowlingTeamKey] };

    // Update Runs/Wickets
    if (isWicket) {
        battingTeamScore.wickets += 1;
        battingTeamScore.balls += 1; // Wicket counts as a ball
    } else if (isExtra) {
        battingTeamScore.runs += 1; // Wide/NoBall doesn't count as legal ball usually, simplified here
        // Note: For simplicity in this demo, we aren't adding extra balls for wides
    } else {
        battingTeamScore.runs += runs;
        battingTeamScore.balls += 1;
    }

    // Over Logic
    if (battingTeamScore.balls === 6) {
        battingTeamScore.overs += 1;
        battingTeamScore.balls = 0;
    }

    // Auto-Switch Innings Logic (Simplified: Switch if 10 wickets or 20 overs)
    // Note: This logic could be expanded
    
    const newScoreboard = {
        ...scoreboard,
        cricket: { 
            ...scoreboard.cricket, 
            [battingTeamKey]: battingTeamScore,
            [bowlingTeamKey]: bowlingTeamScore 
        },
        last_update: isWicket ? 'WICKET!' : `${runs} Runs`
    };

    persist(newScoreboard);
  };

  const switchInnings = () => {
      if (!scoreboard?.cricket) return;
      const newScoreboard = {
          ...scoreboard,
          cricket: {
              team_a: { ...scoreboard.cricket.team_a, is_batting_first: !scoreboard.cricket.team_a.is_batting_first },
              team_b: { ...scoreboard.cricket.team_b, is_batting_first: !scoreboard.cricket.team_b.is_batting_first }
          },
          last_update: 'Innings Switched'
      };
      persist(newScoreboard);
  };

  const updateFootballScore = (team: 'A' | 'B') => {
      if (!scoreboard?.football) return;
      const newScore = { ...scoreboard.football };
      if (team === 'A') newScore.team_a += 1;
      else newScore.team_b += 1;
      
      const newScoreboard = {
          ...scoreboard,
          football: newScore,
          last_update: `GOAL for Team ${team}!`
      };

      persist(newScoreboard);
  };

  const updateRacquetScore = (team: 'A' | 'B') => {
      if (!scoreboard?.racquet) return;
      
      const currentSetIdx = scoreboard.racquet.current_set;
      const currentSets = [...scoreboard.racquet.sets];
      
      if (!currentSets[currentSetIdx]) {
          currentSets[currentSetIdx] = { a: 0, b: 0 };
      }

      const currentSetScore = { ...currentSets[currentSetIdx] };
      
      if (team === 'A') currentSetScore.a += 1;
      else currentSetScore.b += 1;
      
      currentSets[currentSetIdx] = currentSetScore;

      // Win Logic (21 pts, win by 2)
      const WIN_POINT = match.sport === Sport.PICKLEBALL ? 11 : 21;
      const isSetComplete = (currentSetScore.a >= WIN_POINT || currentSetScore.b >= WIN_POINT) && Math.abs(currentSetScore.a - currentSetScore.b) >= 2;

      let nextSetIdx = currentSetIdx;
      if (isSetComplete) {
          nextSetIdx += 1;
          currentSets.push({ a: 0, b: 0 }); 
      }

      const newScoreboard = {
          ...scoreboard,
          racquet: {
              ...scoreboard.racquet,
              sets: currentSets,
              current_set: nextSetIdx,
              server: team 
          },
          last_update: isSetComplete ? `Set ${currentSetIdx + 1} Finished!` : 'Point'
      };

      persist(newScoreboard);
  };

  const toggleServer = () => {
      if (!scoreboard?.racquet) return;
      const newServer: 'A' | 'B' = scoreboard.racquet.server === 'A' ? 'B' : 'A';
      const newScoreboard = {
          ...scoreboard,
          racquet: { ...scoreboard.racquet, server: newServer }
      };
      persist(newScoreboard);
  };

  return {
    scoreboard,
    updateCricketScore,
    switchInnings,
    updateFootballScore,
    updateRacquetScore,
    toggleServer
  };
};
