import { z } from 'zod';

// Champ piège anti-robot (voir src/lib/security.ts) : doit rester vide.
const honeypot = { site_web: z.string().optional() };

const optionalUrl = z
  .string()
  .trim()
  .url({ message: 'Lien invalide (il doit commencer par https://).' })
  .optional()
  .or(z.literal(''));

// ============================================================================
// Vote (désactivé pour l'édition 2026, conservé pour plus tard)
// ============================================================================

export const voteCodeSchema = z.object({
  email: z.string().trim().email({ message: 'Adresse email invalide.' }),
});

export const voteSchema = z.object({
  email: z.string().trim().email({ message: 'Adresse email invalide.' }),
  categoryId: z.string().uuid({ message: 'Catégorie requise.' }),
  distingueId: z.string().uuid({ message: 'Choix requis.' }),
  code: z.string().regex(/^\d{6}$/, { message: 'Le code de validation comporte 6 chiffres.' }),
});

export type VoteInput = z.infer<typeof voteSchema>;

// ============================================================================
// Candidature
// ============================================================================

export const candidatureSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'Nom complet requis.' }).max(120),
  email: z.string().trim().email({ message: 'Adresse email invalide.' }),
  phone: z.string().trim().min(8, { message: 'Numéro de téléphone invalide.' }).max(30),
  categoryId: z.string().min(1, { message: 'Catégorie requise.' }),
  workOrCareer: z
    .string()
    .trim()
    .min(20, { message: 'Décrivez votre œuvre ou votre parcours en au moins 20 caractères.' })
    .max(3000),
  link: optionalUrl,
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter le règlement du festival.' }),
  }),
  ...honeypot,
});

export type CandidatureInput = z.infer<typeof candidatureSchema>;

// ============================================================================
// Billetterie (réservation, confirmée manuellement par l'équipe)
// ============================================================================

export const ticketOrderSchema = z
  .object({
    fullName: z.string().trim().min(2, { message: 'Nom complet requis.' }).max(120),
    phone: z.string().trim().max(30).optional().or(z.literal('')),
    email: z
      .string()
      .trim()
      .email({ message: 'Adresse email invalide.' })
      .optional()
      .or(z.literal('')),
    ticketType: z.enum(['standard', 'vip', 'premium']),
    quantity: z.coerce
      .number()
      .int()
      .min(1, { message: 'Au moins 1 place.' })
      .max(10, { message: '10 places maximum par réservation.' }),
    ...honeypot,
  })
  .refine((data) => (data.phone && data.phone.length >= 8) || data.email, {
    message: 'Indiquez un téléphone ou un email pour que nous puissions vous recontacter.',
    path: ['phone'],
  });

export type TicketOrderInput = z.infer<typeof ticketOrderSchema>;

// ============================================================================
// Contact
// ============================================================================

export const contactSchema = z.object({
  name: z.string().trim().min(2, { message: 'Nom requis.' }).max(120),
  email: z.string().trim().email({ message: 'Adresse email invalide.' }),
  subject: z.enum(['candidature', 'partenariat', 'presse', 'information'], {
    errorMap: () => ({ message: 'Sujet requis.' }),
  }),
  message: z
    .string()
    .trim()
    .min(20, { message: 'Le message doit comporter au moins 20 caractères.' })
    .max(5000),
  ...honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;

export const CONTACT_SUBJECT_LABELS: Record<ContactInput['subject'], string> = {
  candidature: 'Candidature',
  partenariat: 'Partenariat / Sponsoring',
  presse: 'Presse / Médias',
  information: 'Information générale',
};
