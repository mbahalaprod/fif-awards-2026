/** Lieu de la 4ᵉ édition : à changer ici, puis dans /admin/reglages (adresse affichée). */
export const VENUE = {
  name: 'Centre Culturel Franco-Guinéen',
  shortName: 'CCFG',
  city: 'Conakry',
  country: 'Guinée',
  fullAddress: 'Centre Culturel Franco-Guinéen, Conakry, Guinée',
  mapQuery: 'Centre Culturel Franco-Guinéen Conakry',
} as const;

export const VENUE_MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(VENUE.mapQuery)}&output=embed`;
