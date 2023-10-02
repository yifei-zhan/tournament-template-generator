import { ensureDefined, getStrAsciiSum, sort } from "../utils/utils";
import { Match, TeamInMatch } from "./tournament.type";

interface PlayerRanking {
  playerName: string;
  teamName: string;
  rankingPoints: number;
  shouldBeIgnored: boolean;
}

const shouldIgnorePlayer = (playerName: string) => playerName.endsWith("*");

const sortByRankingPoints = (r1: PlayerRanking, r2: PlayerRanking) =>
  r2.rankingPoints - r1.rankingPoints;
const sortByTeamName = (r1: PlayerRanking, r2: PlayerRanking) =>
  getStrAsciiSum(r2.teamName) - getStrAsciiSum(r1.teamName);
const rankingDataComparers = [sortByRankingPoints, sortByTeamName];

const getRankings = (items: PlayerRanking[]): Array<{ ranking: number; data: PlayerRanking }> => {
  if (items.length === 0) {
    return [];
  }

  const sortedItems = sort(items, rankingDataComparers);
  const grouppedItems: PlayerRanking[][] = [];

  for (const item of sortedItems) {
    if (grouppedItems.length === 0) {
      grouppedItems.push([item]);
      continue;
    }

    const currentWeight = item.rankingPoints;
    // eslint-disable-next-line unicorn/prefer-at
    const lastGroup = ensureDefined(grouppedItems[grouppedItems.length - 1]);
    const weightInLastGroup = ensureDefined(lastGroup[0]).rankingPoints;

    if (currentWeight === weightInLastGroup) {
      lastGroup.push(item);
    } else {
      grouppedItems.push([item]);
    }
  }

  const result: Array<{ ranking: number; data: PlayerRanking }> = [];

  let currentRanking = 1;
  for (const grouppedItem of grouppedItems) {
    for (const item of grouppedItem) {
      result.push({
        data: item,
        ranking: currentRanking,
      });
    }

    currentRanking += grouppedItem.length;
  }

  return result;
};

const getKeyName = (playerName: string, teamName: string) => playerName + "/" + teamName;

const updatePlayersRankingRecord = (
  playerNames: string[],
  teamName: string,
  playersRankingRecord: Record<string, PlayerRanking>
) => {
  playerNames.forEach((playerName) => {
    const key = getKeyName(playerName, teamName);
    if (playersRankingRecord[key]) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      (playersRankingRecord[key] as PlayerRanking).rankingPoints += 1;
    } else {
      playersRankingRecord[key] = {
        playerName,
        teamName,
        rankingPoints: 1,
        shouldBeIgnored: shouldIgnorePlayer(playerName),
      };
    }
  });
};

const getPlayersRankingsRecord = (
  matches: Match[],
  getRankingDataFrom: GetRankingArray
): Record<string, PlayerRanking> => {
  const playersRankingRecord: Record<string, PlayerRanking> = {};

  matches.forEach((match) => {
    const team1 = match.teams[0];
    const team2 = match.teams[1];

    const team1RankingData = getRankingDataFrom(team1);
    if (team1RankingData.length > 0) {
      updatePlayersRankingRecord(team1RankingData, team1.name, playersRankingRecord);
    }

    const team2RankingData = getRankingDataFrom(team2);
    if (team2RankingData.length > 0) {
      updatePlayersRankingRecord(team2RankingData, team2.name, playersRankingRecord);
    }
  });

  return playersRankingRecord;
};

export interface RankingResult {
  ranking: number;
  playerName: string;
  teamName: string;
  rankingPoints: number;
}

type GetRankingArray = (teamInMatch: TeamInMatch) => string[];

interface GetPlayersRankingDataParams {
  matches: Match[];
  getRankingDataFrom: GetRankingArray;
}

export const getPlayersRankingData = ({
  matches,
  getRankingDataFrom,
}: GetPlayersRankingDataParams): RankingResult[] => {
  const playersRankingRecord = getPlayersRankingsRecord(matches, getRankingDataFrom);

  const filteredPlayersRankingRecord = Object.values(playersRankingRecord).filter(
    (v) => !v.shouldBeIgnored
  );

  return getRankings(filteredPlayersRankingRecord).map((item) => ({
    ...item.data,
    ranking: item.ranking,
  }));
};
