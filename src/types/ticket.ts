export type TicketTier = 'standard' | 'vip' | 'premium';

export interface TicketType {
  id: TicketTier;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  available: boolean;
}
