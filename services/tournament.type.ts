export interface Player {
  name: string;
  teamName: string;
  playerNumber: string;
}

export interface Team {
  name: string,
  shortLabel?: string,
  imageSrc?: string;
}

export interface TeamInMatch {
  name: string;
  scored: number;

  penaltyScored?: number;
  teamScoredPlayerNames?: string[];
  teamYellowCardsPlayerNames?: string[];
  teamRedCardsPlayerNames?: string[];
}

export interface MatchGroupStage {
  groupId: string;
  roundId: string;
  groupLabel: string;
  roundLabel: string;
}

export interface Match {
  groupStage?: MatchGroupStage;
  isEnded: boolean;

  matchId: string;
  matchTime?: string;
  fieldLabel?: string;

  teams: [TeamInMatch, TeamInMatch];
}