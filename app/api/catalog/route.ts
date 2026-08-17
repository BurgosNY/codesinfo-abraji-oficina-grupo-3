import { getPublicCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await getPublicCatalog(), {
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("catalog:get", error);
    return Response.json({ error: "Não foi possível carregar a base agora." }, { status: 500 });
  }
}
