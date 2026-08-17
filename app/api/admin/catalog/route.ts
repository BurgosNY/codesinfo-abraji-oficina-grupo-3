import {
  archiveExpert,
  deactivateCurator,
  getAdminCatalog,
  saveCurator,
  saveExpert,
  saveUniversity,
  type ExpertInput,
  type UniversityInput,
} from "@/lib/catalog";
import { getAuthorizedCurator } from "@/lib/curator-auth";
import type { Curator } from "@/lib/types";

export const dynamic = "force-dynamic";

async function authorize() {
  const auth = await getAuthorizedCurator();
  if (!auth.user) return { response: Response.json({ error: "Faça login para continuar." }, { status: 401 }) };
  if (!auth.authorized) {
    return { response: Response.json({ error: "Seu e-mail não está na lista de curadores." }, { status: 403 }) };
  }
  return { user: auth.user };
}

export async function GET() {
  const auth = await authorize();
  if ("response" in auth) return auth.response;
  try {
    return Response.json(await getAdminCatalog());
  } catch (error) {
    console.error("admin:catalog:get", error);
    return Response.json({ error: "Não foi possível carregar a curadoria." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await authorize();
  if ("response" in auth) return auth.response;

  try {
    const body = (await request.json()) as { action?: string; payload?: unknown };
    switch (body.action) {
      case "saveExpert":
        await saveExpert(body.payload as ExpertInput, auth.user.email);
        break;
      case "archiveExpert": {
        const payload = body.payload as { id?: string };
        if (!payload.id) throw new Error("Perfil não identificado.");
        await archiveExpert(payload.id, auth.user.email);
        break;
      }
      case "saveUniversity":
        await saveUniversity(body.payload as UniversityInput);
        break;
      case "saveCurator":
        await saveCurator(body.payload as Pick<Curator, "email" | "name" | "active">);
        break;
      case "deactivateCurator": {
        const payload = body.payload as { email?: string };
        if (!payload.email) throw new Error("Curador não identificado.");
        await deactivateCurator(payload.email, auth.user.email);
        break;
      }
      default:
        return Response.json({ error: "Ação de curadoria desconhecida." }, { status: 400 });
    }
    return Response.json({ ok: true, catalog: await getAdminCatalog() });
  } catch (error) {
    console.error("admin:catalog:post", error);
    const message = error instanceof Error ? error.message : "Não foi possível salvar a alteração.";
    return Response.json({ error: message }, { status: 400 });
  }
}
