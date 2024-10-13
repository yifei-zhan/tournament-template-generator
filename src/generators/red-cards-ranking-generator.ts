import { getPlayersRankingData } from "../services/common-players-ranking-service";
import { Match, Player } from "../services/tournament.type";
import { generatePlayersRankingTable } from "./common-players-ranking-generator";

const getSortedRankingData = (matches: Match[], players: Player[] | undefined) =>
  getPlayersRankingData({
    matches,
    players,
    getRankingDataFrom: (teamInMatch) => teamInMatch.teamRedCardsPlayerNames,
  });

export const generatePlayersRedCardsRankingTable = async () =>
  await generatePlayersRankingTable({
    getRankingResult: getSortedRankingData,
    rankingPointsHeader: "红牌",
    outputTemplateSuffix: "red-cards",
  });
