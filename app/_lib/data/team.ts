// Team / workspace members for the real app. RLS-scoped: the profile_read
// policy (migration 0001) lets a user see profiles in their own tenant, so
// this returns the workspace's members and nobody else's.

import { createSupabaseServerClient } from "../supabase/serverClient";

export type TeamMember = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
};

export async function listTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data as TeamMember[];
}
