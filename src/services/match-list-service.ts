import { ensureDefined } from "../utils/utils";
import { Match, Team, TeamInMatch } from "./tournament.type";

const getTeamScoreStr = (team: TeamInMatch): string | undefined => {
  if (team.scored === undefined) {
    return undefined;
  }

  return `${team.scored}${team.penaltyScored ? `(${team.penaltyScored})` : ""}`;
};

const getWinner = (team1: TeamInMatch, team2: TeamInMatch): "team1" | "team2" | undefined => {
  if (team1.scored === undefined || team2.scored === undefined) {
    return undefined;
  }

  if (team1.scored > team2.scored) {
    return "team1";
  }

  if (team1.scored < team2.scored) {
    return "team2";
  }

  // Penalty
  if (team1.penaltyScored === undefined || team2.penaltyScored === undefined) {
    return undefined;
  }

  if (team1.penaltyScored > team2.penaltyScored) {
    return "team1";
  }

  if (team1.penaltyScored < team2.penaltyScored) {
    return "team2";
  }

  return undefined;
};

const getDefaultMatchInfo = (match: Match): string => {
  if (match.matchTime && match.fieldLabel) {
    return `${match.matchTime} - ${match.fieldLabel}`;
  }

  if (match.matchTime) {
    return `${match.matchTime}`;
  }

  return "";
};

interface MappedMatch {
  matchInfo: string;

  team1Name: string;
  team1ScoreStr?: string;
  team1ImageSrc?: string;

  team2Name: string;
  team2ScoreStr?: string;
  team2ImageSrc?: string;

  winner?: "team1" | "team2";
}

const getMappedMatch = (
  match: Match,
  teams: Team[],
  getCustomMatchInfo?: (match: Match) => string
): MappedMatch => {
  const team1InMatch = match.teams[0];
  const team2InMatch = match.teams[1];

  const team1ImageSrc = teams.find((team) => team.name === team1InMatch.name)?.imageSrc;
  const team2ImageSrc = teams.find((team) => team.name === team2InMatch.name)?.imageSrc;

  return {
    matchInfo: getCustomMatchInfo?.(match) ?? getDefaultMatchInfo(match),

    team1Name: team1InMatch.name,
    team1ScoreStr: getTeamScoreStr(team1InMatch),
    team1ImageSrc,

    team2Name: team2InMatch.name,
    team2ScoreStr: getTeamScoreStr(team2InMatch),
    team2ImageSrc,

    winner: getWinner(team1InMatch, team2InMatch),
  };
};

interface MatchGroup {
  label: string;
  key: string;
  matches: MappedMatch[];
}

const extendMatchGroups = (
  matchGroups: MatchGroup[],
  match: Match,
  teams: Team[],
  stage: { groupKey: string; groupLabel: string },
  getCustomMatchInfo?: (match: Match) => string
) => {
  const existingMatchGroup = matchGroups.find((group) => group.key === stage.groupKey);

  if (existingMatchGroup) {
    existingMatchGroup.matches.push(getMappedMatch(match, teams, getCustomMatchInfo));
  } else {
    matchGroups.push({
      label: stage.groupLabel,
      key: stage.groupKey,
      matches: [getMappedMatch(match, teams, getCustomMatchInfo)],
    });
  }
};

const getKnockoutStageMatchGroups = (matches: Match[], teams: Team[]): MatchGroup[] => {
  const matchGroups: MatchGroup[] = [];

  matches.forEach((match) => {
    const knockoutStage = ensureDefined(match.knockoutStage);

    extendMatchGroups(
      matchGroups,
      match,
      teams,
      {
        groupKey: knockoutStage.id,
        groupLabel: knockoutStage.label,
      },
      (match) => {
        const roundLabel = ensureDefined(match.knockoutStage).roundLabel;
        const defaultInfo = getDefaultMatchInfo(match);

        return defaultInfo !== "" ? `${roundLabel} ${defaultInfo}` : roundLabel;
      }
    );
  });

  return matchGroups;
};

const getGroupStageMatchGroups = (matches: Match[], teams: Team[]): MatchGroup[] => {
  const matchGroups: MatchGroup[] = [];

  matches.forEach((match) => {
    const groupStage = ensureDefined(match.groupStage);

    extendMatchGroups(
      matchGroups,
      match,
      teams,
      {
        groupKey: groupStage.groupId,
        groupLabel: groupStage.groupLabel,
      },
      (match) => {
        const roundLabel = ensureDefined(match.groupStage).roundLabel;
        const defaultInfo = getDefaultMatchInfo(match);

        return defaultInfo !== "" ? `${roundLabel} ${defaultInfo}` : roundLabel;
      }
    );
  });

  return matchGroups;
};

interface GetMatchlistGroupsParams {
  matches: Match[];
  teams: Team[];
  isKnockoutStage?: boolean;
}

export const getMatchlistGroups = ({
  matches,
  teams,
  isKnockoutStage,
}: GetMatchlistGroupsParams): MatchGroup[] => {
  const filteredMatches = matches.filter((match) =>
    isKnockoutStage ? match.knockoutStage !== undefined : match.groupStage !== undefined
  );
  const reversedMatches = [...filteredMatches].reverse();

  return isKnockoutStage
    ? getKnockoutStageMatchGroups(reversedMatches, teams)
    : getGroupStageMatchGroups(reversedMatches, teams);
};
