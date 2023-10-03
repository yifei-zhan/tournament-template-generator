import { getPlayersRankingData } from "../services/common-players-ranking-service";
import { Match } from "../services/tournament.type";
import { generatePlayersRankingTable } from "./common-players-ranking-generator";

const getSortedRankingData = (matches: Match[]) =>
  getPlayersRankingData({
    matches,
    getRankingDataFrom: (teamInMatch) => teamInMatch.teamRedCardsPlayerNames,
  });

export const generatePlayersRedCardsRankingTable = async () =>
  await generatePlayersRankingTable({
    getRankingResult: getSortedRankingData,
    rankingPointsHeader: "红牌",
    outputTemplateSuffix: "red-cards",
  });
