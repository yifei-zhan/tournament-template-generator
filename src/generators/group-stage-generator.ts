import { getAllMatches } from "../services/matches-reader";
import { getAllTeams } from "../services/teams-reader";
import { getAllGroupIds, getTableData } from "../services/group-stage-service";
import { readFile } from "fs/promises";
import path from "path";
import { extractStrBetween, insertAfter, replaceBetween, replaceOne } from "../utils/utils";
import { createHtml } from "../services/template-service";
import { Match, Team } from "../services/tournament.type";

const templateFileName = "group-stage-table.html";
const rowsStart = "<!-- %%dynamic-team-rows-start%% -->";

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

interface GenerateGroupStageTableParams {
  groupId: string;
  allMatches: Match[];
  allTeams: Team[];
  template: string;
}

const generateGroupStageTable = async ({
  groupId,
  allMatches,
  allTeams,
  template,
}: GenerateGroupStageTableParams) => {
  const table = getTableData({
    allTeams,
    allMatches,
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

  const outputFileName = `group-stage-table-group-${groupId}.html`;
  const result = insertAfter(template, rowsStart, `\n${rows}\n`);
  await createHtml(result, outputFileName);
};

interface GenerateParams {
  groupId?: string;
}

export async function generateGroupStageTables(params?: GenerateParams) {
  const groupId = params?.groupId;

  const [matches, teams, template] = await Promise.all([
    getAllMatches(),
    getAllTeams(),
    readFile(path.join(__dirname, `../../input/${templateFileName}`), { encoding: "utf8" }),
  ]);

  const groupIds = !!groupId ? [groupId] : getAllGroupIds(teams);

  const templateTasks = groupIds.map((groupId) =>
    generateGroupStageTable({
      groupId,
      allTeams: teams,
      allMatches: matches,
      template,
    })
  );

  await Promise.all(templateTasks);
}
