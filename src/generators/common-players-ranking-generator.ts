import { getAllMatches } from "../services/matches-reader";
import { readFile } from "fs/promises";
import path from "path";
import { extractStrBetween, insertAfter, replaceOne } from "../utils/utils";
import { createHtml } from "../services/template-service";
import { Match } from "../services/tournament.type";
import { RankingResult } from "../services/common-players-ranking-service";

const htmlFileName = "players-ranking-table";

const dynamicRowDataBlockStart = "<!-- %%dynamic-team-rows-start%% -->";

const rowDataStart = "%%template-start%%";
const rowDataEnd = "%%template-end%%";

const ranking = "%%ranking%%";
const playerName = "%%player-name%%";
const teamName = "%%team-name%%";
const rankingPointsCount = "%%ranking-points-count%%";

const rankingPointsHeaderPlaceholder = "%%ranking-points-header%%";

interface GeneratePlayersRankingTableParams {
  getRankingResult: (matches: Match[]) => RankingResult[];
  rankingPointsHeader: string;
  outputTemplateSuffix: string;
}

export async function generatePlayersRankingTable({
  getRankingResult,
  rankingPointsHeader,
  outputTemplateSuffix,
}: GeneratePlayersRankingTableParams) {
  const [matches, originalTemplate] = await Promise.all([
    getAllMatches(),
    readFile(path.join(__dirname, `../../templates/${htmlFileName}.html`), { encoding: "utf8" }),
  ]);

  const template = replaceOne(
    originalTemplate,
    rankingPointsHeaderPlaceholder,
    rankingPointsHeader
  );

  const rankings = getRankingResult(matches);
  const rows = rankings
    .map((rankingData) => {
      let row = extractStrBetween(template, rowDataStart, rowDataEnd);

      row = replaceOne(row, ranking, String(rankingData.ranking));
      row = replaceOne(row, playerName, String(rankingData.playerName));
      row = replaceOne(row, teamName, String(rankingData.teamName));
      row = replaceOne(row, rankingPointsCount, String(rankingData.rankingPoints));

      return row;
    })
    .join("\n");

  const result = insertAfter(template, dynamicRowDataBlockStart, `\n${rows}\n`);
  await createHtml(result, `${htmlFileName}-${outputTemplateSuffix}.html`);
}
