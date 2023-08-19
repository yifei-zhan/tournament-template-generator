import { getAllMatches } from "./src/services/matches-reader";
import { getSortedScoresRankingData } from "./src/services/scores-ranking-service";

async function run() {
  const matches = await getAllMatches();

  getSortedScoresRankingData(matches);
}

run();
