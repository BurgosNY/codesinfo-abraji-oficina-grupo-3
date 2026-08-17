import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders the public Fonte Certa experience", async () => {
  const [layout, page, client] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/catalog-client.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /title: "Fonte Certa — fontes acadêmicas para jornalistas"/i);
  assert.match(page, /<CatalogClient \/>/);
  assert.match(client, /SOMENTE PESSOAS REAIS/);
  assert.match(client, /Boas fontes para começar/);
  assert.match(client, /RESULTADOS VERIFICÁVEIS/);
  assert.doesNotMatch(client, /DEMONSTRAÇÃO FICTÍCIA ORIGINAL/);
  assert.match(client, /href="\/curadoria"/);
  assert.doesNotMatch(client, /experiência futura do bot no Slack/i);
});

test("contains only real, officially sourced profiles", async () => {
  const [seed, client] = await Promise.all([
    readFile(new URL("../lib/seed-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/catalog-client.tsx", import.meta.url), "utf8"),
  ]);

  assert.equal((seed.match(/updatedBy: "base-inicial"/g) ?? []).length, 15);
  assert.match(seed, /id: "ufmg"/);
  assert.match(seed, /id: "unicamp"/);
  assert.match(seed, /id: "usp"/);
  assert.match(seed, /profileUrl: "https:\/\//);
  assert.doesNotMatch(seed, /\.invalid/);
  assert.doesNotMatch(seed, /cunhae@ufmg\.br|deborah@enf\.ufmg\.br|meira@dcc\.ufmg\.br|deisy\.ventura@usp\.br/);

  assert.doesNotMatch(client, /Ana Ribeiro|João Mendonça|Lívia Santos|Renata Freire/);
  assert.doesNotMatch(client, /\.invalid|FICTÍCIO|FICTÍCIA|simulado/i);
  assert.match(client, /PERFIL REAL · FONTE OFICIAL/);
});

test("protects curation writes with sign-in and an explicit curator allowlist", async () => {
  const [page, route, auth, schema] = await Promise.all([
    readFile(new URL("../app/curadoria/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/catalog/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/curator-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /requireCurator\("\/curadoria"\)/);
  assert.match(route, /getAuthorizedCurator/);
  assert.match(auth, /isCurator\(user\.email\)/);
  assert.match(schema, /export const curators/);
  assert.match(schema, /export const universities/);
  assert.match(schema, /export const experts/);
});
