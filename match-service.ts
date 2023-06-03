import { parse } from "csv-parse";
import fs from "fs";
import { Match } from "./tournament.type";
import { finished } from 'stream/promises';

interface RawMatch {
  matchId: string;
  matchTime: string;
  fieldLabel: string;
  groupLabel: string;
  roundLabel: string;

  team1Name: string;
  team1Scored: string;
  team1ScoredPlayersNames: string[];
  team1YellowCardsPlayersNames: string[];
  team1RedCardsPlayersNames: string[];
  team1PenaltyScored: string;

  team2Name: string;
  team2Scored: string;
  team2ScoredPlayersNames: string[];
  team2YellowCardsPlayersNames: string[];
  team2RedCardsPlayersNames: string[];
  team2PenaltyScored: string;
}

const headersRecord: Record<keyof RawMatch, undefined> = {
  matchId: undefined,
  matchTime: undefined,
  fieldLabel: undefined,
  groupLabel: undefined,
  roundLabel: undefined,

  team1Name: undefined,
  team1Scored: undefined,
  team1ScoredPlayersNames: undefined,
  team1YellowCardsPlayersNames: undefined,
  team1RedCardsPlayersNames: undefined,
  team1PenaltyScored: undefined,

  team2Name: undefined,
  team2Scored: undefined,
  team2ScoredPlayersNames: undefined,
  team2YellowCardsPlayersNames: undefined,
  team2RedCardsPlayersNames: undefined,
  team2PenaltyScored: undefined,
};
const headers = Object.keys(headersRecord);

export const getAllMatches = async (fileName: string): Promise<Match[]> => {
  const matches: RawMatch[] = [];

  const parser = fs.createReadStream(`./input/${fileName}`)
    .pipe(parse({
      delimiter: ";",
      columns: [...headers],
      from_line: 2
    }));

  parser.on("readable", () => {
    let record: RawMatch;
    while ((record = parser.read()) !== null) {
      matches.push(record);
    }
  });

  await finished(parser);

  return matches;
};