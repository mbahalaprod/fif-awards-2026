import { NextResponse, type NextRequest } from 'next/server';
import { candidatureSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = candidatureSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // V1 : on simule la création et l'envoi de mail
  // V2 : persistance + SMTP + upload S3

  return NextResponse.json({
    success: true,
    message: 'Candidature enregistrée.',
    submissionId: `app-${Date.now()}`,
  });
}
