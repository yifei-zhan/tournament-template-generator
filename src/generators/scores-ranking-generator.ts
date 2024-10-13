import { getPlayersRankingData } from "../services/common-players-ranking-service";
import { Match, Player } from "../services/tournament.type";
import { generatePlayersRankingTable } from "./common-players-ranking-generator";

const getSortedRankingData = (matches: Match[], players: Player[] | undefined) =>
  getPlayersRankingData({
    matches,
    players,
    getRankingDataFrom: (teamInMatch) => teamInMatch.teamScoredPlayerNames,
  });

export const generatePlayersScoresRankingTable = async () =>
  await generatePlayersRankingTable({
    getRankingResult: getSortedRankingData,
    rankingPointsHeader: "进球数",
    outputTemplateSuffix: "scores",
  });
