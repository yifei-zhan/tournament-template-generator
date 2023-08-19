import { Match } from "./tournament.type";
import { getRankings, getStrAsciiSum } from "../utils/utils";

const getKeyName = (playerName: string, teamName: string) => playerName + "/" + teamName;

const updatePlayersScoresRecordWithPlayers = (
  playerNames: string[],
  teamName: string,
  playersScoresRecord: Record<string, PlayerScore>
) => {
  playerNames.forEach((playerName) => {
    const key = getKeyName(playerName, teamName);
    if (playersScoresRecord[key]) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      (playersScoresRecord[key] as PlayerScore).scores += 1;
    } else {
      playersScoresRecord[key] = {
        playerName,
        teamName,
        scores: 1,
      };
    }
  });
};

interface PlayerScore {
  playerName: string;
  teamName: string;
  scores: number;
}

const getPlayersScoresRecord = (matches: Match[]): Record<string, PlayerScore> => {
  const playersScoresRecord: Record<string, PlayerScore> = {};

  matches.forEach((match) => {
    const team1 = match.teams[0];
    const team2 = match.teams[1];

    if (team1.scored > 0) {
      updatePlayersScoresRecordWithPlayers(
        team1.teamScoredPlayerNames,
        team1.name,
        playersScoresRecord
      );
    }

    if (team2.scored > 0) {
      updatePlayersScoresRecordWithPlayers(
        team2.teamScoredPlayerNames,
        team2.name,
        playersScoresRecord
      );
    }
  });

  return playersScoresRecord;
};

const sortByScore = (r1: PlayerScore, r2: PlayerScore) => r2.scores - r1.scores;
const sortByTeamName = (r1: PlayerScore, r2: PlayerScore) =>
  getStrAsciiSum(r2.teamName) - getStrAsciiSum(r1.teamName);
const scoresRankingDataComparers = [sortByScore, sortByTeamName];

interface ScoresRanking {
  ranking: number;
  playerName: string;
  teamName: string;
  scores: number;
}

export const getSortedScoresRankingData = (matches: Match[]): ScoresRanking[] => {
  const filteredMatches = matches.filter((match) => match.isEnded);

  const playersScoresRecord = getPlayersScoresRecord(filteredMatches);

  return getRankings({
    items: Object.values(playersScoresRecord),
    getWeight: (item) => item.scores,
    comparers: scoresRankingDataComparers,
  }).map((item) => ({
    ...item.data,
    ranking: item.ranking,
  }));
};
