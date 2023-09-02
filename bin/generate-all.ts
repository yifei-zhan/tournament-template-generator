#!/usr/bin/env node

import yargs from "yargs";
import helpers from "yargs/helpers";
import { generateScoresRankingTable } from "../src/generators/scores-ranking-generator";
import { generateGroupStageTables } from "../src/generators/group-stage-generator";

yargs(helpers.hideBin(process.argv))
  .command(
    "$0",
    "",
    () => ({}),
    async () => {
      await generateGroupStageTables();
      await generateScoresRankingTable();
    }
  )
  .parse();
