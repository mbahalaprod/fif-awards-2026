import { z } from 'zod';

// ============================================================================
// Vote
// ============================================================================

export const voteSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide.' }),
  categoryId: z.string().min(1, { message: 'Catégorie requise.' }),
  nomineeId: z.string().min(1, { message: 'Nominé requis.' }),
  otp: z.string().length(6, { message: 'Le code de validation comporte 6 chiffres.' }),
});

export type VoteInput = z.infer<typeof voteSchema>;

// ============================================================================
// Candidature
// ============================================================================

export const candidatureSchema = z.object({
  // Étape 1 — identité
  firstName: z.string().min(2, { message: 'Prénom requis.' }),
  lastName: z.string().min(2, { message: 'Nom requis.' }),
  email: z.string().email({ message: 'Adresse email invalide.' }),
  phone: z.string().min(8, { message: 'Numéro de téléphone invalide.' }),
  country: z.string().min(2, { message: 'Pays requis.' }),

  // Étape 2 — type
  applicationType: z.enum(['film', 'serie', 'technique'], {
    errorMap: () => ({ message: 'Type de candidature requis.' }),
  }),
  categoryId: z.string().min(1, { message: 'Catégorie requise.' }),

  // Étape 3 — œuvre
  workTitle: z.string().min(2, { message: 'Titre de l\'œuvre requis.' }),
  workYear: z.coerce.number().min(2020).max(2026),
  duration: z.coerce.number().min(1, { message: 'Durée invalide.' }),
  synopsis: z.string().min(50, { message: 'Le synopsis doit comporter au moins 50 caractères.' }),
  team: z.string().min(2, { message: 'Équipe requise.' }),

  // Étape 4 — médias
  posterUrl: z.string().url().optional().or(z.literal('')),
  trailerUrl: z.string().url({ message: 'URL invalide (YouTube/Vimeo).' }),

  // Consentement
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter le règlement du festival.' }),
  }),
});

export type CandidatureInput = z.infer<typeof candidatureSchema>;

// ============================================================================
// Billetterie
// ============================================================================

export const ticketOrderSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  ticketType: z.enum(['standard', 'vip', 'premium']),
  quantity: z.coerce.number().min(1).max(10),
});

export type TicketOrderInput = z.infer<typeof ticketOrderSchema>;

// ============================================================================
// Contact
// ============================================================================

export const contactSchema = z.object({
  name: z.string().min(2, { message: 'Nom requis.' }),
  email: z.string().email({ message: 'Adresse email invalide.' }),
  subject: z.enum(['candidature', 'partenariat', 'presse', 'information'], {
    errorMap: () => ({ message: 'Sujet requis.' }),
  }),
  message: z.string().min(20, { message: 'Le message doit comporter au moins 20 caractères.' }),
});

export type ContactInput = z.infer<typeof contactSchema>;
