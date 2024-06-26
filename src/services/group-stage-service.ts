import assert from "assert";
import { Match, Team } from "./tournament.type";
import { CompareFn, getStrAsciiSum, sort } from "../utils/utils";

type TeamCompareFn = CompareFn<TeamData>;
const pointsComparer: TeamCompareFn = (t1, t2) => t2.points - t1.points;
const goalsDiffComparer: TeamCompareFn = (t1, t2) => t2.goalsDiff - t1.goalsDiff;
const goalsScoredComparer: TeamCompareFn = (t1, t2) => t2.goalsScored - t1.goalsScored;
const winLoseRelationComparer: TeamCompareFn = (t1, t2) => {
  const t2WonAgainstT1 = t2.wonAgainstTeamNames.filter((name) => name === t1.teamName).length;
  const t1WonAgainstT2 = t1.wonAgainstTeamNames.filter((name) => name === t2.teamName).length;

  return t2WonAgainstT1 - t1WonAgainstT2;
};

interface TeamData {
  teamName: string;
  teamImageSrc?: string;
  finishedMatchesCount: number;
  winMatchesCount: number;
  loseMatchesCount: number;
  drawMatchesCount: number;
  goalsScored: number;
  goalsAgainst: number;
  goalsDiff: number;
  points: number;
  wonAgainstTeamNames: string[];
}

const getScore = (score: number | undefined): number => score ?? 0;

interface TeamHasScores {
  scored?: number;
  penaltyScored?: number;
}
const getCurrentTeamMatchResult = ({
  currentTeam,
  opponentTeam,
}: {
  currentTeam: TeamHasScores;
  opponentTeam: TeamHasScores;
}): "won" | "lost" | "draw" => {
  const currentTeamScored = getScore(currentTeam.scored) + getScore(currentTeam.penaltyScored);
  const opponentTeamScored = getScore(opponentTeam.scored) + getScore(opponentTeam.penaltyScored);

  if (currentTeamScored === opponentTeamScored) {
    return "draw";
  }

  return currentTeamScored > opponentTeamScored ? "won" : "lost";
};

const getTeamData = (team: Team, matches: Match[]): TeamData => {
  let goalsScored = 0;
  let goalsAgainst = 0;
  let winMatchesCount = 0;
  let loseMatchesCount = 0;
  let drawMatchesCount = 0;
  const wonAgainstTeamNames: string[] = [];

  for (const match of matches) {
    const { teams, groupStage } = match;
    const currentTeamInMatch = teams.find((t) => t.name === team.name);
    const opponentTeamInMatch = teams.find((t) => t.name !== team.name);
    assert(
      currentTeamInMatch && opponentTeamInMatch,
      `teams in matches: ${teams.map((t) => t.name).join(", ")}, does not match current team: ${
        team.name
      }`
    );
    assert(groupStage);

    const currentTeamMatchResult = getCurrentTeamMatchResult({
      currentTeam: currentTeamInMatch,
      opponentTeam: opponentTeamInMatch,
    });
    switch (currentTeamMatchResult) {
      case "won": {
        winMatchesCount++;
        wonAgainstTeamNames.push(opponentTeamInMatch.name);
        break;
      }
      case "lost": {
        loseMatchesCount++;
        break;
      }
      default: {
        drawMatchesCount++;
      }
    }

    goalsScored += getScore(currentTeamInMatch.scored);
    goalsAgainst += getScore(opponentTeamInMatch.scored);
  }

  return {
    teamName: team.name,
    teamImageSrc: team.imageSrc,
    finishedMatchesCount: matches.length,
    winMatchesCount,
    loseMatchesCount,
    drawMatchesCount,
    goalsScored,
    goalsAgainst,
    goalsDiff: goalsScored - goalsAgainst,
    points: winMatchesCount * 3 + drawMatchesCount,
    wonAgainstTeamNames,
  };
};

const comparers: TeamCompareFn[] = [
  pointsComparer,
  winLoseRelationComparer,
  goalsDiffComparer,
  goalsScoredComparer,
];

interface GetTableDataParams {
  allTeams: Team[];
  allMatches: Match[];
  groupId: string;
}

export const getTableData = ({ allTeams, allMatches, groupId }: GetTableDataParams): TeamData[] => {
  const endedMatchesInCurrentGroup = allMatches.filter(
    (match) => match.groupStage?.groupId === groupId && match.isEnded
  );

  const teamsInCurrentGroup = allTeams.filter((team) => team.groupId === groupId);

  const tableTeamsData = teamsInCurrentGroup.map((team) => {
    const currentTeamMatches = endedMatchesInCurrentGroup.filter((match) =>
      match.teams.some((t) => t.name === team.name)
    );

    return getTeamData(team, currentTeamMatches);
  });

  return sort(tableTeamsData, comparers);
};

export const getAllGroupIds = (teams: Team[]) => {
  const groupIds = new Set<string>();

  teams.forEach((team) => {
    groupIds.add(team.groupId);
  });

  const sortedGroupIds = [...groupIds].sort(
    (groupId1, groupId2) => getStrAsciiSum(groupId1) - getStrAsciiSum(groupId2)
  );

  return sortedGroupIds;
};
