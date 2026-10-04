'use server';

import { requireAdmin } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';
import { checkbox, done, fail, optionalText, optionalUrl, refreshPublicSite, text } from '@/lib/admin/form';
import type { ActionState } from '@/lib/admin/action-state';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function updateSettings(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const urls = {
    facebook_url: optionalUrl(formData, 'facebook_url'),
    instagram_url: optionalUrl(formData, 'instagram_url'),
    youtube_url: optionalUrl(formData, 'youtube_url'),
    tiktok_url: optionalUrl(formData, 'tiktok_url'),
    linkedin_url: optionalUrl(formData, 'linkedin_url'),
  };
  if (Object.values(urls).includes('invalid')) {
    return fail('Un lien de réseau social est invalide (il doit commencer par https://).');
  }

  const ouverture = text(formData, 'candidatures_ouverture') || null;
  const cloture = text(formData, 'candidatures_cloture') || null;
  if ((ouverture && !DATE.test(ouverture)) || (cloture && !DATE.test(cloture))) {
    return fail('Date invalide.');
  }
  if (ouverture && cloture && ouverture > cloture) {
    return fail("La date d'ouverture doit précéder la date de clôture.");
  }

  const email = optionalText(formData, 'email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Email invalide.');

  const { error } = await createSessionClient()
    .from('parametres')
    .update({
      vote_actif: checkbox(formData, 'vote_actif'),
      candidatures_ouvertes: checkbox(formData, 'candidatures_ouvertes'),
      distingues_visibles: checkbox(formData, 'distingues_visibles'),
      candidatures_ouverture: ouverture,
      candidatures_cloture: cloture,
      slogan: text(formData, 'slogan'),
      telephone: optionalText(formData, 'telephone'),
      email,
      whatsapp: optionalText(formData, 'whatsapp'),
      adresse: text(formData, 'adresse') || 'Radisson Blu Hôtel, Conakry, Guinée',
      ...urls,
    })
    .eq('id', 1);
  if (error) return fail(`Enregistrement impossible : ${error.message}`);

  refreshPublicSite();
  return done('Réglages enregistrés. Le site est à jour.');
}
