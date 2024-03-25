import { getAllMatches } from "../services/matches-reader";
import { getAllTeams } from "../services/teams-reader";
import { readFile } from "fs/promises";
import path from "path";
import { extractStrBetween, insertAfter, replaceBetween, replaceOne } from "../utils/utils";
import { createHtml } from "../services/template-service";
import { Match, Team } from "../services/tournament.type";
import { getMatchlistGroups } from "../services/match-list-service";

const templateFileName = "match-list.html";
const matchListStart = "<!-- %%dynamic-match-items-start%% -->";

const matchBlockStart = "%%match-start%%";
const matchBlockEnd = "%%match-end%%";

const roundLabel = "%%round-label%%";

const matchInfo = "%%match-info%%";

const team1Name = "%%team1-name%%";
const team1Score = "%%team1-score%%";
const team1ImageStart = "%%team1-image-start%%";
const team1ImageSrc = "%%team1-image-src%%";
const team1ImageEnd = "%%team1-image-end%%";
const isTeam1Winner = "%%is-team1-winner%%";

const team2Name = "%%team2-name%%";
const team2Score = "%%team2-score%%";
const team2ImageStart = "%%team2-image-start%%";
const team2ImageSrc = "%%team2-image-src%%";
const team2ImageEnd = "%%team2-image-end%%";
const isTeam2Winner = "%%is-team2-winner%%";

const replaceImage = (
  templateString: string,
  imageTemplateStart: string,
  imageTemplateEnd: string,
  imageTemplateSrc: string,
  imageSrc: string | undefined
): string => {
  if (imageSrc) {
    templateString = replaceOne(templateString, imageTemplateStart, "");
    templateString = replaceOne(templateString, imageTemplateEnd, "");
    templateString = replaceOne(templateString, imageTemplateSrc, imageSrc);
  } else {
    templateString = replaceBetween({
      str: templateString,
      start: imageTemplateStart,
      end: imageTemplateEnd,
      replaceTo: "",
      replaceSearchingTerm: true,
    });
  }

  return templateString;
};

interface Params {
  matches: Match[];
  teams: Team[];
  template: string;
  isKnockoutStage?: boolean;
}

const generate = async ({ matches, teams, template, isKnockoutStage }: Params) => {
  const matchGroups = getMatchlistGroups({
    matches,
    teams,
    isKnockoutStage,
  });

  const matchesTemplate = matchGroups
    .map((matchGroup) => {
      let matchItem = "";

      matchGroup.matches.forEach((match) => {
        matchItem = extractStrBetween(template, matchBlockStart, matchBlockEnd);
        matchItem = replaceOne(matchItem, roundLabel, matchGroup.label);

        matchItem = replaceOne(matchItem, matchInfo, match.matchInfo);

        matchItem = replaceImage(
          matchItem,
          team1ImageStart,
          team1ImageEnd,
          team1ImageSrc,
          match.team1ImageSrc
        );
        matchItem = replaceOne(matchItem, team1Name, match.team1Name);
        matchItem = replaceOne(matchItem, team1Score, match.team1ScoreStr ?? "");
        matchItem = replaceOne(matchItem, isTeam1Winner, match.winner === "team1" ? "winner" : "");

        matchItem = replaceImage(
          matchItem,
          team2ImageStart,
          team2ImageEnd,
          team2ImageSrc,
          match.team2ImageSrc
        );
        matchItem = replaceOne(matchItem, team2Name, match.team2Name);
        matchItem = replaceOne(matchItem, team2Score, match.team2ScoreStr ?? "");
        matchItem = replaceOne(matchItem, isTeam2Winner, match.winner === "team2" ? "winner" : "");
      });

      return matchItem;
    })
    .join("\n");

  const outputFileName = isKnockoutStage
    ? "knockout-stage-match-list.html"
    : "group-stage-match-list.html";
  const result = insertAfter(template, matchListStart, `\n${matchesTemplate}\n`);

  await createHtml(result, outputFileName);
};

export async function generateMatchList(params?: { isKnockoutStage?: boolean }) {
  const [matches, teams, template] = await Promise.all([
    getAllMatches(),
    getAllTeams(),
    readFile(path.join(__dirname, `../../templates/${templateFileName}`), { encoding: "utf8" }),
  ]);

  await generate({
    matches,
    teams,
    template,
    isKnockoutStage: params?.isKnockoutStage,
  });
}
