import { ensureDefined, getStrAsciiSum, sort } from "../utils/utils";
import { Match, Player, TeamInMatch } from "./tournament.type";

interface PlayerRanking {
  playerName: string;
  teamName: string;
  rankingPoints: number;
}

const shouldIgnorePlayer = (playerName: string) => playerName.endsWith("*");

const sortByRankingPoints = (r1: PlayerRanking, r2: PlayerRanking) =>
  r2.rankingPoints - r1.rankingPoints;
const sortByTeamName = (r1: PlayerRanking, r2: PlayerRanking) =>
  getStrAsciiSum(r2.teamName) - getStrAsciiSum(r1.teamName);
const rankingDataComparers = [sortByRankingPoints, sortByTeamName];

const getRankings = (
  rankings: Record<string, PlayerRanking>
): Array<{ ranking: number; data: PlayerRanking }> => {
  const items = Object.values(rankings);

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

interface GetKeyNameAndLogIfBadDataQualityParams {
  matchId: string;
  playerNameInMatch: string;
  teamNameInMatch: string;
  playersData: Player[] | undefined;
}

const getRankingKeyAndTeamNameAndLogIfBadQuality = ({
  matchId,
  playerNameInMatch,
  teamNameInMatch,
  playersData,
}: GetKeyNameAndLogIfBadDataQualityParams): {
  key: string;
  resolvedTeamName: string;
} => {
  if (playersData === undefined) {
    return {
      key: playerNameInMatch + "/" + teamNameInMatch,
      resolvedTeamName: teamNameInMatch,
    };
  }

  const playerDataFromCatalog = playersData.filter((player) => player.name === playerNameInMatch);
  if (playerDataFromCatalog.length !== 1) {
    // eslint-disable-next-line no-console
    console.log(
      `Player-${playerNameInMatch} from team-${teamNameInMatch} in match-${matchId}: not found in players data catalog or multiple players found (bad data quality)`
    );
    return {
      key: playerNameInMatch + "/" + teamNameInMatch,
      resolvedTeamName: teamNameInMatch,
    };
  }

  const player = ensureDefined(playerDataFromCatalog[0]);
  return {
    key: player.name + "/" + player.teamName,
    resolvedTeamName: player.teamName,
  };
};

interface UpdatePlayersRankingRecordParams {
  matchId: string;
  playerNames: string[];
  teamName: string;
  playersData: Player[] | undefined;
  playersRankingRecord: Record<string, PlayerRanking>;
}

const updatePlayersRankingRecord = ({
  matchId,
  playerNames,
  teamName,
  playersData,
  playersRankingRecord,
}: UpdatePlayersRankingRecordParams) => {
  playerNames.forEach((playerName) => {
    const shouldIgnore = shouldIgnorePlayer(playerName);
    if (shouldIgnore) {
      return;
    }

    const { key, resolvedTeamName } = getRankingKeyAndTeamNameAndLogIfBadQuality({
      matchId,
      playerNameInMatch: playerName,
      teamNameInMatch: teamName,
      playersData,
    });

    if (playersRankingRecord[key]) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      (playersRankingRecord[key] as PlayerRanking).rankingPoints += 1;
    } else {
      playersRankingRecord[key] = {
        playerName,
        teamName: resolvedTeamName,
        rankingPoints: 1,
      };
    }
  });
};

const getPlayersRankingsRecord = (
  matches: Match[],
  players: Player[] | undefined,
  getRankingDataFrom: GetRankingArray
): Record<string, PlayerRanking> => {
  const playersRankingRecord: Record<string, PlayerRanking> = {};

  matches.forEach((match) => {
    const team1 = match.teams[0];
    const team2 = match.teams[1];

    const team1PlayersForRanking = getRankingDataFrom(team1);
    if (team1PlayersForRanking.length > 0) {
      updatePlayersRankingRecord({
        matchId: match.matchId,
        playerNames: team1PlayersForRanking,
        teamName: team1.name,
        playersData: players,
        playersRankingRecord,
      });
    }

    const team2PlayersForRanking = getRankingDataFrom(team2);
    if (team2PlayersForRanking.length > 0) {
      updatePlayersRankingRecord({
        matchId: match.matchId,
        playerNames: team2PlayersForRanking,
        teamName: team2.name,
        playersData: players,
        playersRankingRecord,
      });
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
  players: Player[] | undefined;
  getRankingDataFrom: GetRankingArray;
}

export const getPlayersRankingData = ({
  matches,
  players,
  getRankingDataFrom,
}: GetPlayersRankingDataParams): RankingResult[] => {
  const playersRankingRecord = getPlayersRankingsRecord(matches, players, getRankingDataFrom);

  return getRankings(playersRankingRecord).map((item) => ({
    ...item.data,
    ranking: item.ranking,
  }));
};
