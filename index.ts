import { getTableData } from "./group-stage-service";
import { Match, Team } from "./tournament.type";
import { getAllMatches } from "./match-service";

const teams: Team[] = [{
  name: "慕尼黑",
  players: [],
}, {
  name: "2",
  players: [],
}, {
  name: "3",
  players: [],
}, {
  name: "4",
  players: [],
}]

async function run() {
  const matches = await getAllMatches("matches.csv");
  console.log(matches);
}

run();

// const data = getTableData({
//   teams,
//   matches
// });

// console.log(data);