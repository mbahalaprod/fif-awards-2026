export type SponsorTier = 'platine' | 'or' | 'argent' | 'bronze';

export interface Sponsor {
  id: string;
  name: string;
  tier: SponsorTier;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  sector: string;
}
