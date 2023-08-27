import { getAllMatches } from "../services/matches-reader";
import { readFile } from "fs/promises";
import path from "path";
import { extractStrBetween, insertAfter, replaceOne } from "../utils/utils";
import { createHtml } from "../services/template-service";
import { getSortedScoresRankingData } from "../services/scores-ranking-service";

const htmlFileName = "scores-ranking-table.html";
const rowsStart = "<!-- %%dynamic-team-rows-start%% -->";

const blockStart = "%%template-start%%";
const blockEnd = "%%template-end%%";

const ranking = "%%ranking%%";
const playerName = "%%player-name%%";
const teamName = "%%team-name%%";
const scoresCount = "%%scores-count%%";

export async function generateScoresRankingTable() {
  const [matches, template] = await Promise.all([
    getAllMatches(),
    readFile(path.join(__dirname, `../../input/${htmlFileName}`), { encoding: "utf8" }),
  ]);

  const rankings = getSortedScoresRankingData(matches);

  const rows = rankings
    .map((rankingData) => {
      let row = extractStrBetween(template, blockStart, blockEnd);

      row = replaceOne(row, ranking, String(rankingData.ranking));
      row = replaceOne(row, playerName, String(rankingData.playerName));
      row = replaceOne(row, teamName, String(rankingData.teamName));
      row = replaceOne(row, scoresCount, String(rankingData.scores));

      return row;
    })
    .join("\n");

  const result = insertAfter(template, rowsStart, `\n${rows}\n`);
  await createHtml(result, htmlFileName);
}
