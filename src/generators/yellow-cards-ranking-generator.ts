import { getPlayersRankingData } from "../services/common-players-ranking-service";
import { Match } from "../services/tournament.type";
import { generatePlayersRankingTable } from "./common-players-ranking-generator";

const getSortedRankingData = (matches: Match[]) =>
  getPlayersRankingData({
    matches,
    getRankingDataFrom: (teamInMatch) => teamInMatch.teamYellowCardsPlayerNames,
  });

export const generatePlayersYellowCardsRankingTable = async () =>
  await generatePlayersRankingTable({
    getRankingResult: getSortedRankingData,
    rankingPointsHeader: "黄牌",
    outputTemplateSuffix: "yelow-cards",
  });
