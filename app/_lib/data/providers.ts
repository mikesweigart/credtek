// Provider reads/writes for the real app. All RLS-scoped to the
// signed-in user's tenant by the cookie-bound Supabase client.

import { createSupabaseServerClient } from "../supabase/serverClient";

export type DbProvider = {
  id: string;
  slug: string;
  name: string;
  credential: string | null;
  npi: string | null;
  status: "active" | "enrolling" | "supervision" | "flag";
  status_label: string | null;
  specialty: string | null;
  license_states: string[];
  meta: string | null;
  created_at: string;
};

export async function listProviders(): Promise<DbProvider[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as DbProvider[];
}

export async function getProviderById(id: string): Promise<DbProvider | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("providers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as DbProvider) ?? null;
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}
