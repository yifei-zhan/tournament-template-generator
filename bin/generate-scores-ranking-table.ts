#!/usr/bin/env node

import yargs from "yargs";
import helpers from "yargs/helpers";
import { generateScoresRankingTable } from "../src/generators/scores-ranking-generator";

yargs(helpers.hideBin(process.argv))
  .usage("$0 --gid=groupId")
  .command(
    "$0",
    "",
    () => ({}),
    async () => {
      await generateScoresRankingTable();
    }
  )
  .parse();
