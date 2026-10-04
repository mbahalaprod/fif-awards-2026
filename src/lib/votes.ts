import 'server-only';
import { randomInt } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { VoteCounts } from '@/types/vote';
import { hashValue } from '@/lib/security';

// Vote du public : désactivé pour l'édition 2026 (interrupteur « vote_actif » dans les réglages).
// Tout passe par la clé de service, les tables votes et codes_otp n'ayant aucune règle RLS publique.

const CODE_TTL_MINUTES = 10;
const MAX_CODES_PER_WINDOW = 3;

export type CodeRequestResult = { ok: true; code: string } | { ok: false; reason: 'too_many' | 'error' };

export async function createVoteCode(supabase: SupabaseClient, email: string): Promise<CodeRequestResult> {
  const emailHash = hashValue(email);
  const since = new Date(Date.now() - CODE_TTL_MINUTES * 60_000).toISOString();

  const { count } = await supabase
    .from('codes_otp')
    .select('id', { count: 'exact', head: true })
    .eq('email_hash', emailHash)
    .gte('created_at', since);
  if ((count ?? 0) >= MAX_CODES_PER_WINDOW) return { ok: false, reason: 'too_many' };

  const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
  const { error } = await supabase.from('codes_otp').insert({
    email_hash: emailHash,
    code_hash: hashValue(`${email}:${code}`),
    expires_at: new Date(Date.now() + CODE_TTL_MINUTES * 60_000).toISOString(),
  });
  if (error) {
    console.error('[vote] création du code :', error);
    return { ok: false, reason: 'error' };
  }
  return { ok: true, code };
}

/** Vérifie le code et le consomme (un code ne sert qu'une fois). */
export async function consumeVoteCode(supabase: SupabaseClient, email: string, code: string): Promise<boolean> {
  const { data } = await supabase
    .from('codes_otp')
    .select('id')
    .eq('email_hash', hashValue(email))
    .eq('code_hash', hashValue(`${email}:${code}`))
    .gt('expires_at', new Date().toISOString())
    .limit(1)
    .maybeSingle();
  if (!data) return false;
  await supabase.from('codes_otp').delete().eq('id', data.id);
  return true;
}

export type RecordVoteResult = 'ok' | 'already_voted' | 'error';

export async function recordVote(
  supabase: SupabaseClient,
  params: { email: string; categoryId: string; distingueId: string; ip: string },
): Promise<RecordVoteResult> {
  const { error } = await supabase.from('votes').insert({
    email_hash: hashValue(params.email),
    categorie_id: params.categoryId,
    distingue_id: params.distingueId,
    ip_hash: hashValue(params.ip),
  });
  if (!error) return 'ok';
  // 23505 : contrainte d'unicité (email_hash, categorie_id) → déjà voté.
  if (error.code === '23505') return 'already_voted';
  console.error('[vote] enregistrement :', error);
  return 'error';
}

export async function getVoteCounts(supabase: SupabaseClient): Promise<VoteCounts> {
  const { data, error } = await supabase.from('votes').select('distingue_id');
  if (error) {
    console.error('[vote] comptage :', error);
    return {};
  }
  const counts: VoteCounts = {};
  for (const row of data as { distingue_id: string }[]) {
    counts[row.distingue_id] = (counts[row.distingue_id] ?? 0) + 1;
  }
  return counts;
}
