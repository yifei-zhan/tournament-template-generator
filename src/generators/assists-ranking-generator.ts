import { getPlayersRankingData } from "../services/common-players-ranking-service";
import { Match, Player } from "../services/tournament.type";
import { generatePlayersRankingTable } from "./common-players-ranking-generator";

const getSortedRankingData = (matches: Match[], players: Player[] | undefined) =>
  getPlayersRankingData({
    matches,
    players,
    getRankingDataFrom: (teamInMatch) => teamInMatch.teamAssistancePlayerNames,
  });

export const generatePlayersAssistsRankingTable = async () =>
  await generatePlayersRankingTable({
    getRankingResult: getSortedRankingData,
    rankingPointsHeader: "助攻数",
    outputTemplateSuffix: "assists",
  });
