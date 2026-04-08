export type ConsoleEntry = {
  id: string;
  title: string;
  status: "success" | "error";
  endpoint: string;
  payload?: unknown;
  response?: unknown;
  createdAt: string;
};

export type DisplayStatEntry = {
  type: "stat" | "separator" | "skill_dps";
  key?: string;
  label?: string;
  rawValue?: unknown;
  value?: number;
  formatted?: string;
  overCap?: number;
  format?: string;
  colorHint?: string;
  trigger?: string;
  skillPart?: string;
  source?: string;
};

export type DisplayStatsResult = {
  _meta?: {
    buildName?: string;
    level?: number;
    treeVersion?: string;
    mainSkill?: string;
    skillContext?: {
      socketGroupIndex?: number;
      socketGroupLabel?: string;
      skillIndex?: number;
      skillPartIndex?: number;
      skillPartName?: string;
      name?: string;
      selectionSource?: string;
    };
  };
  entries: DisplayStatEntry[];
};
