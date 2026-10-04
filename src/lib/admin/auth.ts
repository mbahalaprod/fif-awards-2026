import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { createSessionClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export type AdminRole = 'admin' | 'editeur';

export interface StaffMember {
  userId: string;
  email: string;
  role: AdminRole;
}

/** Membre de l'équipe connecté, ou null (non connecté, ou compte sans rôle). */
export const getStaff = cache(async (): Promise<StaffMember | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('administrateurs')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle<{ role: AdminRole }>();
  if (!data) return null;

  return { userId: user.id, email: user.email ?? '', role: data.role };
});

/** À appeler en tête de chaque page et action de l'admin. */
export async function requireStaff(): Promise<StaffMember> {
  const staff = await getStaff();
  if (!staff) redirect('/admin/connexion');
  return staff;
}

/** Réglages et comptes : réservés au rôle « admin ». */
export async function requireAdmin(): Promise<StaffMember> {
  const staff = await requireStaff();
  if (staff.role !== 'admin') redirect('/admin?refus=1');
  return staff;
}
