"use client";

import { FormEvent, useMemo, useState } from "react";
import type { AdminCatalogPayload, Expert, ExpertStatus, University } from "@/lib/types";
import Link from "next/link";

type Tab = "experts" | "universities" | "access";
type ExpertDraft = Omit<Expert, "universityName" | "universityAcronym" | "createdAt" | "updatedAt" | "updatedBy">;
type UniversityDraft = Omit<University, "createdAt" | "updatedAt">;

const emptyExpert = (universityId: string): ExpertDraft => ({
  id: "",
  universityId,
  name: "",
  title: "",
  department: "",
  area: "",
  specialties: [],
  summary: "",
  email: "",
  phone: "",
  profileUrl: "",
  sourceLabel: "",
  verifiedAt: new Date().toISOString().slice(0, 10),
  status: "draft",
});

const emptyUniversity: UniversityDraft = {
  id: "",
  name: "",
  acronym: "",
  state: "",
  directoryUrl: "",
  directoryLabel: "",
  notes: "",
  isActive: true,
};

export default function CuradoriaClient({
  initialCatalog,
  user,
  signOutPath,
}: {
  initialCatalog: AdminCatalogPayload;
  user: { name: string; email: string };
  signOutPath: string;
}) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [tab, setTab] = useState<Tab>("experts");
  const [search, setSearch] = useState("");
  const [expertDraft, setExpertDraft] = useState<ExpertDraft | null>(null);
  const [universityDraft, setUniversityDraft] = useState<UniversityDraft | null>(null);
  const [specialtiesText, setSpecialtiesText] = useState("");
  const [newCurator, setNewCurator] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredExperts = useMemo(() => {
    const normalized = search.toLowerCase();
    return catalog.experts.filter((expert) =>
      `${expert.name} ${expert.area} ${expert.universityAcronym} ${expert.specialties.join(" ")}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [catalog.experts, search]);

  async function mutate(action: string, payload: unknown, successMessage: string) {
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const result = (await response.json()) as { error?: string; catalog?: AdminCatalogPayload };
      if (!response.ok || !result.catalog) throw new Error(result.error || "Não foi possível salvar.");
      setCatalog(result.catalog);
      setNotice({ type: "success", text: successMessage });
      return true;
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Não foi possível salvar." });
      return false;
    } finally {
      setSaving(false);
    }
  }

  function editExpert(expert: Expert) {
    setExpertDraft({
      id: expert.id,
      universityId: expert.universityId,
      name: expert.name,
      title: expert.title,
      department: expert.department,
      area: expert.area,
      specialties: expert.specialties,
      summary: expert.summary,
      email: expert.email ?? "",
      phone: expert.phone ?? "",
      profileUrl: expert.profileUrl,
      sourceLabel: expert.sourceLabel,
      verifiedAt: expert.verifiedAt,
      status: expert.status,
    });
    setSpecialtiesText(expert.specialties.join(", "));
  }

  async function submitExpert(event: FormEvent) {
    event.preventDefault();
    if (!expertDraft) return;
    const ok = await mutate(
      "saveExpert",
      { ...expertDraft, specialties: specialtiesText.split(",").map((item) => item.trim()).filter(Boolean) },
      expertDraft.id ? "Perfil atualizado." : "Perfil criado.",
    );
    if (ok) setExpertDraft(null);
  }

  function editUniversity(university: University) {
    setUniversityDraft({
      id: university.id,
      name: university.name,
      acronym: university.acronym,
      state: university.state,
      directoryUrl: university.directoryUrl,
      directoryLabel: university.directoryLabel,
      notes: university.notes,
      isActive: university.isActive,
    });
  }

  async function submitUniversity(event: FormEvent) {
    event.preventDefault();
    if (!universityDraft) return;
    const ok = await mutate(
      "saveUniversity",
      universityDraft,
      universityDraft.id ? "Universidade atualizada." : "Universidade adicionada.",
    );
    if (ok) setUniversityDraft(null);
  }

  async function submitCurator(event: FormEvent) {
    event.preventDefault();
    const ok = await mutate("saveCurator", { ...newCurator, active: true }, "Acesso adicionado.");
    if (ok) setNewCurator({ name: "", email: "" });
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link href="/" className="brand">
          <span>F</span><div><b>Fonte Certa</b><small>curadoria</small></div>
        </Link>
        <div className="admin-user"><span><b>{user.name}</b><small>{user.email}</small></span><a href={signOutPath}>Sair</a></div>
      </header>

      <section className="admin-title">
        <div><p className="eyebrow">PAINEL DO GRUPO 3</p><h1>Curadoria da base</h1><p>Edite o que aparece na busca pública e mantenha a origem de cada dado registrada.</p></div>
        <Link href="/" target="_blank">Abrir site público ↗</Link>
      </section>

      <nav className="admin-tabs" aria-label="Seções da curadoria">
        <button className={tab === "experts" ? "active" : ""} onClick={() => setTab("experts")}>Perfis <span>{catalog.experts.length}</span></button>
        <button className={tab === "universities" ? "active" : ""} onClick={() => setTab("universities")}>Universidades <span>{catalog.universities.length}</span></button>
        <button className={tab === "access" ? "active" : ""} onClick={() => setTab("access")}>Acessos <span>{catalog.curators.filter((curator) => curator.active).length}</span></button>
      </nav>

      {notice && <div className={`admin-notice ${notice.type}`} role="status">{notice.text}<button onClick={() => setNotice(null)}>×</button></div>}

      {tab === "experts" && (
        <section className="admin-panel">
          <div className="panel-tools">
            <div><h2>Perfis de especialistas</h2><p>Só perfis publicados aparecem no site.</p></div>
            <label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar na base…" /></label>
            <button className="primary-button" onClick={() => { setExpertDraft(emptyExpert(catalog.universities[0]?.id ?? "")); setSpecialtiesText(""); }}>+ Novo perfil</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Especialista</th><th>Universidade</th><th>Área</th><th>Status</th><th>Verificado</th><th /></tr></thead>
              <tbody>
                {filteredExperts.map((expert) => (
                  <tr key={expert.id}>
                    <td><b>{expert.name}</b><small>{expert.title}</small></td>
                    <td>{expert.universityAcronym}</td>
                    <td>{expert.area}</td>
                    <td><span className={`status-badge ${expert.status}`}>{expert.status === "published" ? "Publicado" : expert.status === "draft" ? "Rascunho" : "Arquivado"}</span></td>
                    <td>{expert.verifiedAt || "—"}</td>
                    <td><button className="text-button" onClick={() => editExpert(expert)}>Editar</button>{expert.status !== "archived" && <button className="text-button danger" onClick={() => { if (confirm(`Arquivar ${expert.name}?`)) void mutate("archiveExpert", { id: expert.id }, "Perfil arquivado."); }}>Arquivar</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "universities" && (
        <section className="admin-panel">
          <div className="panel-tools"><div><h2>Universidades cobertas</h2><p>O grupo pode ampliar ou pausar a lista quando quiser.</p></div><button className="primary-button" onClick={() => setUniversityDraft(emptyUniversity)}>+ Nova universidade</button></div>
          <div className="university-admin-grid">
            {catalog.universities.map((university) => (
              <article key={university.id}>
                <div><span className={`status-dot ${university.isActive ? "active" : ""}`} /><b>{university.acronym}</b><small>{university.state}</small></div>
                <h3>{university.name}</h3><p>{university.notes}</p>
                <a href={university.directoryUrl} target="_blank" rel="noreferrer">{university.directoryLabel} ↗</a>
                <footer><span>{catalog.experts.filter((expert) => expert.universityId === university.id).length} perfis</span><button onClick={() => editUniversity(university)}>Editar</button></footer>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "access" && (
        <section className="admin-panel access-panel">
          <div><h2>Quem pode editar</h2><p>O login confirma a identidade; esta lista autoriza as alterações na base.</p></div>
          <form onSubmit={submitCurator} className="access-form"><label>Nome<input value={newCurator.name} onChange={(event) => setNewCurator({ ...newCurator, name: event.target.value })} required /></label><label>E-mail usado no ChatGPT<input type="email" value={newCurator.email} onChange={(event) => setNewCurator({ ...newCurator, email: event.target.value })} required /></label><button className="primary-button" disabled={saving}>Adicionar acesso</button></form>
          <div className="access-list">
            {catalog.curators.map((curator) => (
              <div key={curator.email} className={!curator.active ? "inactive" : ""}><span className="curator-avatar">{curator.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><p><b>{curator.name}</b><small>{curator.email}</small></p><span className={`status-badge ${curator.active ? "published" : "archived"}`}>{curator.active ? "Ativo" : "Inativo"}</span>{curator.active && curator.email !== user.email && <button className="text-button danger" onClick={() => { if (confirm(`Remover o acesso de ${curator.name}?`)) void mutate("deactivateCurator", { email: curator.email }, "Acesso removido."); }}>Remover</button>}</div>
            ))}
          </div>
        </section>
      )}

      {expertDraft && (
        <div className="modal-backdrop admin-modal-backdrop" onClick={() => setExpertDraft(null)}>
          <form className="edit-modal" onSubmit={submitExpert} onClick={(event) => event.stopPropagation()}>
            <div className="edit-modal-head"><div><p className="eyebrow">PERFIL</p><h2>{expertDraft.id ? "Editar especialista" : "Novo especialista"}</h2></div><button type="button" onClick={() => setExpertDraft(null)}>×</button></div>
            <div className="form-grid">
              <label className="span-2">Nome completo<input value={expertDraft.name} onChange={(event) => setExpertDraft({ ...expertDraft, name: event.target.value })} required /></label>
              <label>Universidade<select value={expertDraft.universityId} onChange={(event) => setExpertDraft({ ...expertDraft, universityId: event.target.value })} required>{catalog.universities.map((university) => <option value={university.id} key={university.id}>{university.acronym}</option>)}</select></label>
              <label>Status<select value={expertDraft.status} onChange={(event) => setExpertDraft({ ...expertDraft, status: event.target.value as ExpertStatus })}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select></label>
              <label>Cargo<input value={expertDraft.title} onChange={(event) => setExpertDraft({ ...expertDraft, title: event.target.value })} required /></label>
              <label>Departamento ou unidade<input value={expertDraft.department} onChange={(event) => setExpertDraft({ ...expertDraft, department: event.target.value })} required /></label>
              <label className="span-2">Área principal<input value={expertDraft.area} onChange={(event) => setExpertDraft({ ...expertDraft, area: event.target.value })} required /></label>
              <label className="span-2">Especialidades, separadas por vírgula<textarea rows={2} value={specialtiesText} onChange={(event) => setSpecialtiesText(event.target.value)} required /></label>
              <label className="span-2">Resumo para jornalistas<textarea rows={3} value={expertDraft.summary} onChange={(event) => setExpertDraft({ ...expertDraft, summary: event.target.value })} required /></label>
              <label>E-mail profissional<input type="email" value={expertDraft.email ?? ""} onChange={(event) => setExpertDraft({ ...expertDraft, email: event.target.value })} /></label>
              <label>Telefone público<input value={expertDraft.phone ?? ""} onChange={(event) => setExpertDraft({ ...expertDraft, phone: event.target.value })} /></label>
              <label className="span-2">Página oficial<input type="url" value={expertDraft.profileUrl} onChange={(event) => setExpertDraft({ ...expertDraft, profileUrl: event.target.value })} required={expertDraft.status === "published"} /></label>
              <label>Nome da fonte<input value={expertDraft.sourceLabel} onChange={(event) => setExpertDraft({ ...expertDraft, sourceLabel: event.target.value })} required={expertDraft.status === "published"} /></label>
              <label>Data de verificação<input type="date" value={expertDraft.verifiedAt} onChange={(event) => setExpertDraft({ ...expertDraft, verifiedAt: event.target.value })} required={expertDraft.status === "published"} /></label>
            </div>
            <div className="edit-actions"><button type="button" onClick={() => setExpertDraft(null)}>Cancelar</button><button className="primary-button" disabled={saving}>{saving ? "Salvando…" : "Salvar perfil"}</button></div>
          </form>
        </div>
      )}

      {universityDraft && (
        <div className="modal-backdrop admin-modal-backdrop" onClick={() => setUniversityDraft(null)}>
          <form className="edit-modal university-edit-modal" onSubmit={submitUniversity} onClick={(event) => event.stopPropagation()}>
            <div className="edit-modal-head"><div><p className="eyebrow">UNIVERSIDADE</p><h2>{universityDraft.id ? "Editar universidade" : "Nova universidade"}</h2></div><button type="button" onClick={() => setUniversityDraft(null)}>×</button></div>
            <div className="form-grid">
              <label className="span-2">Nome oficial<input value={universityDraft.name} onChange={(event) => setUniversityDraft({ ...universityDraft, name: event.target.value })} required /></label>
              <label>Sigla<input value={universityDraft.acronym} onChange={(event) => setUniversityDraft({ ...universityDraft, acronym: event.target.value })} required /></label>
              <label>UF<input maxLength={2} value={universityDraft.state} onChange={(event) => setUniversityDraft({ ...universityDraft, state: event.target.value.toUpperCase() })} required /></label>
              <label className="span-2">URL do diretório<input type="url" value={universityDraft.directoryUrl} onChange={(event) => setUniversityDraft({ ...universityDraft, directoryUrl: event.target.value })} required /></label>
              <label className="span-2">Nome do diretório<input value={universityDraft.directoryLabel} onChange={(event) => setUniversityDraft({ ...universityDraft, directoryLabel: event.target.value })} required /></label>
              <label className="span-2">Notas sobre disponibilidade<textarea rows={3} value={universityDraft.notes} onChange={(event) => setUniversityDraft({ ...universityDraft, notes: event.target.value })} /></label>
              <label className="checkbox-label"><input type="checkbox" checked={universityDraft.isActive} onChange={(event) => setUniversityDraft({ ...universityDraft, isActive: event.target.checked })} />Exibir universidade na busca pública</label>
            </div>
            <div className="edit-actions"><button type="button" onClick={() => setUniversityDraft(null)}>Cancelar</button><button className="primary-button" disabled={saving}>{saving ? "Salvando…" : "Salvar universidade"}</button></div>
          </form>
        </div>
      )}
    </main>
  );
}
