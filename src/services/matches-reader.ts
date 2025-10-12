import { parse } from "csv-parse";
import fs from "fs";
import { KnockoutStage, Match, MatchGroupStage, TeamInMatch } from "./tournament.type";
import { finished } from "stream/promises";
import path from "path";
import { CommaDelimiter } from "./file-reader-utils";

const fileName = process.env["MATCHES_FILE_NAME"] ?? "matches.csv";

interface RawMatch {
  matchId: string;
  matchTime: string;
  fieldLabel: string;
  groupLabel: string;
  roundLabel: string;

  knockoutLabel: string;
  knockoutRoundLabel: string;

  team1Name: string;
  team1Scored: string;
  team1ScoredPlayersNames: string;
  team1AssistancePlayerNames: string;
  team1YellowCardsPlayersNames: string;
  team1RedCardsPlayersNames: string;
  team1PenaltyScored: string;

  team2Name: string;
  team2Scored: string;
  team2ScoredPlayersNames: string;
  team2AssistancePlayerNames: string;
  team2YellowCardsPlayersNames: string;
  team2RedCardsPlayersNames: string;
  team2PenaltyScored: string;
}

const headersRecordInOrder: Record<keyof RawMatch, undefined> = {
  matchId: undefined,
  matchTime: undefined,
  fieldLabel: undefined,

  groupLabel: undefined,
  roundLabel: undefined,

  knockoutLabel: undefined,
  knockoutRoundLabel: undefined,

  team1Name: undefined,
  team2Name: undefined,
  team1Scored: undefined,
  team2Scored: undefined,
  team1PenaltyScored: undefined,
  team2PenaltyScored: undefined,

  team1ScoredPlayersNames: undefined,
  team2ScoredPlayersNames: undefined,
  team1AssistancePlayerNames: undefined,
  team2AssistancePlayerNames: undefined,
  team1YellowCardsPlayersNames: undefined,
  team2YellowCardsPlayersNames: undefined,
  team1RedCardsPlayersNames: undefined,
  team2RedCardsPlayersNames: undefined,
};
const headers = Object.keys(headersRecordInOrder);

const mapCommaDelimiterStrToArr = (raw: string): string[] => {
  if (raw === "") {
    return [];
  }

  return raw.split(",");
};

const mapRawMatchToMatch = (rawMatch: RawMatch): Match => {
  const groupStage: MatchGroupStage | undefined =
    rawMatch.groupLabel && rawMatch.roundLabel
      ? {
          groupId: rawMatch.groupLabel,
          groupLabel: rawMatch.groupLabel,

          roundKey: rawMatch.roundLabel,
          roundLabel: rawMatch.roundLabel,
        }
      : undefined;
  const knockoutStage: KnockoutStage | undefined =
    rawMatch.knockoutLabel && rawMatch.knockoutRoundLabel
      ? {
          id: rawMatch.knockoutLabel,
          label: rawMatch.knockoutLabel,

          roundKey: rawMatch.knockoutRoundLabel,
          roundLabel: rawMatch.knockoutRoundLabel,
        }
      : undefined;
  const isEnded = rawMatch.team1Scored !== "" && rawMatch.team2Scored !== "";
  const countOnly = rawMatch.matchId.endsWith("*");

  return {
    groupStage,
    knockoutStage,
    matchId: rawMatch.matchId,
    matchTime: rawMatch.matchTime,
    fieldLabel: rawMatch.fieldLabel,
    isEnded,
    countOnly,

    teams: [
      {
        name: rawMatch.team1Name,
        scored: rawMatch.team1Scored !== "" ? Number(rawMatch.team1Scored) : undefined,
        penaltyScored:
          rawMatch.team1PenaltyScored !== "" ? Number(rawMatch.team1PenaltyScored) : undefined,
        teamScoredPlayerNames: mapCommaDelimiterStrToArr(rawMatch.team1ScoredPlayersNames),
        teamAssistancePlayerNames: mapCommaDelimiterStrToArr(rawMatch.team1AssistancePlayerNames),
        teamYellowCardsPlayerNames: mapCommaDelimiterStrToArr(
          rawMatch.team1YellowCardsPlayersNames
        ),
        teamRedCardsPlayerNames: mapCommaDelimiterStrToArr(rawMatch.team1RedCardsPlayersNames),
      },
      {
        name: rawMatch.team2Name,
        scored: rawMatch.team2Scored !== "" ? Number(rawMatch.team2Scored) : undefined,
        penaltyScored:
          rawMatch.team2PenaltyScored !== "" ? Number(rawMatch.team2PenaltyScored) : undefined,
        teamScoredPlayerNames: mapCommaDelimiterStrToArr(rawMatch.team2ScoredPlayersNames),
        teamAssistancePlayerNames: mapCommaDelimiterStrToArr(rawMatch.team2AssistancePlayerNames),
        teamYellowCardsPlayerNames: mapCommaDelimiterStrToArr(
          rawMatch.team2YellowCardsPlayersNames
        ),
        teamRedCardsPlayerNames: mapCommaDelimiterStrToArr(rawMatch.team2RedCardsPlayersNames),
      },
    ],
  };
};

const checkTeamInMatchAndThrowIfInvalid = (team: TeamInMatch, matchId: string) => {
  if (team.scored !== team.teamScoredPlayerNames.length) {
    throw new Error(
      `Match: ${matchId} have team ${team.name} scored: ${
        team.scored
      } but have non-matching scored players: ${team.teamScoredPlayerNames.join(", ")}`
    );
  }
};

const checkMatchesAndThrowIfInvalid = (matches: Match[]) => {
  matches.forEach((match) => {
    if (!match.isEnded) {
      return;
    }

    const team1 = match.teams[0];
    const team2 = match.teams[1];

    checkTeamInMatchAndThrowIfInvalid(team1, match.matchId);
    checkTeamInMatchAndThrowIfInvalid(team2, match.matchId);
  });
};

export const getAllMatches = async (): Promise<Match[]> => {
  const matches: RawMatch[] = [];

  const parser = fs.createReadStream(path.join(__dirname, `../../input/${fileName}`)).pipe(
    parse({
      delimiter: CommaDelimiter,
      columns: [...headers],
      from_line: 2,
    })
  );

  parser.on("readable", () => {
    let record: RawMatch;
    while ((record = parser.read()) !== null) {
      matches.push(record);
    }
  });

  await finished(parser);

  const mappedMatches = matches.map(mapRawMatchToMatch);

  checkMatchesAndThrowIfInvalid(mappedMatches.filter((match) => !match.countOnly));

  return mappedMatches;
};
