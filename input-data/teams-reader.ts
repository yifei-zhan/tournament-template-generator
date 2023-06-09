import { parse } from "csv-parse";
import fs from "fs";
import { Team } from "../services/tournament.type";
import { finished } from "stream/promises";
import path from "path";

interface RawTeam {
  name: string;
  shortLabel: string;
  imageSrc: string;
}

const headersRecord: Record<keyof RawTeam, undefined> = {
  name: undefined,
  shortLabel: undefined,
  imageSrc: undefined,
};
const headers = Object.keys(headersRecord);

const mapRawTeamToTeam = (rawTeam: RawTeam): Team => ({
  name: rawTeam.name,
  shortLabel: rawTeam.shortLabel !== "" ? rawTeam.shortLabel : undefined,
  imageSrc: rawTeam.imageSrc !== "" ? rawTeam.imageSrc : undefined,
});

export const getAllTeams = async (): Promise<Team[]> => {
  const teams: RawTeam[] = [];

  const parser = fs.createReadStream(path.join(__dirname, "./teams.csv")).pipe(
    parse({
      delimiter: ";",
      columns: [...headers],
      from_line: 2,
    })
  );

  parser.on("readable", () => {
    let record: RawTeam;
    while ((record = parser.read()) !== null) {
      teams.push(record);
    }
  });

  await finished(parser);

  return teams.map(mapRawTeamToTeam);
};
