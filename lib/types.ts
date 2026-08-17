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

export type AdminCatalogPayload = CatalogPayload & {
  curators: Curator[];
};
