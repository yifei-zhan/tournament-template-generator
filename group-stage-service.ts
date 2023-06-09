import assert from "assert";
import { Match, Team } from "./tournament.type";
import { CompareFn, sort } from "./utils";

type TeamCompareFn = CompareFn<TeamData>;
const pointsComparer: TeamCompareFn = (t1, t2) => t2.points - t1.points;
const goalsDiffComparer: TeamCompareFn = (t1, t2) => t2.goalsDiff - t1.goalsDiff;
const goalsScoredComparer: TeamCompareFn = (t1, t2) => t2.goalsScored - t1.goalsScored;
const winLoseRelationComparer: TeamCompareFn = (t1, t2) => {
  const t2WonAgainstT1 = t2.wonAgainstTeamIds.filter(id => id === t1.teamId).length;
  const t1WonAgainstT2 = t1.wonAgainstTeamIds.filter(id => id === t2.teamId).length;

  return t2WonAgainstT1 - t1WonAgainstT2;
}

interface TeamData {
  teamId: string;
  teamImageSrc?: string;
  finishedMatchesCount: number;
  winMatchesCount: number;
  loseMatchesCount: number;
  drawMatchesCount: number;
  goalsScored: number;
  goalsAgainst: number;
  goalsDiff: number;
  points: number;
  wonAgainstTeamIds: string[];
}

interface TeamHasScores {
  scored: number;
  penaltyScored?: number;
}
const getCurrentTeamMatchResult = ({
  currentTeam,
  opponentTeam
}: {
  currentTeam: TeamHasScores;
  opponentTeam: TeamHasScores;
}): "won" | "lost" | "draw" => {
  const currentTeamScored = currentTeam.scored + (currentTeam.penaltyScored || 0);
  const opponentTeamScored = opponentTeam.scored + (opponentTeam.penaltyScored || 0);

  if (currentTeamScored === opponentTeamScored) {
    return "draw"
  }

  return currentTeamScored > opponentTeamScored ? "won" : "lost";
}

const getTeamData = (team: Team, matches: Match[]): TeamData => {
  let goalsScored = 0;
  let goalsAgainst = 0;
  let winMatchesCount = 0;
  let loseMatchesCount = 0;
  let drawMatchesCount = 0;
  const wonAgainstTeamIds: string[] = [];

  for (const match of matches) {
    const { teams, groupStage } = match;
    const currentTeamInMatch = teams.find(t => t.name === team.name);
    const opponentTeamInMatch = teams.find(t => t.name !== team.name);
    assert(currentTeamInMatch && opponentTeamInMatch, `teams in matches: ${teams.map(t => t.name).join(', ')}, does not match current team: ${team.name}`);
    assert(groupStage);

    const currentTeamMatchResult = getCurrentTeamMatchResult({
      currentTeam: currentTeamInMatch,
      opponentTeam: opponentTeamInMatch
    });
    switch (currentTeamMatchResult) {
      case "won":
        winMatchesCount++;
        wonAgainstTeamIds.push(opponentTeamInMatch.name);
        break;
      case "lost":
        loseMatchesCount++;
        break;
      default:
        drawMatchesCount++
    }

    goalsScored += currentTeamInMatch.scored;
    goalsAgainst += opponentTeamInMatch.scored;
  }

  return {
    teamId: team.name,
    teamImageSrc: team.imageSrc,
    finishedMatchesCount: matches.length,
    winMatchesCount,
    loseMatchesCount,
    drawMatchesCount,
    goalsScored,
    goalsAgainst,
    goalsDiff: goalsScored - goalsAgainst,
    points: winMatchesCount * 3 + drawMatchesCount,
    wonAgainstTeamIds
  }
};

const comparers: TeamCompareFn[] = [
  pointsComparer,
  winLoseRelationComparer,
  goalsDiffComparer,
  goalsScoredComparer
]

export const getTableData = ({
  teams,
  matches,
  groupId
}: {
  teams: Team[];
  matches: Match[];
  groupId: string;
}): TeamData[] => {
  const matchesInCurrentGroup = matches.filter(match => match.groupStage?.groupId === groupId);

  const tableTeamsData = teams.map((team) => {
    const currentTeamMatches = matchesInCurrentGroup.filter(match => match.teams.find(t => t.name === team.name) !== undefined);
    return getTeamData(team, currentTeamMatches);
  });

  return sort(tableTeamsData, comparers);
}