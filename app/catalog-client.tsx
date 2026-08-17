"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { rankExperts } from "@/lib/search";
import type { CatalogPayload, Expert } from "@/lib/types";

type DemoExpert = {
  name: string;
  institution: string;
  area: string;
  topics: string[];
  why: string;
  email: string;
};

const demoExperts: Record<string, DemoExpert[]> = {
  desinformacao: [
    {
      name: "Ana Ribeiro",
      institution: "Universidade Federal Demonstrativa",
      area: "Comunicação e política",
      topics: ["desinformação", "plataformas digitais", "eleições"],
      why: "Pesquisa diretamente circulação de conteúdo enganoso e moderação de plataformas.",
      email: "ana.ribeiro@universidade-exemplo.invalid",
    },
    {
      name: "João Mendonça",
      institution: "Universidade Estadual de Exemplo",
      area: "Ciência da computação",
      topics: ["detecção automática", "redes sociais", "IA responsável"],
      why: "Atua em métodos computacionais para identificar padrões de propagação.",
      email: "joao.mendonca@universidade-exemplo.invalid",
    },
    {
      name: "Lívia Santos",
      institution: "Instituto Público Fictício",
      area: "Saúde coletiva",
      topics: ["desinformação em saúde", "vacinas", "comunicação de risco"],
      why: "Especialização adequada quando a pauta envolve saúde pública.",
      email: "livia.santos@instituto-exemplo.invalid",
    },
  ],
  clima: [
    {
      name: "Carlos Azevedo",
      institution: "Universidade Federal Demonstrativa",
      area: "Climatologia",
      topics: ["eventos extremos", "mudança climática", "modelagem"],
      why: "Aderência direta a eventos extremos e comunicação de incerteza climática.",
      email: "carlos.azevedo@universidade-exemplo.invalid",
    },
    {
      name: "Beatriz Lima",
      institution: "Universidade Estadual de Exemplo",
      area: "Planejamento urbano",
      topics: ["adaptação", "risco urbano", "políticas públicas"],
      why: "Pode contextualizar impactos e respostas de cidades a extremos.",
      email: "beatriz.lima@universidade-exemplo.invalid",
    },
  ],
  inteligencia: [
    {
      name: "João Mendonça",
      institution: "Universidade Estadual de Exemplo",
      area: "Ciência da computação",
      topics: ["inteligência artificial", "auditoria algorítmica", "IA responsável"],
      why: "Pesquisa avaliação e governança de sistemas algorítmicos.",
      email: "joao.mendonca@universidade-exemplo.invalid",
    },
    {
      name: "Renata Freire",
      institution: "Universidade Pública Piloto",
      area: "Direito digital",
      topics: ["regulação de IA", "direitos digitais", "proteção de dados"],
      why: "Contribui com perspectiva regulatória e de direitos.",
      email: "renata.freire@universidade-exemplo.invalid",
    },
  ],
};

