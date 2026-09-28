import { NextResponse, type NextRequest } from 'next/server';
import { contactSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // V1 : on simule l'envoi de mail
  // V2 : transfert SMTP + ticketing
  return NextResponse.json({
    success: true,
    message: 'Message envoyé.',
  });
}
