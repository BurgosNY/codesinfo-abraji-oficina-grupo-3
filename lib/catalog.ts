import { getD1 } from "@/db";
import { seedCurators, seedExperts, seedUniversities } from "@/lib/seed-data";
import type {
  AdminCatalogPayload,
  Curator,
  Expert,
  ExpertStatus,
  University,
} from "@/lib/types";

let ready: Promise<void> | null = null;

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS universities (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    acronym TEXT NOT NULL,
    state TEXT NOT NULL,
    directory_url TEXT NOT NULL,
    directory_label TEXT NOT NULL,
    notes TEXT NOT NULL,
    is_active INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS experts (
    id TEXT PRIMARY KEY NOT NULL,
    university_id TEXT NOT NULL REFERENCES universities(id),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    area TEXT NOT NULL,
    specialties TEXT NOT NULL,
    summary TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    profile_url TEXT NOT NULL,
    source_label TEXT NOT NULL,
    reference_title TEXT NOT NULL,
    reference_url TEXT NOT NULL,
    verified_at TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    updated_by TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS curators (
    email TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    active INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS catalog_data_migrations (
    id TEXT PRIMARY KEY NOT NULL,
    applied_at TEXT NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS experts_status_idx ON experts(status)",
  "CREATE INDEX IF NOT EXISTS experts_university_idx ON experts(university_id)",
  "CREATE INDEX IF NOT EXISTS experts_name_idx ON experts(name)",
];

export async function ensureCatalog() {
  if (!ready) {
    ready = initializeCatalog().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

async function initializeCatalog() {
  const d1 = getD1();
  await d1.batch(schemaStatements.map((statement) => d1.prepare(statement)));

  const expertColumns = await d1.prepare("PRAGMA table_info(experts)").all<{ name: string }>();
  if (!expertColumns.results.some((column) => column.name === "reference_title")) {
    await d1.prepare("ALTER TABLE experts ADD COLUMN reference_title TEXT NOT NULL DEFAULT ''").run();
  }
  if (!expertColumns.results.some((column) => column.name === "reference_url")) {
    await d1.prepare("ALTER TABLE experts ADD COLUMN reference_url TEXT NOT NULL DEFAULT ''").run();
  }

  await d1.batch(
    seedUniversities.map((university) =>
      d1
        .prepare(
          `INSERT OR IGNORE INTO universities
            (id, name, acronym, state, directory_url, directory_label, notes, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          university.id,
          university.name,
          university.acronym,
          university.state,
          university.directoryUrl,
          university.directoryLabel,
          university.notes,
          university.isActive ? 1 : 0,
          university.createdAt,
          university.updatedAt,
        ),
    ),
  );

  const prepareExpertSeed = (expert: (typeof seedExperts)[number], replace = false) =>
      d1
        .prepare(
          `INSERT ${replace ? "OR REPLACE " : "OR IGNORE "}INTO experts
            (id, university_id, name, title, department, area, specialties, summary, email, phone,
             profile_url, source_label, reference_title, reference_url, verified_at, status,
             created_at, updated_at, updated_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          expert.id,
          expert.universityId,
          expert.name,
          expert.title,
          expert.department,
          expert.area,
          JSON.stringify(expert.specialties),
          expert.summary,
          expert.email,
          expert.phone,
          expert.profileUrl,
          expert.sourceLabel,
          expert.referenceTitle,
          expert.referenceUrl,
          expert.verifiedAt,
          expert.status,
          expert.createdAt,
          expert.updatedAt,
          expert.updatedBy,
        );

  await d1.batch(seedExperts.map((expert) => prepareExpertSeed(expert)));

  await d1.batch(
    seedCurators.map((curator) =>
      d1
        .prepare(
          "INSERT OR IGNORE INTO curators (email, name, active, created_at) VALUES (?, ?, ?, ?)",
        )
        .bind(curator.email.toLowerCase(), curator.name, curator.active ? 1 : 0, curator.createdAt),
    ),
  );

  const realOnlyCorrection = "2026-08-17-real-only-v1";
  const alreadyCorrected = await d1
    .prepare("SELECT id FROM catalog_data_migrations WHERE id = ?")
    .bind(realOnlyCorrection)
    .first<{ id: string }>();
  if (!alreadyCorrected) {
    await d1.batch([
      d1
        .prepare(
          `UPDATE experts SET email = NULL, profile_url = ?, source_label = ?, updated_at = ?, updated_by = ?
           WHERE id = 'usp-wilson-bueno'`,
        )
        .bind(
          "https://portalservicos.usp.br/especialistas/especialistaObter?codpub=97A29E6FE1D9",
          "Portal de Especialistas da USP",
          new Date().toISOString(),
          "verificacao-oficial",
        ),
      d1
        .prepare("INSERT INTO catalog_data_migrations (id, applied_at) VALUES (?, ?)")
        .bind(realOnlyCorrection, new Date().toISOString()),
    ]);
  }

  const contactProofCorrection = "2026-08-17-contact-proof-v1";
  const contactsAlreadyCorrected = await d1
    .prepare("SELECT id FROM catalog_data_migrations WHERE id = ?")
    .bind(contactProofCorrection)
    .first<{ id: string }>();
  if (!contactsAlreadyCorrected) {
    const correctedAt = new Date().toISOString();
    await d1.batch([
      d1
        .prepare(
          `UPDATE experts SET email = NULL, phone = NULL, updated_at = ?, updated_by = ?
           WHERE id IN ('ufmg-evandro-cunha', 'ufmg-deborah-malta', 'ufmg-wagner-meira', 'usp-deisy-ventura', 'usp-paulo-artaxo')`,
        )
        .bind(correctedAt, "verificacao-oficial"),
      d1
        .prepare("INSERT INTO catalog_data_migrations (id, applied_at) VALUES (?, ?)")
        .bind(contactProofCorrection, correctedAt),
    ]);
  }

  const thematicCatalogMigration = "2026-08-17-thematic-30-v1";
  const thematicCatalogApplied = await d1
    .prepare("SELECT id FROM catalog_data_migrations WHERE id = ?")
    .bind(thematicCatalogMigration)
    .first<{ id: string }>();
  if (!thematicCatalogApplied) {
    const migratedAt = new Date().toISOString();
    await d1.batch([
      d1.prepare("DELETE FROM experts"),
      ...seedExperts.map((expert) => prepareExpertSeed(expert, true)),
      d1
        .prepare("INSERT INTO catalog_data_migrations (id, applied_at) VALUES (?, ?)")
        .bind(thematicCatalogMigration, migratedAt),
    ]);
  }
}

type UniversityRow = {
  id: string;
  name: string;
  acronym: string;
  state: string;
  directory_url: string;
  directory_label: string;
  notes: string;
  is_active: number;
  created_at: string;
  updated_at: string;
};

type ExpertRow = {
  id: string;
  university_id: string;
  university_name: string;
  university_acronym: string;
  name: string;
  title: string;
  department: string;
  area: string;
  specialties: string;
  summary: string;
  email: string | null;
  phone: string | null;
  profile_url: string;
  source_label: string;
  reference_title: string;
  reference_url: string;
  verified_at: string;
  status: ExpertStatus;
  created_at: string;
  updated_at: string;
  updated_by: string;
};

type CuratorRow = {
  email: string;
  name: string;
  active: number;
  created_at: string;
};

function mapUniversity(row: UniversityRow): University {
  return {
    id: row.id,
    name: row.name,
    acronym: row.acronym,
    state: row.state,
    directoryUrl: row.directory_url,
    directoryLabel: row.directory_label,
    notes: row.notes,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapExpert(row: ExpertRow): Expert {
  let specialties: string[] = [];
  try {
    const parsed: unknown = JSON.parse(row.specialties);
    specialties = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    specialties = row.specialties.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return {
    id: row.id,
    universityId: row.university_id,
    universityName: row.university_name,
    universityAcronym: row.university_acronym,
    name: row.name,
    title: row.title,
    department: row.department,
    area: row.area,
    specialties,
    summary: row.summary,
    email: row.email,
    phone: row.phone,
    profileUrl: row.profile_url,
    sourceLabel: row.source_label,
    referenceTitle: row.reference_title,
    referenceUrl: row.reference_url,
    verifiedAt: row.verified_at,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

function mapCurator(row: CuratorRow): Curator {
  return {
    email: row.email,
    name: row.name,
    active: Boolean(row.active),
    createdAt: row.created_at,
  };
}

const expertSelect = `SELECT
  e.id, e.university_id, u.name AS university_name, u.acronym AS university_acronym,
  e.name, e.title, e.department, e.area, e.specialties, e.summary, e.email, e.phone,
  e.profile_url, e.source_label, e.reference_title, e.reference_url, e.verified_at, e.status,
  e.created_at, e.updated_at, e.updated_by
  FROM experts e INNER JOIN universities u ON u.id = e.university_id`;

export async function getPublicCatalog() {
  await ensureCatalog();
  const d1 = getD1();
  const [universitiesResult, expertsResult] = await Promise.all([
    d1
      .prepare("SELECT * FROM universities WHERE is_active = 1 ORDER BY name")
      .all<UniversityRow>(),
    d1
      .prepare(`${expertSelect} WHERE e.status = 'published' AND u.is_active = 1 ORDER BY e.name`)
      .all<ExpertRow>(),
  ]);

  return {
    universities: universitiesResult.results.map(mapUniversity),
    experts: expertsResult.results.map(mapExpert),
  };
}

export async function getAdminCatalog(): Promise<AdminCatalogPayload> {
  await ensureCatalog();
  const d1 = getD1();
  const [universitiesResult, expertsResult, curatorsResult] = await Promise.all([
    d1.prepare("SELECT * FROM universities ORDER BY is_active DESC, name").all<UniversityRow>(),
    d1.prepare(`${expertSelect} ORDER BY e.updated_at DESC, e.name`).all<ExpertRow>(),
    d1.prepare("SELECT * FROM curators ORDER BY active DESC, name").all<CuratorRow>(),
  ]);

  return {
    universities: universitiesResult.results.map(mapUniversity),
    experts: expertsResult.results.map(mapExpert),
    curators: curatorsResult.results.map(mapCurator),
  };
}

export async function isCurator(email: string) {
  await ensureCatalog();
  const row = await getD1()
    .prepare("SELECT email FROM curators WHERE email = ? AND active = 1")
    .bind(email.trim().toLowerCase())
    .first<{ email: string }>();
  return Boolean(row);
}

export type UniversityInput = Pick<
  University,
  "id" | "name" | "acronym" | "state" | "directoryUrl" | "directoryLabel" | "notes" | "isActive"
>;

export type ExpertInput = Pick<
  Expert,
  | "id"
  | "universityId"
  | "name"
  | "title"
  | "department"
  | "area"
  | "specialties"
  | "summary"
  | "email"
  | "phone"
  | "profileUrl"
  | "sourceLabel"
  | "referenceTitle"
  | "referenceUrl"
  | "verifiedAt"
  | "status"
>;

function cleanText(value: unknown, field: string, required = true) {
  const text = typeof value === "string" ? value.trim() : "";
  if (required && !text) throw new Error(`Preencha ${field}.`);
  return text;
}

function validHttpUrl(value: string, field: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
  } catch {
    throw new Error(`${field} precisa ser uma URL pública válida.`);
  }
}

function stableId(value: string) {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 54);
  return `${base || "registro"}-${crypto.randomUUID().slice(0, 6)}`;
}

export async function saveUniversity(input: UniversityInput) {
  await ensureCatalog();
  const now = new Date().toISOString();
  const id = cleanText(input.id, "o identificador", false) || stableId(input.acronym || input.name);
  const name = cleanText(input.name, "o nome da universidade");
  const acronym = cleanText(input.acronym, "a sigla");
  const state = cleanText(input.state, "o estado");
  const directoryUrl = cleanText(input.directoryUrl, "a URL do diretório");
  validHttpUrl(directoryUrl, "A URL do diretório");

  await getD1()
    .prepare(
      `INSERT INTO universities
        (id, name, acronym, state, directory_url, directory_label, notes, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name, acronym = excluded.acronym, state = excluded.state,
         directory_url = excluded.directory_url, directory_label = excluded.directory_label,
         notes = excluded.notes, is_active = excluded.is_active, updated_at = excluded.updated_at`,
    )
    .bind(
      id,
      name,
      acronym,
      state,
      directoryUrl,
      cleanText(input.directoryLabel, "o nome do diretório"),
      cleanText(input.notes, "as notas", false),
      input.isActive ? 1 : 0,
      now,
      now,
    )
    .run();
  return id;
}

export async function saveExpert(input: ExpertInput, editorEmail: string) {
  await ensureCatalog();
  const now = new Date().toISOString();
  const id = cleanText(input.id, "o identificador", false) || stableId(input.name);
  const status: ExpertStatus = ["draft", "published", "archived"].includes(input.status)
    ? input.status
    : "draft";
  const profileUrl = cleanText(input.profileUrl, "a página oficial", status === "published");
  if (profileUrl) validHttpUrl(profileUrl, "A página oficial");
  const referenceUrl = cleanText(input.referenceUrl, "a reportagem de referência", status === "published");
  if (referenceUrl) validHttpUrl(referenceUrl, "A reportagem de referência");
  const verifiedAt = cleanText(input.verifiedAt, "a data de verificação", status === "published");
  if (verifiedAt && !/^\d{4}-\d{2}-\d{2}$/.test(verifiedAt)) {
    throw new Error("A data de verificação deve estar no formato AAAA-MM-DD.");
  }
  const specialties = Array.isArray(input.specialties)
    ? input.specialties.map((item) => cleanText(item, "a especialidade", false)).filter(Boolean)
    : [];
  if (!specialties.length) throw new Error("Inclua ao menos uma especialidade.");

  await getD1()
    .prepare(
      `INSERT INTO experts
        (id, university_id, name, title, department, area, specialties, summary, email, phone,
         profile_url, source_label, reference_title, reference_url, verified_at, status,
         created_at, updated_at, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         university_id = excluded.university_id, name = excluded.name, title = excluded.title,
         department = excluded.department, area = excluded.area, specialties = excluded.specialties,
         summary = excluded.summary, email = excluded.email, phone = excluded.phone,
         profile_url = excluded.profile_url, source_label = excluded.source_label,
         reference_title = excluded.reference_title, reference_url = excluded.reference_url,
         verified_at = excluded.verified_at, status = excluded.status,
         updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
    )
    .bind(
      id,
      cleanText(input.universityId, "a universidade"),
      cleanText(input.name, "o nome"),
      cleanText(input.title, "o cargo"),
      cleanText(input.department, "o departamento"),
      cleanText(input.area, "a área"),
      JSON.stringify(specialties),
      cleanText(input.summary, "o resumo"),
      cleanText(input.email, "o e-mail", false) || null,
      cleanText(input.phone, "o telefone", false) || null,
      profileUrl,
      cleanText(input.sourceLabel, "o nome da fonte", status === "published"),
      cleanText(input.referenceTitle, "o título da reportagem", status === "published"),
      referenceUrl,
      verifiedAt,
      status,
      now,
      now,
      editorEmail,
    )
    .run();
  return id;
}

export async function archiveExpert(id: string, editorEmail: string) {
  await ensureCatalog();
  await getD1()
    .prepare("UPDATE experts SET status = 'archived', updated_at = ?, updated_by = ? WHERE id = ?")
    .bind(new Date().toISOString(), editorEmail, id)
    .run();
}

export async function saveCurator(input: Pick<Curator, "email" | "name" | "active">) {
  await ensureCatalog();
  const email = cleanText(input.email, "o e-mail").toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Informe um e-mail válido.");
  await getD1()
    .prepare(
      `INSERT INTO curators (email, name, active, created_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET name = excluded.name, active = excluded.active`,
    )
    .bind(email, cleanText(input.name, "o nome"), input.active ? 1 : 0, new Date().toISOString())
    .run();
}

export async function deactivateCurator(email: string, currentEmail: string) {
  await ensureCatalog();
  const normalized = email.trim().toLowerCase();
  if (normalized === currentEmail.trim().toLowerCase()) {
    throw new Error("Você não pode remover o próprio acesso durante esta sessão.");
  }
  await getD1().prepare("UPDATE curators SET active = 0 WHERE email = ?").bind(normalized).run();
}
