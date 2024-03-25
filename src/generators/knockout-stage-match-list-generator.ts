import { generateMatchList } from "./common-match-list-generator";

export const generateKnockoutStageMatchList = async () =>
  await generateMatchList({ isKnockoutStage: true });
