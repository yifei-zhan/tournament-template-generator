import { generatePlayersAssistsRankingTable } from "./src/generators/assists-ranking-generator";
import { generateGroupStageTables } from "./src/generators/group-stage-generator";
import { generatePlayersScoresRankingTable } from "./src/generators/scores-ranking-generator";

async function run() {
  await generateGroupStageTables();

  await generatePlayersScoresRankingTable();
  await generatePlayersAssistsRankingTable();
}

run();
