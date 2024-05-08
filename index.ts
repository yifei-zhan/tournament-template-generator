import { generatePlayersAssistsRankingTable } from "./src/generators/assists-ranking-generator";
import { generateGroupStageTables } from "./src/generators/group-stage-generator";
import { generateGroupStageMatchList } from "./src/generators/group-stage-match-list-generator";
import { generateKnockoutStageMatchList } from "./src/generators/knockout-stage-match-list-generator";
import { generatePlayersRedCardsRankingTable } from "./src/generators/red-cards-ranking-generator";
import { generatePlayersScoresRankingTable } from "./src/generators/scores-ranking-generator";
import { generatePlayersYellowCardsRankingTable } from "./src/generators/yellow-cards-ranking-generator";

async function run() {
  await Promise.all([
    generateGroupStageTables(),

    generatePlayersScoresRankingTable(),
    generatePlayersAssistsRankingTable(),
    generatePlayersYellowCardsRankingTable(),
    generatePlayersRedCardsRankingTable(),

    generateGroupStageMatchList(),
    generateKnockoutStageMatchList(),
  ]);
}

run();

// import { downloadFilesFromBucket, uploadFile } from "./src/aws/s3-buckets-service";
// uploadFile();
// downloadFilesFromBucket();

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const handler = async (event: any, context: any) => {
  return "AWS Lambda function executed successfully!";
};
