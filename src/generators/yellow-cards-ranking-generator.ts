import { getPlayersRankingData } from "../services/common-players-ranking-service";
import { Match, Player } from "../services/tournament.type";
import { generatePlayersRankingTable } from "./common-players-ranking-generator";

const getSortedRankingData = (matches: Match[], players: Player[] | undefined) =>
  getPlayersRankingData({
    matches,
    players,
    getRankingDataFrom: (teamInMatch) => teamInMatch.teamYellowCardsPlayerNames,
  });

export const generatePlayersYellowCardsRankingTable = async () =>
  await generatePlayersRankingTable({
    getRankingResult: getSortedRankingData,
    rankingPointsHeader: "黄牌",
    outputTemplateSuffix: "yelow-cards",
  });
