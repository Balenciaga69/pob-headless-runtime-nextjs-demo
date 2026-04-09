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

export type PreviewItemDisplayStatsResult = {
  kind?: string;
  restored?: boolean;
  simulationMode?: string;
  slot?: {
    requested?: string | null;
    resolved?: string | null;
    label?: string | null;
    autoResolved?: boolean;
    [key: string]: unknown;
  };
  currentItem?: {
    [key: string]: unknown;
  } | null;
  candidateItem?: {
    [key: string]: unknown;
  } | null;
  displayStats?: DisplayStatsResult;
  [key: string]: unknown;
};

export type ItemEntry = {
  id?: string | number;
  raw?: string | null;
  item?: {
    name?: string | null;
    rarity?: string | null;
    type?: string | null;
    itemLevel?: number | null;
    sockets?: unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type ItemListResult = {
  items?: ItemEntry[];
  slots?: Array<{
    slot?: string;
    label?: string;
    raw?: string | null;
    item?: ItemEntry["item"];
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

export type SkillListEntry = {
  index?: number;
  name?: string | null;
  skillPart?: number | string | null;
  [key: string]: unknown;
};

export type SkillGroupEntry = {
  index?: number;
  label?: string | null;
  displayLabel?: string | null;
  slot?: string | null;
  mainActiveSkill?: number | null;
  isSelected?: boolean;
  skills?: SkillListEntry[];
  [key: string]: unknown;
};

export type SkillListResult = {
  mainSocketGroup?: number | null;
  calcsSkillNumber?: number | null;
  groups?: SkillGroupEntry[];
  [key: string]: unknown;
};

export type SelectedSkillResult = {
  group?: {
    index?: number;
    label?: string | null;
    displayLabel?: string | null;
    slot?: string | null;
    [key: string]: unknown;
  };
  skill?: {
    index?: number;
    name?: string | null;
    [key: string]: unknown;
  };
  part?: {
    index?: number;
    name?: string | null;
    [key: string]: unknown;
  };
  calcsSkillNumber?: number | null;
  [key: string]: unknown;
};

export type SkillSelectionInput = {
  group?: number;
  mainSocketGroup?: number;
  skill?: number;
  mainActiveSkill?: number;
  part?: number;
  skillPart?: number;
};
