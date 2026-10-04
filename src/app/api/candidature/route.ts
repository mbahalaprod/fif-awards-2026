import { NextResponse, type NextRequest } from 'next/server';
import { candidatureSchema } from '@/lib/validations';
import { jsonError, parsePublicForm } from '@/lib/api';
import { createServiceClient } from '@/lib/supabase/service';
import { getClientIp, hashValue } from '@/lib/security';
import { isRateLimited } from '@/lib/rate-limit';
import { getCategoryById, getSettings } from '@/lib/data';
import { areApplicationsOpen } from '@/lib/settings';
import { notifyTeam, sendConfirmation } from '@/lib/email';

const SUCCESS_MESSAGE = 'Candidature enregistrée. Merci !';

export async function POST(req: NextRequest) {
  const parsed = await parsePublicForm(req, candidatureSchema);
  if (parsed.ok === 'honeypot') return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
  if (!parsed.ok) return parsed.response;
  const data = parsed.data;

  if (!areApplicationsOpen(await getSettings())) {
    return jsonError('Les candidatures sont actuellement fermées.', 403);
  }

  const category = await getCategoryById(data.categoryId);
  if (!category) return jsonError('Catégorie inconnue.', 400);

  const supabase = createServiceClient();
  const ipHash = hashValue(getClientIp(req));
  if (await isRateLimited(supabase, 'candidatures', ipHash, { max: 5, windowMinutes: 60 })) {
    return jsonError('Trop de candidatures envoyées depuis cette connexion. Réessayez plus tard.', 429);
  }

  const { error } = await supabase.from('candidatures').insert({
    nom: data.fullName,
    email: data.email,
    telephone: data.phone,
    categorie_id: category.id,
    oeuvre_parcours: data.workOrCareer,
    lien: data.link || null,
    message: data.message || null,
    ip_hash: ipHash,
  });
  if (error) {
    console.error('[candidature] insertion :', error);
    return jsonError("L'enregistrement a échoué. Merci de réessayer.", 500);
  }

  await Promise.all([
    notifyTeam(
      `Nouvelle candidature — ${data.fullName}`,
      [
        ['Nom', data.fullName],
        ['Email', data.email],
        ['Téléphone', data.phone],
        ['Catégorie', category.name],
        ['Œuvre ou parcours', data.workOrCareer],
        ['Lien', data.link],
        ['Message', data.message],
      ],
      data.email,
    ),
    sendConfirmation(
      data.email,
      'FIF AWARDS 2026 — candidature bien reçue',
      `Bonjour ${data.fullName},\n\nNous avons bien reçu votre candidature dans la catégorie « ${category.name} ». Le Comité d'Organisation l'examinera et reviendra vers vous.`,
    ),
  ]);

  return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
}
