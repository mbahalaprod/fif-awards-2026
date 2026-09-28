import { NextResponse, type NextRequest } from 'next/server';
import { ticketOrderSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = ticketOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // V1 : on simule l'envoi de l'email de confirmation
  // V2 : intégration SMTP + paiement réel (Orange Money / Mobile Money / virement)

  return NextResponse.json({
    success: true,
    message: 'Réservation enregistrée. Un email de confirmation vient de partir.',
    order: parsed.data,
  });
}
