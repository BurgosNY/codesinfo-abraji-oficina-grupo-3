import type { Expert } from "@/lib/types";

const stopWords = new Set([
  "a", "ao", "aos", "as", "com", "como", "da", "das", "de", "do", "dos", "e", "em", "especialista",
  "especialistas", "fonte", "fontes", "na", "nas", "no", "nos", "o", "os", "para", "por", "professor",
  "professora", "quem", "sobre", "um", "uma",
]);

export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function queryTokens(value: string) {
  return normalize(value)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

export function rankExperts(experts: Expert[], query: string, universityId = "all") {
  const tokens = queryTokens(query);
  const normalizedQuery = normalize(query);

  return experts
    .filter((expert) => universityId === "all" || expert.universityId === universityId)
    .map((expert) => {
      const name = normalize(expert.name);
      const area = normalize(expert.area);
      const specialties = normalize(expert.specialties.join(" "));
      const summary = normalize(expert.summary);
      const reference = normalize(expert.referenceTitle);
      const institution = normalize(`${expert.universityName} ${expert.universityAcronym} ${expert.department}`);
      let score = 0;

      for (const token of tokens) {
        if (name.includes(token)) score += 9;
        if (specialties.includes(token)) score += 7;
        if (area.includes(token)) score += 5;
        if (summary.includes(token)) score += 3;
        if (reference.includes(token)) score += 2;
        if (institution.includes(token)) score += 2;
      }
      if (normalizedQuery && specialties.includes(normalizedQuery)) score += 12;
      if (normalizedQuery && area.includes(normalizedQuery)) score += 8;

      return { expert, score };
    })
    .filter(({ score }) => !tokens.length || score > 0)
    .sort((a, b) => b.score - a.score || a.expert.name.localeCompare(b.expert.name, "pt-BR"));
}
