export interface Article {
  id: string;
  slug: string;
  title: string;
  /** Date de publication (AAAA-MM-JJ). */
  publishedAt: string;
  content: string;
  excerpt: string;
  imageUrl: string | null;
  readingTime: number;
}
