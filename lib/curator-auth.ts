import { getChatGPTUser, requireChatGPTUser } from "@/app/chatgpt-auth";
import { isCurator } from "@/lib/catalog";

export async function getAuthorizedCurator() {
  const user = await getChatGPTUser();
  if (!user) return { user: null, authorized: false } as const;
  return { user, authorized: await isCurator(user.email) } as const;
}

export async function requireCurator(returnTo: string) {
  const user = await requireChatGPTUser(returnTo);
  return { user, authorized: await isCurator(user.email) };
}
