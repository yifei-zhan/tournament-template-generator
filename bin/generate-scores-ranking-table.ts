#!/usr/bin/env node

import yargs from "yargs";
import helpers from "yargs/helpers";
import { generateScoresRankingTable } from "../src/generators/scores-ranking-generator";

yargs(helpers.hideBin(process.argv))
  .command(
    "$0",
    "hihihi",
    () => ({}),
    async () => {
      await generateScoresRankingTable();
    }
  )
  .parse();
