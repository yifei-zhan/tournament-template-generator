import { getPlayersRankingData } from "../services/common-players-ranking-service";
import { Match } from "../services/tournament.type";
import { generatePlayersRankingTable } from "./common-players-ranking-generator";

const getSortedScoresRankingData = (matches: Match[]) =>
  getPlayersRankingData({
    matches,
    getRankingDataFrom: (teamInMatch) => teamInMatch.teamScoredPlayerNames,
  });

export const generatePlayersScoresRankingTable = async () =>
  await generatePlayersRankingTable({
    getRankingResult: getSortedScoresRankingData,
    rankingPointsHeader: "进球数",
    outputTemplateSuffix: "scores",
  });
