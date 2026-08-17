import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const universities = sqliteTable("universities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  acronym: text("acronym").notNull(),
  state: text("state").notNull(),
  directoryUrl: text("directory_url").notNull(),
  directoryLabel: text("directory_label").notNull(),
  notes: text("notes").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const experts = sqliteTable(
  "experts",
  {
    id: text("id").primaryKey(),
    universityId: text("university_id")
      .notNull()
      .references(() => universities.id),
    name: text("name").notNull(),
    title: text("title").notNull(),
    department: text("department").notNull(),
    area: text("area").notNull(),
    specialties: text("specialties").notNull(),
    summary: text("summary").notNull(),
    email: text("email"),
    phone: text("phone"),
    profileUrl: text("profile_url").notNull(),
    sourceLabel: text("source_label").notNull(),
    verifiedAt: text("verified_at").notNull(),
    status: text("status", { enum: ["draft", "published", "archived"] }).notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    updatedBy: text("updated_by").notNull(),
  },
  (table) => [
    index("experts_status_idx").on(table.status),
    index("experts_university_idx").on(table.universityId),
    index("experts_name_idx").on(table.name),
  ],
);

export const curators = sqliteTable("curators", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  active: integer("active", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull(),
});
