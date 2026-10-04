'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { createServiceClient, isServiceConfigured } from '@/lib/supabase/service';
import { createSessionClient } from '@/lib/supabase/server';
import { done, fail, text } from '@/lib/admin/form';
import type { ActionState } from '@/lib/admin/action-state';

const MIN_PASSWORD = 12;

function readRole(formData: FormData): 'admin' | 'editeur' {
  return text(formData, 'role') === 'admin' ? 'admin' : 'editeur';
}

/** Crée un compte nominatif. Le mot de passe provisoire est transmis à la personne par un canal sûr. */
export async function createAccount(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  if (!isServiceConfigured()) return fail('Clé de service Supabase manquante.');

  const email = text(formData, 'email').toLowerCase();
  const password = text(formData, 'password');
  const role = readRole(formData);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Email invalide.');
  if (password.length < MIN_PASSWORD) {
    return fail(`Le mot de passe doit comporter au moins ${MIN_PASSWORD} caractères.`);
  }

  const service = createServiceClient();
  const { data, error } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) return fail(`Création impossible : ${error?.message ?? 'erreur inconnue'}`);

  const { error: roleError } = await service
    .from('administrateurs')
    .insert({ user_id: data.user.id, email, role });
  if (roleError) {
    await service.auth.admin.deleteUser(data.user.id);
    return fail(`Création impossible : ${roleError.message}`);
  }

  revalidatePath('/admin/comptes');
  return done(`Compte créé pour ${email}.`);
}

export async function updateAccountRole(userId: string, formData: FormData): Promise<void> {
  const me = await requireAdmin();
  if (userId === me.userId) return; // pas d'auto-rétrogradation : évite de perdre le dernier admin
  await createSessionClient().from('administrateurs').update({ role: readRole(formData) }).eq('user_id', userId);
  revalidatePath('/admin/comptes');
}

export async function resetAccountPassword(userId: string, _: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  if (!isServiceConfigured()) return fail('Clé de service Supabase manquante.');
  const password = text(formData, 'password');
  if (password.length < MIN_PASSWORD) {
    return fail(`Le mot de passe doit comporter au moins ${MIN_PASSWORD} caractères.`);
  }
  const { error } = await createServiceClient().auth.admin.updateUserById(userId, { password });
  if (error) return fail(`Modification impossible : ${error.message}`);
  return done('Mot de passe modifié.');
}

export async function deleteAccount(userId: string): Promise<void> {
  const me = await requireAdmin();
  if (userId === me.userId || !isServiceConfigured()) return;
  // La suppression de l'utilisateur supprime aussi sa ligne « administrateurs » (cascade).
  await createServiceClient().auth.admin.deleteUser(userId);
  revalidatePath('/admin/comptes');
}
