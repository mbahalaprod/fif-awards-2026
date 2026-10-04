import 'server-only';

/**
 * Envoi d'e-mails via l'API Resend (https://resend.com/docs/api-reference/emails/send-email).
 *
 * - Sans RESEND_API_KEY, rien n'est envoyé (l'enregistrement en base suffit).
 * - Les notifications partent vers EMAIL_EQUIPE.
 * - Les confirmations aux candidats ne partent que si EMAIL_CONFIRMATIONS_ACTIVES=true,
 *   c'est-à-dire une fois le nom de domaine vérifié chez Resend.
 * Un échec d'envoi est journalisé mais ne fait jamais échouer le formulaire.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

interface EmailMessage {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}

async function sendEmail(message: EmailMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.EMAIL_EXPEDITEUR ?? 'FIF AWARDS <onboarding@resend.dev>';
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        reply_to: message.replyTo,
      }),
    });
    if (!res.ok) {
      console.error('[email] Resend a refusé l’envoi :', res.status, await res.text());
    }
  } catch (error) {
    console.error('[email] Envoi impossible :', error);
  }
}

function teamRecipients(): string[] {
  return (process.env.EMAIL_EQUIPE ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function confirmationsEnabled(): boolean {
  return process.env.EMAIL_CONFIRMATIONS_ACTIVES === 'true';
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fifawards.gn';

/** Notification à l'équipe (nouvelle candidature, message, réservation). */
export async function notifyTeam(subject: string, lines: [string, string | null | undefined][], replyTo?: string) {
  const to = teamRecipients();
  if (to.length === 0) return;
  const body = lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label} : ${value}`)
    .join('\n');
  await sendEmail({
    to,
    subject: `[FIF AWARDS] ${subject}`,
    text: `${body}\n\nÀ traiter dans l'espace d'administration : ${SITE_URL}/admin`,
    replyTo,
  });
}

/** Accusé de réception envoyé à la personne qui a rempli un formulaire. */
export async function sendConfirmation(to: string, subject: string, text: string) {
  if (!confirmationsEnabled()) return;
  await sendEmail({
    to,
    subject,
    text: `${text}\n\nLe Comité d'Organisation du FIF AWARDS\n${SITE_URL}`,
  });
}

/** Code de validation du vote du public. */
export async function sendVoteCode(to: string, code: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'FIF AWARDS — votre code de validation',
    text: `Votre code de validation est : ${code}\n\nIl est valable 10 minutes.\n\nSi vous n'avez pas demandé ce code, ignorez ce message.`,
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
