import { generateGroupStageTables } from "./src/generators/group-stage-generator";
import { generateScoresRankingTable } from "./src/generators/scores-ranking-generator";

async function run() {
  await generateGroupStageTables();
  await generateScoresRankingTable();
}

run();
