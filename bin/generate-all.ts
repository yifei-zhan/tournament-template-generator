#!/usr/bin/env node

import yargs from "yargs";
import helpers from "yargs/helpers";
import { generateGroupStageTables } from "../src/generators/group-stage-generator";
import { generatePlayersScoresRankingTable } from "../src/generators/scores-ranking-generator";

yargs(helpers.hideBin(process.argv))
  .command(
    "$0",
    "",
    () => ({}),
    async () => {
      await generateGroupStageTables();
      await generatePlayersScoresRankingTable();
    }
  )
  .parse();
