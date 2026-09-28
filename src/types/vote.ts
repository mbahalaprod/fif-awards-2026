export interface Vote {
  id: string;
  email: string;
  emailHash: string;
  categoryId: string;
  nomineeId: string;
  ipHash: string;
  timestamp: string;
}

export interface VoteCounts {
  [nomineeId: string]: number;
}
