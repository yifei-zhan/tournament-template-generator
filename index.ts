import { generateGroupStageTables } from "./src/generators/group-stage-generator";
import { generatePlayersScoresRankingTable } from "./src/generators/scores-ranking-generator";

async function run() {
  await generateGroupStageTables();

  await generatePlayersScoresRankingTable();
}

run();
