export interface Player {
  name: string;
  teamName: string;
  playerNumber: string;
}

export interface Team {
  name: string;
  groupId: string;
  shortLabel?: string;
  imageSrc?: string;
}

export interface TeamInMatch {
  name: string;
  scored: number;

  penaltyScored?: number;
  teamScoredPlayerNames: string[];
  teamAssistancePlayerNames: string[];
  teamYellowCardsPlayerNames: string[];
  teamRedCardsPlayerNames: string[];
}

export interface MatchGroupStage {
  groupId: string;
  groupLabel: string;
}

export interface Match {
  groupStage?: MatchGroupStage;
  isEnded: boolean;

  matchId: string;
  matchTime?: string;
  fieldLabel?: string;

  teams: [TeamInMatch, TeamInMatch];
}
