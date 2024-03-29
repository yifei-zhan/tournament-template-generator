import { getAllMatches } from "../services/matches-reader";
import { getAllTeams } from "../services/teams-reader";
import { readFile } from "fs/promises";
import path from "path";
import {
  appendTo,
  extractStrBetween,
  insertAfter,
  replaceBetween,
  replaceOne,
} from "../utils/utils";
import { createHtml } from "../services/template-service";
import { Match, Team } from "../services/tournament.type";
import { getMatchlistGroups } from "../services/match-list-service";

const templateFileName = "match-list.html";

const dynamicMatchListsStart = "<!-- %%dynamic-match-lists-start%% -->";
const templateMatchListStart = "<!-- %%match-list-start%%";
const templateMatchListEnd = "%%match-list-end%% -->";

const dynamicMatchesStart = "<!- - %%dynamic-matches-start%% - ->";
const templateMatchBlockStart = "<!- - %%match-start%% - ->";
const templateMatchBlockEnd = "<!- - %%match-end%% - ->";

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
  let matchListTemplate = extractStrBetween(template, templateMatchListStart, templateMatchListEnd);
  matchListTemplate = replaceBetween({
    str: matchListTemplate,
    start: templateMatchBlockStart,
    end: templateMatchBlockEnd,
    replaceTo: "",
  });
  const matchTemplate = extractStrBetween(template, templateMatchBlockStart, templateMatchBlockEnd);

  const matchGroups = getMatchlistGroups({
    matches,
    teams,
    isKnockoutStage,
  });

  let matchLists = "";

  matchGroups.forEach((matchGroup) => {
    let matchList = matchListTemplate;
    matchList = replaceOne(matchList, roundLabel, matchGroup.label);

    let matchItems = "";
    matchGroup.matches.forEach((match) => {
      let matchItem = matchTemplate;

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

      matchItems = appendTo(matchItems, `\n${matchItem}\n`);
    });

    matchList = insertAfter(matchList, dynamicMatchesStart, matchItems);

    matchLists = appendTo(matchLists, `\n${matchList}\n`);
  });

  const outputFileName = isKnockoutStage
    ? "knockout-stage-match-list.html"
    : "group-stage-match-list.html";

  const modifiedTemplate = insertAfter(template, dynamicMatchListsStart, matchLists);
  await createHtml(modifiedTemplate, outputFileName);
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
