import { NextResponse, type NextRequest } from 'next/server';
import { getStaff } from '@/lib/admin/auth';
import { createSessionClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Colonnes exportées par table : [colonne Supabase, en-tête du fichier].
const EXPORTS: Record<string, { select: string; columns: [string, string][] }> = {
  candidatures: {
    select: 'created_at, nom, email, telephone, categories(nom), oeuvre_parcours, lien, message, statut',
    columns: [
      ['created_at', 'Date'],
      ['nom', 'Nom'],
      ['email', 'Email'],
      ['telephone', 'Téléphone'],
      ['categorie', 'Catégorie'],
      ['oeuvre_parcours', 'Œuvre ou parcours'],
      ['lien', 'Lien'],
      ['message', 'Message'],
      ['statut', 'Statut'],
    ],
  },
  messages: {
    select: 'created_at, nom, email, sujet, texte, lu',
    columns: [
      ['created_at', 'Date'],
      ['nom', 'Nom'],
      ['email', 'Email'],
      ['sujet', 'Sujet'],
      ['texte', 'Message'],
      ['lu', 'Lu'],
    ],
  },
  reservations: {
    select: 'created_at, nom, telephone, email, type_billet, nombre_places, statut',
    columns: [
      ['created_at', 'Date'],
      ['nom', 'Nom'],
      ['telephone', 'Téléphone'],
      ['email', 'Email'],
      ['type_billet', 'Formule'],
      ['nombre_places', 'Places'],
      ['statut', 'Statut'],
    ],
  },
};

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  let text = typeof value === 'boolean' ? (value ? 'oui' : 'non') : String(value);
  // Neutralise les formules quand le fichier est ouvert dans un tableur
  // (sauf les numéros de téléphone du type « +224 620 … »).
  if (/^[=+\-@\t\r]/.test(text) && !/^[+-]?[\d\s().]+$/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** Export CSV (séparateur « ; » et BOM UTF-8, pour une ouverture directe dans Excel). */
export async function GET(_req: NextRequest, { params }: { params: { table: string } }) {
  if (!(await getStaff())) return new NextResponse('Accès refusé', { status: 401 });
  const config = EXPORTS[params.table];
  if (!config) return new NextResponse('Export inconnu', { status: 404 });

  const { data, error } = await createSessionClient()
    .from(params.table)
    .select(config.select)
    .order('created_at', { ascending: false });
  if (error) return new NextResponse('Export impossible', { status: 500 });

  const rows = (data as unknown as Record<string, unknown>[]).map((row) => {
    const flat: Record<string, unknown> = {
      ...row,
      categorie: (row.categories as { nom: string } | null)?.nom,
      created_at: new Date(String(row.created_at)).toLocaleString('fr-FR'),
    };
    return config.columns.map(([key]) => csvCell(flat[key])).join(';');
  });
  const header = config.columns.map(([, label]) => csvCell(label)).join(';');
  const csv = `﻿${[header, ...rows].join('\r\n')}`;
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="fif-awards-${params.table}-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
