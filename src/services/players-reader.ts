import { parse } from "csv-parse";
import fs, { constants } from "fs";
import { Player } from "./tournament.type";
import { finished } from "stream/promises";
import path from "path";
import { CommaDelimiter } from "./file-reader-utils";

const fileName = process.env["PLAYERS_FILE_NAME"] ?? "players.csv";

interface RawPlayer {
  teamName: string;
  playerName: string;
}

const headersRecordInOrder: Record<keyof RawPlayer, undefined> = {
  teamName: undefined,
  playerName: undefined,
};
const headers = Object.keys(headersRecordInOrder);

const mapRaw = (rawPlayer: RawPlayer): Player => ({
  name: rawPlayer.playerName,
  teamName: rawPlayer.teamName,
});

const isPlayersFileExist = async (path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path, constants.F_OK);
    return true;
  } catch {
    // eslint-disable-next-line no-console
    console.log("[Debug] Players file(optional) is not provided");
    return false;
  }
};

const filePath = path.join(__dirname, `../../input/${fileName}`);

export const tryGetPlayers = async (): Promise<Player[] | undefined> => {
  const players: RawPlayer[] = [];

  const fileExists = await isPlayersFileExist(filePath);
  if (!fileExists) {
    return undefined;
  }

  const parser = fs.createReadStream(filePath).pipe(
    parse({
      delimiter: CommaDelimiter,
      columns: [...headers],
      from_line: 2,
    })
  );

  parser.on("readable", () => {
    let record: RawPlayer;
    while ((record = parser.read()) !== null) {
      players.push(record);
    }
  });

  await finished(parser);

  return players.map(mapRaw);
};
