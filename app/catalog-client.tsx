"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { rankExperts } from "@/lib/search";
import type { CatalogPayload, Expert, ExpertMatch, MatchLevel, MatchPayload } from "@/lib/types";

const suggestedQueries = [
  "checagem de fake news em eleições",
  "deepfakes e conteúdo sintético",
  "desinformação sobre vacinas",
  "como avaliar uma fonte de informação",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function levelLabel(level: MatchLevel) {
  if (level === "alta") return "Alta aderência";
  if (level === "media") return "Média aderência";
  return "Hipótese exploratória";
}

async function fetchMatches(query: string, universityId: string) {
  const response = await fetch("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, universityId }),
  });
  const payload = (await response.json()) as MatchPayload & { error?: string };
  if (!response.ok) throw new Error(payload.error || "Falha ao comparar as fontes.");
  return payload;
}

export default function CatalogClient() {
  const [catalog, setCatalog] = useState<CatalogPayload | null>(null);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("desinformação");
  const [submittedQuery, setSubmittedQuery] = useState("desinformação");
  const [universityId, setUniversityId] = useState("all");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [matchPayload, setMatchPayload] = useState<MatchPayload | null>(null);
  const [matchError, setMatchError] = useState("");
  const [isMatching, setIsMatching] = useState(true);
  const matchRequest = useRef(0);

  useEffect(() => {
    let active = true;
    async function loadCatalogAndInitialMatch() {
      try {
        const response = await fetch("/api/catalog");
        const payload = (await response.json()) as CatalogPayload & { error?: string };
        if (!response.ok) throw new Error(payload.error || "Falha ao carregar a base.");
        if (!active) return;
        setCatalog(payload);
      } catch (error) {
        if (active) {
          setLoadError(error instanceof Error ? error.message : "Falha ao carregar a base.");
          setIsMatching(false);
        }
        return;
      }

      const requestId = ++matchRequest.current;
      try {
        const initialMatch = await fetchMatches("desinformação", "all");
        if (active && matchRequest.current === requestId) setMatchPayload(initialMatch);
      } catch (error) {
        if (active && matchRequest.current === requestId) {
          setMatchError(error instanceof Error ? error.message : "O motor semântico não respondeu.");
        }
      } finally {
        if (active && matchRequest.current === requestId) setIsMatching(false);
      }
    }

    void loadCatalogAndInitialMatch();
    return () => {
      active = false;
    };
  }, []);

  const ranked = useMemo(() => {
    if (!catalog) return [];
    const expertsById = new Map(catalog.experts.map((expert) => [expert.id, expert]));
    const payloadIsCurrent =
      matchPayload?.query === submittedQuery && matchPayload.universityId === universityId;

    if (payloadIsCurrent) {
      return matchPayload.matches.flatMap((match) => {
        const expert = expertsById.get(match.expertId);
        return expert ? [{ expert, match }] : [];
      });
    }

    if (matchError) {
      return rankExperts(catalog.experts, submittedQuery, universityId)
        .slice(0, 10)
        .map(({ expert, score }) => ({
          expert,
          match: {
            expertId: expert.id,
            level: score >= 20 ? "alta" : score >= 10 ? "media" : "exploratoria",
            rationale: "Correspondência encontrada pelas palavras presentes no perfil.",
            signals: expert.specialties.slice(0, 3),
          } satisfies ExpertMatch,
        }));
    }

    return [];
  }, [catalog, matchError, matchPayload, submittedQuery, universityId]);
  const visibleResults = showAll ? ranked : ranked.slice(0, 8);

  async function runMatch(nextQuery: string, nextUniversityId: string) {
    const requestId = ++matchRequest.current;
    setIsMatching(true);
    setMatchError("");
    setMatchPayload(null);
    try {
      const payload = await fetchMatches(nextQuery, nextUniversityId);
      if (matchRequest.current === requestId) setMatchPayload(payload);
    } catch (error) {
      if (matchRequest.current === requestId) {
        setMatchError(error instanceof Error ? error.message : "O motor semântico não respondeu.");
      }
    } finally {
      if (matchRequest.current === requestId) setIsMatching(false);
    }
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const nextQuery = query.trim();
    setSubmittedQuery(nextQuery);
    setShowAll(false);
    void runMatch(nextQuery, universityId);
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function applySuggestion(value: string) {
    setQuery(value);
    setSubmittedQuery(value);
    setShowAll(false);
    void runMatch(value, universityId);
  }

  function changeUniversity(nextUniversityId: string) {
    setUniversityId(nextUniversityId);
    setShowAll(false);
    void runMatch(submittedQuery, nextUniversityId);
  }

  return (
    <main>
      <div className="pilot-bar">
        <b>30 FONTES REAIS · UM TEMA</b>
        <span>checagem, fake news e desinformação · 10 fontes por universidade · vínculo comprovado</span>
      </div>

      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Fonte Certa — início">
          <span>F</span>
          <div>
            <b>Fonte Certa</b>
            <small>fontes acadêmicas para jornalistas</small>
          </div>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a className="curation-link" href="/curadoria">Curadoria ↗</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">FONTES ACADÊMICAS PARA JORNALISTAS</p>
          <h1>
            Uma pauta na mão.<br />
            <em>Boas fontes para começar.</em>
          </h1>
          <p className="hero-intro">
            Encontre pessoas reais para verificar alegações, investigar desinformação e decidir se um conteúdo é
            confiável. Cada perfil combina vínculo institucional e uma reportagem de referência.
          </p>
          <form className="search-box" onSubmit={submitSearch}>
            <label htmlFor="main-search">Qual é o tema da sua pauta?</label>
            <div className="search-row">
              <input
                id="main-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ex.: deepfake, vacina, eleição, fonte confiável…"
              />
              <button type="submit">Buscar fontes</button>
            </div>
            <select
              aria-label="Filtrar por universidade"
              value={universityId}
              onChange={(event) => changeUniversity(event.target.value)}
            >
              <option value="all">Todas as universidades</option>
              {catalog?.universities.map((university) => (
                <option value={university.id} key={university.id}>
                  {university.acronym} · {university.state}
                </option>
              ))}
            </select>
          </form>
          <div className="query-suggestions" aria-label="Sugestões de busca">
            <span>Tente:</span>
            {suggestedQueries.map((suggestion) => (
              <button key={suggestion} onClick={() => applySuggestion(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <aside className="coverage-card">
          <span className="live-dot" />
          <p className="eyebrow">COBERTURA INICIAL</p>
          <strong>{catalog?.experts.length ?? 30}</strong>
          <span>perfis publicados</span>
          <div className="coverage-universities">
            {(catalog?.universities ?? []).map((university) => (
              <a key={university.id} href={university.directoryUrl} target="_blank" rel="noreferrer">
                <b>{university.acronym}</b>
                <span>{university.directoryLabel}</span>
                <i>↗</i>
              </a>
            ))}
            {!catalog && !loadError && <p>Carregando diretórios…</p>}
          </div>
          <small>Escolhidas pela disponibilidade de diretórios públicos estruturados.</small>
        </aside>
      </section>

      <section className="results-section" id="resultados" aria-live="polite">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RESULTADOS VERIFICÁVEIS</p>
            <h2>{submittedQuery ? `Fontes para “${submittedQuery}”` : "Todos os perfis"}</h2>
          </div>
          {catalog && !isMatching && <span>{ranked.length} fonte{ranked.length === 1 ? "" : "s"} sugerida{ranked.length === 1 ? "" : "s"}</span>}
        </div>

        {catalog && !isMatching && (matchPayload || matchError) && (
          <div className={`match-engine ${matchPayload?.engine === "gpt-5.6-luna" ? "is-semantic" : "is-fallback"}`}>
            <div>
              <b>{matchPayload?.engine === "gpt-5.6-luna" ? "MATCH SEMÂNTICO · GPT-5.6 LUNA" : "FALLBACK · PALAVRAS-CHAVE"}</b>
              <p>{matchPayload?.warning || matchPayload?.queryUnderstanding || "A comparação semântica não respondeu; exibindo a busca lexical."}</p>
            </div>
            {matchPayload && <small>{(matchPayload.latencyMs / 1000).toFixed(1)}s · catálogo fechado</small>}
          </div>
        )}

        {(!catalog || isMatching) && !loadError && (
          <div className="loading-state">
            <i />
            <p>{catalog ? "Luna está comparando a pauta com os 30 perfis…" : "Consultando a base curada…"}</p>
          </div>
        )}
        {loadError && (
          <div className="empty-state">
            <b>A base não respondeu agora.</b>
            <p>{loadError}</p>
            <button onClick={() => location.reload()}>Tentar novamente</button>
          </div>
        )}
        {catalog && !isMatching && ranked.length === 0 && (
          <div className="empty-state">
            <b>Nenhuma correspondência neste lote.</b>
            <p>Tente uma etapa da checagem, um formato de conteúdo ou o assunto da alegação.</p>
            <button onClick={() => applySuggestion("fake news")}>Buscar por fake news</button>
          </div>
        )}
        {catalog && !isMatching && ranked.length > 0 && (
          <div className="expert-grid">
            {visibleResults.map(({ expert, match }) => (
              <article className="expert-card" key={expert.id}>
                <div className="expert-card-top">
                  <span className="university-pill">{expert.universityAcronym}</span>
                  <span className={`match-label level-${match.level}`}>
                    {levelLabel(match.level)}{matchPayload?.engine === "gpt-5.6-luna" ? " · Luna" : " · lexical"}
                  </span>
                </div>
                <h3>{expert.name}</h3>
                <p className="expert-role">{expert.title} · {expert.department}</p>
                <p className="match-reason"><b>Por que apareceu:</b> {match.rationale}</p>
                <p className="expert-summary">{expert.summary}</p>
                <div className="tags">
                  {expert.specialties.slice(0, 4).map((specialty) => (
                    <span key={specialty}>{specialty}</span>
                  ))}
                </div>
                <div className="source-line">
                  <span>✓</span>
                  <p>Fonte oficial verificada em <b>{formatDate(expert.verifiedAt)}</b></p>
                </div>
                <div className="card-actions">
                  <button className="card-action" onClick={() => setSelectedExpert(expert)}>
                    Ver perfil e referências <span>→</span>
                  </button>
                  <a href={expert.referenceUrl} target="_blank" rel="noreferrer">
                    Ler reportagem de referência ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
        {!showAll && ranked.length > 8 && (
          <button className="show-more" onClick={() => setShowAll(true)}>
            Mostrar todos os {ranked.length} resultados
          </button>
        )}
      </section>

      <section className="method-section" id="como-funciona">
        <div>
          <p className="eyebrow">COMO FUNCIONA</p>
          <h2>Uma busca simples, com lastro editorial.</h2>
          <p>
            A ferramenta ajuda a descobrir nomes. A decisão de pauta e a conferência final continuam com a pessoa
            jornalista.
          </p>
        </div>
        <ol>
          <li><span>01</span><div><b>Diretórios oficiais</b><p>A base parte de páginas públicas das próprias universidades.</p></div></li>
          <li><span>02</span><div><b>Reportagem de referência</b><p>Os nomes foram encontrados em cobertura jornalística sobre desinformação e checagem.</p></div></li>
          <li><span>03</span><div><b>Contato fora da plataforma</b><p>O site localiza e exibe; nunca aborda a fonte automaticamente.</p></div></li>
        </ol>
      </section>

      <footer>
        <div><b>Fonte Certa</b><span>Projeto do Grupo 3 · Oficina Abraji</span></div>
        <p>Base inicial verificável, pronta para ser ampliada pela curadoria do grupo.</p>
        <a href="/curadoria">Acessar curadoria ↗</a>
      </footer>

      {selectedExpert && (
        <div className="modal-backdrop" onClick={() => setSelectedExpert(null)}>
          <article className="modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Perfil de ${selectedExpert.name}`}>
            <button className="close" onClick={() => setSelectedExpert(null)} aria-label="Fechar">×</button>
            <span className="verified-label">✓ PERFIL REAL · FONTE OFICIAL</span>
            <h2>{selectedExpert.name}</h2>
            <p className="modal-role">{selectedExpert.title} · {selectedExpert.universityName}<br />{selectedExpert.department}</p>
            <h3>Por que pode ajudar</h3>
            <p>{selectedExpert.summary}</p>
            <h3>Especialidades</h3>
            <div className="tags">{selectedExpert.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}</div>
            <dl>
              {selectedExpert.email && <div><dt>E-mail profissional</dt><dd><a href={`mailto:${selectedExpert.email}`}>{selectedExpert.email}</a></dd></div>}
              {selectedExpert.phone && <div><dt>Telefone público</dt><dd><a href={`tel:${selectedExpert.phone}`}>{selectedExpert.phone}</a></dd></div>}
              <div><dt>Última verificação</dt><dd>{formatDate(selectedExpert.verifiedAt)}</dd></div>
              <div><dt>Origem</dt><dd>{selectedExpert.sourceLabel}</dd></div>
              <div><dt>Reportagem de referência</dt><dd><a href={selectedExpert.referenceUrl} target="_blank" rel="noreferrer">{selectedExpert.referenceTitle} ↗</a></dd></div>
            </dl>
            <a className="official-link" href={selectedExpert.profileUrl} target="_blank" rel="noreferrer">Abrir página oficial ↗</a>
            <p className="editorial-note">Confira o vínculo e a adequação à pauta antes de fazer contato.</p>
          </article>
        </div>
      )}
    </main>
  );
}
