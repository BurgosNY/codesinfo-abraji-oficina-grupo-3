import { chatGPTSignOutPath } from "@/app/chatgpt-auth";
import CuradoriaClient from "@/app/curadoria/curadoria-client";
import { getAdminCatalog } from "@/lib/catalog";
import { requireCurator } from "@/lib/curator-auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CuradoriaPage() {
  const { user, authorized } = await requireCurator("/curadoria");

  if (!authorized) {
    return (
      <main className="access-page">
        <Link href="/" className="brand">
          <span>F</span><div><b>Fonte Certa</b><small>curadoria</small></div>
        </Link>
        <section>
          <p className="eyebrow">ACESSO RESTRITO</p>
          <h1>Este e-mail ainda não é curador.</h1>
          <p>Você entrou como <b>{user.email}</b>. Peça a alguém do Grupo 3 para adicionar esse endereço na aba “Acessos”.</p>
          <div><Link href="/">Voltar ao site</Link><a href={chatGPTSignOutPath("/curadoria")}>Entrar com outro e-mail</a></div>
        </section>
      </main>
    );
  }

  const catalog = await getAdminCatalog();
  return (
    <CuradoriaClient
      initialCatalog={catalog}
      user={{ name: user.displayName, email: user.email }}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}
