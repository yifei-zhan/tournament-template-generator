#!/usr/bin/env node

import yargs from "yargs";
import helpers from "yargs/helpers";
import { generatePlayersAssistsRankingTable } from "../src/generators/assists-ranking-generator";

yargs(helpers.hideBin(process.argv))
  .command(
    "$0",
    "",
    () => ({}),
    async () => {
      await generatePlayersAssistsRankingTable();
    }
  )
  .parse();
