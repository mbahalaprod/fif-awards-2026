import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Limite le nombre d'envois par adresse IP sur une fenêtre de temps, en comptant
 * les lignes déjà enregistrées dans la table (pas besoin de service externe).
 */
export async function isRateLimited(
  supabase: SupabaseClient,
  table: 'candidatures' | 'messages' | 'reservations',
  ipHash: string,
  { max, windowMinutes }: { max: number; windowMinutes: number },
): Promise<boolean> {
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since);
  if (error) {
    console.error(`[rate-limit] ${table}:`, error);
    return false;
  }
  return (count ?? 0) >= max;
}
