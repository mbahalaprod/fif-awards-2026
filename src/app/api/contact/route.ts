import { NextResponse, type NextRequest } from 'next/server';
import { CONTACT_SUBJECT_LABELS, contactSchema } from '@/lib/validations';
import { jsonError, parsePublicForm } from '@/lib/api';
import { createServiceClient } from '@/lib/supabase/service';
import { getClientIp, hashValue } from '@/lib/security';
import { isRateLimited } from '@/lib/rate-limit';
import { notifyTeam } from '@/lib/email';

const SUCCESS_MESSAGE = 'Message envoyé. Merci !';

export async function POST(req: NextRequest) {
  const parsed = await parsePublicForm(req, contactSchema);
  if (parsed.ok === 'honeypot') return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
  if (!parsed.ok) return parsed.response;
  const data = parsed.data;

  const supabase = createServiceClient();
  const ipHash = hashValue(getClientIp(req));
  if (await isRateLimited(supabase, 'messages', ipHash, { max: 5, windowMinutes: 30 })) {
    return jsonError('Trop de messages envoyés depuis cette connexion. Réessayez plus tard.', 429);
  }

  const subjectLabel = CONTACT_SUBJECT_LABELS[data.subject];
  const { error } = await supabase.from('messages').insert({
    nom: data.name,
    email: data.email,
    sujet: subjectLabel,
    texte: data.message,
    ip_hash: ipHash,
  });
  if (error) {
    console.error('[contact] insertion :', error);
    return jsonError("L'envoi a échoué. Merci de réessayer.", 500);
  }

  await notifyTeam(
    `Nouveau message — ${subjectLabel}`,
    [
      ['Nom', data.name],
      ['Email', data.email],
      ['Sujet', subjectLabel],
      ['Message', data.message],
    ],
    data.email,
  );

  return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
}
