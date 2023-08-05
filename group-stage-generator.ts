import { getAllMatches } from "./services/matches-reader";
import { getAllTeams } from "./services/teams-reader";
import { getTableData } from "./services/group-stage-service";
import { readFile } from "fs/promises";
import path from "path";
import { extractStrBetween, insertAfter, replaceBetween, replaceOne } from "./utils/utils";
import { createHtml } from "./template/template-service";

interface GenerateParams {
  groupId: string;
}

const teamBlockStart = "%%template-start%%";
const teamBlockEnd = "%%template-end%%";

const teamName = "%%team-name%%";

const teamImageStart = "%%image-start%%";
const teamImageSrc = "%%image-src%%";
const teamImageEnd = "%%image-end%%";

const matchesTotalCount = "%%matches-total-count%%";
const winMatchesCount = "%%win-matches-count%%";
const drawMatchesCount = "%%draw-matches-count%%";
const loseMatchesCount = "%%lose-matches-count%%";
const goalsScored = "%%goals-scored%%";
const goalsAgainst = "%%goals-against%%";
const goalsDiff = "%%goals-diff%%";
const points = "%%points%%";

const rowsStart = "<!-- %%dynamic-team-rows-start%% -->";

const htmlFileName = "group-stage-table.html";

export async function generate({ groupId }: GenerateParams) {
  const [matches, teams, template] = await Promise.all([
    getAllMatches(),
    getAllTeams(),
    readFile(path.join(__dirname, "./template/group-stage-table.html"), { encoding: "utf8" }),
  ]);

  const table = getTableData({
    teams,
    matches,
    groupId,
  });

  const rows = table
    .map((team) => {
      let teamRow = extractStrBetween(template, teamBlockStart, teamBlockEnd);

      if (team.teamImageSrc) {
        teamRow = replaceOne(teamRow, teamImageStart, "");
        teamRow = replaceOne(teamRow, teamImageEnd, "");
        teamRow = replaceOne(teamRow, teamImageSrc, team.teamImageSrc);
      } else {
        teamRow = replaceBetween({
          str: teamRow,
          start: teamImageStart,
          end: teamImageEnd,
          replaceTo: "",
          replaceSearchingTerm: true,
        });
      }

      teamRow = replaceOne(teamRow, teamName, team.teamName);
      teamRow = replaceOne(teamRow, matchesTotalCount, String(team.finishedMatchesCount));
      teamRow = replaceOne(teamRow, winMatchesCount, String(team.winMatchesCount));
      teamRow = replaceOne(teamRow, loseMatchesCount, String(team.loseMatchesCount));
      teamRow = replaceOne(teamRow, drawMatchesCount, String(team.drawMatchesCount));
      teamRow = replaceOne(teamRow, goalsScored, String(team.goalsScored));
      teamRow = replaceOne(teamRow, goalsAgainst, String(team.goalsAgainst));
      teamRow = replaceOne(teamRow, goalsDiff, String(team.goalsDiff));
      teamRow = replaceOne(teamRow, points, String(team.points));

      return teamRow;
    })
    .join("\n");

  const result = insertAfter(template, rowsStart, `\n${rows}\n`);
  await createHtml(result, htmlFileName);
}
