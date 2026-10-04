import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';
import type { ZodSchema } from 'zod';
import { isHoneypotFilled } from '@/lib/security';
import { isServiceConfigured } from '@/lib/supabase/service';

type Parsed<T> = { ok: true; data: T } | { ok: false; response: NextResponse };

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Lecture commune des formulaires publics : JSON valide, base configurée,
 * champ piège vide et validation Zod.
 * `honeypot: true` signifie qu'un robot a été détecté : répondre « succès » sans rien enregistrer.
 */
export async function parsePublicForm<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
): Promise<Parsed<T> | { ok: 'honeypot' }> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { ok: false, response: jsonError('Requête invalide.', 400) };
  }

  if (isHoneypotFilled(body)) return { ok: 'honeypot' };

  if (!isServiceConfigured()) {
    return {
      ok: false,
      response: jsonError(
        "Le service est momentanément indisponible. Merci de réessayer plus tard ou de nous écrire par email.",
        503,
      ),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Données invalides.', details: parsed.error.flatten() },
        { status: 400 },
      ),
    };
  }
  return { ok: true, data: parsed.data };
}
