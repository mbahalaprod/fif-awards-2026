import { NextResponse, type NextRequest } from 'next/server';
import { ticketOrderSchema } from '@/lib/validations';
import { jsonError, parsePublicForm } from '@/lib/api';
import { createServiceClient } from '@/lib/supabase/service';
import { getClientIp, hashValue } from '@/lib/security';
import { isRateLimited } from '@/lib/rate-limit';
import { getTickets } from '@/lib/data';
import { notifyTeam, sendConfirmation } from '@/lib/email';

const SUCCESS_MESSAGE = 'Demande de réservation enregistrée.';

export async function POST(req: NextRequest) {
  const parsed = await parsePublicForm(req, ticketOrderSchema);
  if (parsed.ok === 'honeypot') return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
  if (!parsed.ok) return parsed.response;
  const data = parsed.data;

  const ticket = getTickets().find((t) => t.id === data.ticketType);
  if (!ticket?.available) return jsonError("Cette formule n'est plus disponible.", 400);

  const supabase = createServiceClient();
  const ipHash = hashValue(getClientIp(req));
  if (await isRateLimited(supabase, 'reservations', ipHash, { max: 5, windowMinutes: 60 })) {
    return jsonError('Trop de réservations envoyées depuis cette connexion. Réessayez plus tard.', 429);
  }

  const { error } = await supabase.from('reservations').insert({
    nom: data.fullName,
    telephone: data.phone || null,
    email: data.email || null,
    nombre_places: data.quantity,
    type_billet: ticket.name,
    ip_hash: ipHash,
  });
  if (error) {
    console.error('[reservation] insertion :', error);
    return jsonError("L'enregistrement a échoué. Merci de réessayer.", 500);
  }

  await Promise.all([
    notifyTeam(
      `Nouvelle réservation — ${data.quantity} × ${ticket.name}`,
      [
        ['Nom', data.fullName],
        ['Téléphone', data.phone],
        ['Email', data.email],
        ['Formule', ticket.name],
        ['Places', String(data.quantity)],
      ],
      data.email || undefined,
    ),
    data.email
      ? sendConfirmation(
          data.email,
          'FIF AWARDS 2026 — demande de réservation reçue',
          `Bonjour ${data.fullName},\n\nNous avons bien reçu votre demande de ${data.quantity} place(s) en formule ${ticket.name}. Elle sera confirmée manuellement par notre équipe, qui vous recontactera pour le paiement.`,
        )
      : Promise.resolve(),
  ]);

  return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
}
