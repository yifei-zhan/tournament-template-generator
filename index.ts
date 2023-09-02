import { generateGroupStageTables } from "./src/generators/group-stage-generator";

async function run() {
  await generateGroupStageTables();
}

run();
