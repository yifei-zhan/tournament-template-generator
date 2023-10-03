import { generatePlayersAssistsRankingTable } from "./src/generators/assists-ranking-generator";
import { generateGroupStageTables } from "./src/generators/group-stage-generator";
import { generatePlayersRedCardsRankingTable } from "./src/generators/red-cards-ranking-generator";
import { generatePlayersScoresRankingTable } from "./src/generators/scores-ranking-generator";
import { generatePlayersYellowCardsRankingTable } from "./src/generators/yellow-cards-ranking-generator";

async function run() {
  await generateGroupStageTables();

  await generatePlayersScoresRankingTable();
  await generatePlayersAssistsRankingTable();
  await generatePlayersYellowCardsRankingTable();
  await generatePlayersRedCardsRankingTable();
}

run();
