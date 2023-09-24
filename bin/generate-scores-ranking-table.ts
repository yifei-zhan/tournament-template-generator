#!/usr/bin/env node

import yargs from "yargs";
import helpers from "yargs/helpers";
import { generatePlayersScoresRankingTable } from "../src/generators/scores-ranking-generator";

yargs(helpers.hideBin(process.argv))
  .command(
    "$0",
    "",
    () => ({}),
    async () => {
      await generatePlayersScoresRankingTable();
    }
  )
  .parse();
