import { NextResponse, type NextRequest } from 'next/server';
import { voteCodeSchema } from '@/lib/validations';
import { jsonError } from '@/lib/api';
import { getSettings } from '@/lib/data';
import { createServiceClient, isServiceConfigured } from '@/lib/supabase/service';
import { createVoteCode } from '@/lib/votes';
import { isEmailConfigured, sendVoteCode } from '@/lib/email';

/** Étape 2 du vote : envoie un code à 6 chiffres par email. */
export async function POST(req: NextRequest) {
  if (!(await getSettings()).voteActive) return jsonError('Le vote est fermé.', 403);
  if (!isServiceConfigured() || !isEmailConfigured()) {
    return jsonError('Le vote est momentanément indisponible.', 503);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Requête invalide.', 400);
  }
  const parsed = voteCodeSchema.safeParse(body);
  if (!parsed.success) return jsonError('Adresse email invalide.', 400);

  const result = await createVoteCode(createServiceClient(), parsed.data.email);
  if (!result.ok) {
    return result.reason === 'too_many'
      ? jsonError('Trop de codes demandés. Patientez quelques minutes.', 429)
      : jsonError("Impossible d'envoyer le code. Réessayez.", 500);
  }

  await sendVoteCode(parsed.data.email, result.code);
  return NextResponse.json({ success: true, message: 'Code envoyé. Consultez votre boîte mail.' });
}
