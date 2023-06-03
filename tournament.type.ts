export interface Player {
  name: string;
  teamName: string;
  playerNumber: string;
}

export interface Team {
  name: string,
  shortLabel?: string,
  imageSrc?: string;
  players: Player[];
}

export interface TeamInMatch {
  name: string;
  scored: number;

  penaltyScored?: number;
  teamScoredPlayerIds?: string[];
  teamYellowCardsPlayerIds?: string[];
  teamRedCardsPlayerIds?: string[];
}

interface MatchGroupStage {
  groupId: string;
  roundId: string;
  groupLabel: string;
  roundLabel: string;
}

export interface Match {
  groupStage?: MatchGroupStage;

  matchId: string;
  matchTime?: string;
  fieldLabel?: string;

  teams: [TeamInMatch, TeamInMatch];
}