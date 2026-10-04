import 'server-only';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { ActionState } from './action-state';

export function fail(message: string): ActionState {
  return { ok: false, message };
}

export function done(message: string): ActionState {
  return { ok: true, message };
}

export function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export function optionalText(formData: FormData, key: string): string | null {
  return text(formData, key) || null;
}

export function integer(formData: FormData, key: string, fallback = 0): number {
  const n = Number.parseInt(text(formData, key), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on';
}

export function optionalUrl(formData: FormData, key: string): string | null | 'invalid' {
  const value = text(formData, key);
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? value : 'invalid';
  } catch {
    return 'invalid';
  }
}

/** Les pages publiques sont régénérées immédiatement après une modification. */
export function refreshPublicSite() {
  revalidatePath('/', 'layout');
}

/** Slug unique dans la table (ajoute -2, -3… en cas de doublon). */
export async function uniqueSlug(
  supabase: SupabaseClient,
  table: 'distingues' | 'actualites',
  source: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(source) || 'fiche';
  for (let i = 1; i < 50; i++) {
    const candidate = i === 1 ? base : `${base}-${i}`;
    let query = supabase.from(table).select('id').eq('slug', candidate);
    if (excludeId) query = query.neq('id', excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
  }
  return `${base}-${Date.now()}`;
}
