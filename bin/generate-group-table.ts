#!/usr/bin/env node

import yargs from "yargs";
import helpers from "yargs/helpers";
import { generate } from "../src/generators/group-stage-generator";

yargs(helpers.hideBin(process.argv))
  .usage("$0 --gid=groupId")
  .command(
    "$0",
    "",
    () => ({}),
    async () => {
      const argv = await yargs.option("groupId", {
        alias: "gid",
        describe: "Group Id",
        type: "string",
        demandOption: true,
      }).argv;

      await generate(argv);
    }
  )
  .parse();
