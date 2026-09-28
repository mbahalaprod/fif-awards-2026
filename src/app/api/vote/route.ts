import { NextResponse, type NextRequest } from 'next/server';
import { voteSchema } from '@/lib/validations';
import { hasVotedInCategory, getLastVoteAttempt, recordVote, getVoteCounts } from '@/lib/votes';
import { getNomineesByCategory } from '@/lib/data';

const COOLDOWN_MS = 60_000; // 60s between attempts
const OTP_CODE = process.env.OTP_DEMO_CODE ?? '123456';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = voteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { email, categoryId, nomineeId, otp } = parsed.data;

  // 1. OTP check (V1: code statique)
  if (otp !== OTP_CODE) {
    return NextResponse.json(
      { error: 'Code de validation incorrect. Astuce démo : 123456.' },
      { status: 401 },
    );
  }

  // 2. Nominee belongs to category?
  const eligible = getNomineesByCategory(categoryId).some((n) => n.id === nomineeId);
  if (!eligible) {
    return NextResponse.json(
      { error: 'Ce nominé n\'appartient pas à la catégorie sélectionnée.' },
      { status: 400 },
    );
  }

  // 3. Already voted in this category?
  const alreadyVoted = await hasVotedInCategory(email, categoryId);
  if (alreadyVoted) {
    return NextResponse.json(
      { error: 'Vous avez déjà voté dans cette catégorie.' },
      { status: 409 },
    );
  }

  // 4. Cooldown
  const ip = getClientIp(req);
  const last = await getLastVoteAttempt(email, ip);
  if (last) {
    const elapsed = Date.now() - new Date(last.timestamp).getTime();
    if (elapsed < COOLDOWN_MS) {
      const waitSec = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
      return NextResponse.json(
        { error: `Veuillez patienter ${waitSec}s avant un nouveau vote.` },
        { status: 429 },
      );
    }
  }

  // 5. Record vote
  await recordVote({ email, categoryId, nomineeId, ip });

  return NextResponse.json({ success: true, message: 'Votre vote a bien été enregistré. Merci !' });
}

export async function GET() {
  const counts = await getVoteCounts();
  return NextResponse.json({ counts });
}
