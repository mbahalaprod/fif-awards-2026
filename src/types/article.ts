export type ArticleCategory = 'annonces' | 'portraits' | 'programme' | 'coulisses';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  author: string;
  publishedAt: string;
  imageUrl: string;
  readingTime: number;
}
