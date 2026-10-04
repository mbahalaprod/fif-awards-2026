import 'server-only';
import { createHmac } from 'crypto';
import type { NextRequest } from 'next/server';

/** Empreinte HMAC-SHA256 : permet de comparer e-mails et IP sans les stocker en clair. */
export function hashValue(value: string): string {
  const secret = process.env.HASH_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'fif-awards';
  return createHmac('sha256', secret).update(value.trim().toLowerCase()).digest('hex');
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/** Nom du champ piège : invisible pour les humains, souvent rempli par les robots. */
export const HONEYPOT_FIELD = 'site_web';

export function isHoneypotFilled(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false;
  const value = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  return typeof value === 'string' && value.trim().length > 0;
}
