import { NextResponse, type NextRequest } from 'next/server';
import { voteSchema } from '@/lib/validations';
import { jsonError } from '@/lib/api';
import { getDistingues, getSettings } from '@/lib/data';
import { createServiceClient, isServiceConfigured } from '@/lib/supabase/service';
import { consumeVoteCode, getVoteCounts, recordVote } from '@/lib/votes';
import { getClientIp } from '@/lib/security';

export const dynamic = 'force-dynamic';

/** Étape 3 du vote : vérifie le code reçu par email et enregistre le vote. */
export async function POST(req: NextRequest) {
  if (!(await getSettings()).voteActive) return jsonError('Le vote est fermé.', 403);
  if (!isServiceConfigured()) return jsonError('Le vote est momentanément indisponible.', 503);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError('Requête invalide.', 400);
  }
  const parsed = voteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { email, categoryId, distingueId, code } = parsed.data;

  const eligible = (await getDistingues()).some(
    (d) => d.id === distingueId && d.categoryId === categoryId,
  );
  if (!eligible) return jsonError("Ce choix n'appartient pas à la catégorie sélectionnée.", 400);

  const supabase = createServiceClient();
  if (!(await consumeVoteCode(supabase, email, code))) {
    return jsonError('Code de validation incorrect ou expiré.', 401);
  }

  const result = await recordVote(supabase, { email, categoryId, distingueId, ip: getClientIp(req) });
  if (result === 'already_voted') return jsonError('Vous avez déjà voté dans cette catégorie.', 409);
  if (result === 'error') return jsonError("Le vote n'a pas pu être enregistré.", 500);

  return NextResponse.json({ success: true, message: 'Votre vote a bien été enregistré. Merci !' });
}

export async function GET() {
  const showResults = process.env.NEXT_PUBLIC_SHOW_VOTE_RESULTS === 'true';
  if (!showResults || !(await getSettings()).voteActive || !isServiceConfigured()) {
    return NextResponse.json({ counts: {} });
  }
  return NextResponse.json({ counts: await getVoteCounts(createServiceClient()) });
}
