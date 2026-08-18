export type University = {
  id: string;
  name: string;
  acronym: string;
  state: string;
  directoryUrl: string;
  directoryLabel: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExpertStatus = "draft" | "published" | "archived";

export type Expert = {
  id: string;
  universityId: string;
  universityName: string;
  universityAcronym: string;
  name: string;
  title: string;
  department: string;
  area: string;
  specialties: string[];
  summary: string;
  email: string | null;
  phone: string | null;
  profileUrl: string;
  sourceLabel: string;
  referenceTitle: string;
  referenceUrl: string;
  verifiedAt: string;
  status: ExpertStatus;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};

export type Curator = {
  email: string;
  name: string;
  active: boolean;
  createdAt: string;
};

export type CatalogPayload = {
  universities: University[];
  experts: Expert[];
};

export type MatchEngine = "gpt-5.6-luna" | "lexical-fallback" | "catalog";

export type MatchLevel = "alta" | "media" | "exploratoria";

export type ExpertMatch = {
  expertId: string;
  level: MatchLevel;
  rationale: string;
  signals: string[];
};

export type MatchPayload = {
  query: string;
  universityId: string;
  engine: MatchEngine;
  queryUnderstanding: string;
  matches: ExpertMatch[];
  latencyMs: number;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  warning?: string;
};

export type AdminCatalogPayload = CatalogPayload & {
  curators: Curator[];
};
