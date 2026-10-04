export type SponsorTier = 'platine' | 'or' | 'argent' | 'bronze';

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
}
