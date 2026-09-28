export interface ProgramItem {
  id: string;
  day: 1 | 2;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  speakers?: string[];
  type: 'opening' | 'screening' | 'award' | 'performance' | 'break' | 'closing' | 'networking';
}

export interface Edition {
  year: number;
  theme: string;
  attendees: number;
  films: number;
  awards: number;
  sponsors: number;
  coverImage: string;
  gallery: string[];
  topLaureates: { category: string; winner: string }[];
}
