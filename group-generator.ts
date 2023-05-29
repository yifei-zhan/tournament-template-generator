import { Team, Match } from "./tournament";

interface EnrichedTeam extends Team {
  matchesWonCount: number,
  matchesDrawCount: number,
  matchesLostCount: number,
  goalsScored: number,
  goalsAgainst: number,

  points: number;
  goalsDiff: number;
  matchesCount: number;
}

const getEnrichedTeam = (team: Team, matches: Match[]): EnrichedTeam => {
  const relevantMatches = matches.filter(match => match.team1Id === team.id || match.team2Id === team.id);

  let matchesWonCount = 0;
  let matchesDrawCount = 0;
  let matchesLostCount = 0;
  let goalsScored = 0;
  let goalsAgainst = 0;

  for (const match of matches) {
    const teamPrefix = match.team1Id === team.id ? "team1" : "team2";
  }
};

interface GroupResult {

}

const getGroupResult = (teams: Team[], matches: Match[]) => {

};