import { parse } from "csv-parse";
import fs from "fs";
import { Match, MatchGroupStage } from "./tournament.type";
import { finished } from "stream/promises";
import path from "path";

interface RawMatch {
  matchId: string;
  matchTime: string;
  fieldLabel: string;
  groupLabel: string;
  roundLabel: string;

  team1Name: string;
  team1Scored: string;
  team1ScoredPlayersNames: string;
  team1YellowCardsPlayersNames: string;
  team1RedCardsPlayersNames: string;
  team1PenaltyScored: string;

  team2Name: string;
  team2Scored: string;
  team2ScoredPlayersNames: string;
  team2YellowCardsPlayersNames: string;
  team2RedCardsPlayersNames: string;
  team2PenaltyScored: string;
}

const headersRecord: Record<keyof RawMatch, undefined> = {
  matchId: undefined,
  matchTime: undefined,
  fieldLabel: undefined,
  groupLabel: undefined,
  roundLabel: undefined,

  team1Name: undefined,
  team2Name: undefined,
  team1Scored: undefined,
  team2Scored: undefined,
  team1PenaltyScored: undefined,
  team2PenaltyScored: undefined,

  team1ScoredPlayersNames: undefined,
  team2ScoredPlayersNames: undefined,
  team1YellowCardsPlayersNames: undefined,
  team2YellowCardsPlayersNames: undefined,
  team1RedCardsPlayersNames: undefined,
  team2RedCardsPlayersNames: undefined,
};
const headers = Object.keys(headersRecord);

const mapRawMatchToMatch = (rawMatch: RawMatch): Match => {
  const groupStage: MatchGroupStage | undefined =
    rawMatch.groupLabel && rawMatch.roundLabel
      ? {
          groupId: rawMatch.groupLabel,
          groupLabel: rawMatch.groupLabel,
          roundId: rawMatch.roundLabel,
          roundLabel: rawMatch.roundLabel,
        }
      : undefined;
  const isEnded = rawMatch.team1Scored !== "" && rawMatch.team2Scored !== "";

  return {
    groupStage,
    matchId: rawMatch.matchId,
    matchTime: rawMatch.matchTime,
    fieldLabel: rawMatch.fieldLabel,
    isEnded,

    teams: [
      {
        name: rawMatch.team1Name,
        scored: Number(rawMatch.team1Scored),
        penaltyScored:
          rawMatch.team1PenaltyScored !== "" ? Number(rawMatch.team1PenaltyScored) : undefined,
        teamScoredPlayerNames: rawMatch.team1ScoredPlayersNames.split(","),
        teamYellowCardsPlayerNames: rawMatch.team1YellowCardsPlayersNames.split(","),
        teamRedCardsPlayerNames: rawMatch.team1RedCardsPlayersNames.split(","),
      },
      {
        name: rawMatch.team2Name,
        scored: Number(rawMatch.team2Scored),
        penaltyScored:
          rawMatch.team2PenaltyScored !== "" ? Number(rawMatch.team2PenaltyScored) : undefined,
        teamScoredPlayerNames: rawMatch.team2ScoredPlayersNames.split(","),
        teamYellowCardsPlayerNames: rawMatch.team2YellowCardsPlayersNames.split(","),
        teamRedCardsPlayerNames: rawMatch.team2RedCardsPlayersNames.split(","),
      },
    ],
  };
};
export const getAllMatches = async (): Promise<Match[]> => {
  const matches: RawMatch[] = [];

  const parser = fs.createReadStream(path.join(__dirname, "../input/matches.csv")).pipe(
    parse({
      delimiter: ";",
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

  return matches.map(mapRawMatchToMatch);
};
