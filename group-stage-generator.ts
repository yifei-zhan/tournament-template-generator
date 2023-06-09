import { getAllMatches } from "./input-data/matches-reader";
import { getAllTeams } from "./input-data/teams-reader"
import { getTableData } from "./group-stage-service";

interface GenerateParams {
  groupId: string;
}

export async function generate({ groupId }: GenerateParams) {
  const matches = await getAllMatches();
  const teams = await getAllTeams();

  const table = getTableData({
    teams,
    matches,
    groupId
  });

  console.log(table);
}