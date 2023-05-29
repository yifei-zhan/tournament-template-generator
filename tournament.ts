interface Player {
  id: string;
  name: string;
  teamName: string;
  playerNumber: string;
}

interface Team {
  id: string,
  label: string,
  shortLabel: string,
  players: Player[];
}

// base input unit 为一个 match
interface Match {
  matchId: string;
  matchTime?: string;
  fieldLabel?: string;

  team1Id: string;
  team2Id: string;

  team1Scored: number;
  team2Scored: number;

  team1PenaltyScored: number;
  team2PenaltyScored: number;

  team1ScoredPlayerIds: string[];
  team2ScoredPlayerIds: string[];

  team1YellowCardsPlayerIds: string[];
  team2YellowCardsPlayerIds: string[];

  team1RedCardsPlayerIds: string[];
  team2RedCardsPlayerIds: string[];
}

interface Group {
  teamIds: string[];
  matchIds: string[];
}

interface KnockoutBracket {
  teamIds: string[];
}