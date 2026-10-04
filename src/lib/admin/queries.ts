import 'server-only';
import { createSessionClient } from '@/lib/supabase/server';
import {
  toCategory,
  toDistingue,
  type CategoryRow,
  type DistingueRow,
} from '@/lib/mappers';

/** Lectures de l'admin : passent par la session, donc voient aussi les brouillons. */

export async function adminCategories() {
  const { data } = await createSessionClient()
    .from('categories')
    .select('id, slug, nom, description, ordre')
    .order('ordre');
  return ((data ?? []) as CategoryRow[]).map(toCategory);
}

export async function adminDistingues() {
  const { data } = await createSessionClient()
    .from('distingues')
    .select('id, slug, nom_complet, categorie_id, metier, citation, biographie, photo_url, statut, ordre')
    .order('ordre')
    .order('nom_complet');
  return ((data ?? []) as DistingueRow[]).map(toDistingue);
}

export async function adminDistingue(id: string) {
  const { data } = await createSessionClient()
    .from('distingues')
    .select('id, slug, nom_complet, categorie_id, metier, citation, biographie, photo_url, statut, ordre')
    .eq('id', id)
    .maybeSingle<DistingueRow>();
  return data ? toDistingue(data) : null;
}