const suggestedQueries = [
  "desinformação em plataformas digitais",
  "mudanças climáticas e Amazônia",
  "regulação de inteligência artificial",
  "indicadores de políticas públicas",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${value}T12:00:00`),
  );
}

function demoCategory(query: string) {
  const normalized = query.toLowerCase();
  if (normalized.includes("clima") || normalized.includes("enchente")) return "clima";
  if (normalized.includes("ia") || normalized.includes("inteligência") || normalized.includes("algorit")) {
    return "inteligencia";
  }
  return "desinformacao";
}

export default function CatalogClient() {
  const [catalog, setCatalog] = useState<CatalogPayload | null>(null);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("desinformação");
  const [submittedQuery, setSubmittedQuery] = useState("desinformação");
  const [universityId, setUniversityId] = useState("all");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [demoQuery, setDemoQuery] = useState("quem pesquisa desinformação?");
  const [selectedDemo, setSelectedDemo] = useState<DemoExpert | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/catalog")
      .then(async (response) => {
        const payload = (await response.json()) as CatalogPayload & { error?: string };
        if (!response.ok) throw new Error(payload.error || "Falha ao carregar a base.");
        if (active) setCatalog(payload);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : "Falha ao carregar a base.");
      });
    return () => {
      active = false;
    };
  }, []);

  const ranked = useMemo(
    () => (catalog ? rankExperts(catalog.experts, submittedQuery, universityId) : []),
    [catalog, submittedQuery, universityId],
  );
  const visibleResults = showAll ? ranked : ranked.slice(0, 8);
  const currentDemo = demoExperts[demoCategory(demoQuery)];

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
    setShowAll(false);
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function applySuggestion(value: string) {
    setQuery(value);
    setSubmittedQuery(value);
    setShowAll(false);
  }

  return (
    <main>
      <div className="pilot-bar">
        <b>BASE-PILOTO CURADA</b>
        <span>15 perfis reais · 3 universidades · cada resultado aponta para uma fonte oficial</span>
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
          <a href="#demonstracao">Demonstração</a>
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
            Pesquise por tema, área ou nome e encontre docentes de universidades públicas com vínculo e página
            institucional conferíveis.
          </p>
          <form className="search-box" onSubmit={submitSearch}>
            <label htmlFor="main-search">Qual é o tema da sua pauta?</label>
            <div className="search-row">
              <input
                id="main-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ex.: desinformação, clima, saúde pública…"
              />
              <button type="submit">Buscar fontes</button>
            </div>
            <select
              aria-label="Filtrar por universidade"
              value={universityId}
              onChange={(event) => setUniversityId(event.target.value)}
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
          <strong>{catalog?.experts.length ?? 15}</strong>
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
          {catalog && <span>{ranked.length} correspondência{ranked.length === 1 ? "" : "s"}</span>}
        </div>

        {!catalog && !loadError && (
          <div className="loading-state">
            <i />
            <p>Consultando a base curada…</p>
          </div>
        )}
        {loadError && (
          <div className="empty-state">
            <b>A base não respondeu agora.</b>
            <p>{loadError}</p>
            <button onClick={() => location.reload()}>Tentar novamente</button>
          </div>
        )}
        {catalog && ranked.length === 0 && (
          <div className="empty-state">
            <b>Nenhuma correspondência neste lote.</b>
            <p>A base ainda é pequena. Tente um tema mais amplo ou consulte todas as universidades.</p>
            <button onClick={() => applySuggestion("inteligência artificial")}>Usar uma sugestão</button>
          </div>
        )}
        {catalog && ranked.length > 0 && (
          <div className="expert-grid">
            {visibleResults.map(({ expert, score }) => (
              <article className="expert-card" key={expert.id}>
                <div className="expert-card-top">
                  <span className="university-pill">{expert.universityAcronym}</span>
                  <span className="match-label">{Math.min(99, 62 + score)}% aderência lexical</span>
                </div>
                <h3>{expert.name}</h3>
                <p className="expert-role">{expert.title} · {expert.department}</p>
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
                <button className="card-action" onClick={() => setSelectedExpert(expert)}>
                  Ver perfil e contato <span>→</span>
                </button>
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
          <li><span>02</span><div><b>Curadoria rastreável</b><p>Cada perfil registra sua fonte e a data da última verificação.</p></div></li>
          <li><span>03</span><div><b>Contato fora da plataforma</b><p>O site localiza e exibe; nunca aborda a fonte automaticamente.</p></div></li>
        </ol>
      </section>

      <section className="demo-section" id="demonstracao">
        <div className="demo-copy">
          <span className="demo-label">DEMONSTRAÇÃO FICTÍCIA ORIGINAL</span>
          <h2>O primeiro protótipo continua aqui.</h2>
          <p>
            Estes nomes foram criados para explicar a ideia na oficina. Eles ficam isolados da busca real e nenhum
            contato abaixo deve ser usado.
          </p>
          <div className="demo-buttons">
            {[
              ["desinformação", "quem pesquisa desinformação?"],
              ["mudança climática", "quem pesquisa mudança climática?"],
              ["inteligência artificial", "fontes sobre inteligência artificial"],
            ].map(([label, value]) => (
              <button className={demoCategory(demoQuery) === demoCategory(value) ? "active" : ""} key={label} onClick={() => setDemoQuery(value)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="demo-window">
          <div className="demo-window-head"><b>Resultado simulado</b><span>dados fictícios</span></div>
          {currentDemo.map((expert) => (
            <button key={`${demoCategory(demoQuery)}-${expert.name}`} onClick={() => setSelectedDemo(expert)}>
              <span className="fake-avatar">{expert.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
              <div><b>{expert.name}</b><small>{expert.institution} · {expert.area}</small><p>{expert.why}</p></div>
              <i>→</i>
            </button>
          ))}
        </div>
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
            </dl>
            <a className="official-link" href={selectedExpert.profileUrl} target="_blank" rel="noreferrer">Abrir página oficial ↗</a>
            <p className="editorial-note">Confira o vínculo e a adequação à pauta antes de fazer contato.</p>
          </article>
        </div>
      )}

      {selectedDemo && (
        <div className="modal-backdrop" onClick={() => setSelectedDemo(null)}>
          <article className="modal demo-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Exemplo fictício de ${selectedDemo.name}`}>
            <button className="close" onClick={() => setSelectedDemo(null)} aria-label="Fechar">×</button>
            <span className="fake-label">PERFIL FICTÍCIO · DEMONSTRAÇÃO</span>
            <h2>{selectedDemo.name}</h2>
            <p className="modal-role">{selectedDemo.institution}<br />{selectedDemo.area}</p>
            <h3>Por que apareceu</h3><p>{selectedDemo.why}</p>
            <h3>Temas</h3><div className="tags">{selectedDemo.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
            <dl><div><dt>Contato simulado</dt><dd>{selectedDemo.email}</dd></div></dl>
            <div className="warning"><b>Não use este contato</b><p>O domínio .invalid confirma que o registro não pertence a uma pessoa real.</p></div>
          </article>
        </div>
      )}
    </main>
  );
}
