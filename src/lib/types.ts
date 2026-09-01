export type Language = 'hy' | 'ru' | 'en';

export type ContentType = 'movie' | 'episode' | 'lesson';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Program {
  slug: string;
  type: 'kinomas' | 'kadrich-durs' | 'academy';
  logo?: string;
}

export interface Category {
  id: string;
  slug: string;
  programSlug: string;
}

export interface ContentItem {
  id: string;
  slug: string;
  type: ContentType;
  programSlug: string;
  categorySlug?: string;
  coverImage: string;
  trailerUrl?: string;
  telegramLink?: string;
  year?: number;
  genre?: string;
  duration?: string;
  difficulty?: Difficulty;
  isPremium: boolean;
  isPublished: boolean;
  featured: boolean;
  publishedAt: string;
  sponsorId?: string;
  translations: Record<Language, ContentTranslation>;
}

export interface ContentTranslation {
  title: string;
  synopsis: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  banner?: string;
  message: string;
  link: string;
  isActive: boolean;
  translations: Record<Language, SponsorTranslation>;
}

export interface SponsorTranslation {
  label: string;
  message: string;
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  displayName: string;
}
