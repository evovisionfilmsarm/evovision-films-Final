import { supabase } from './supabase';
import type { ContentItem, ContentTranslation, Sponsor, Language } from './types';
import { sampleContent, sponsors as sampleSponsors } from './sampleData';

interface ContentRow {
  id: string;
  slug: string;
  type: 'movie' | 'episode' | 'lesson';
  program_slug: string;
  category_slug: string | null;
  cover_image: string;
  trailer_url: string | null;
  telegram_link: string | null;
  year: number | null;
  genre: string | null;
  duration: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  is_premium: boolean;
  is_published: boolean;
  featured: boolean;
  published_at: string | null;
  sponsor_id: string | null;
  content_translations: Array<{
    language: string;
    title: string;
    synopsis: string;
    description: string;
    seo_title: string | null;
    seo_description: string | null;
  }>;
}

interface SponsorRow {
  id: string;
  name: string;
  logo: string | null;
  banner: string | null;
  link: string;
  is_active: boolean;
  sponsor_translations: Array<{
    language: string;
    label: string;
    message: string;
  }>;
}

function mapContentRow(row: ContentRow): ContentItem {
  const translations = {} as Record<Language, ContentTranslation>;
  for (const tr of row.content_translations) {
    translations[tr.language as Language] = {
      title: tr.title,
      synopsis: tr.synopsis,
      description: tr.description,
      seoTitle: tr.seo_title ?? '',
      seoDescription: tr.seo_description ?? '',
    };
  }
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    programSlug: row.program_slug,
    categorySlug: row.category_slug ?? undefined,
    coverImage: row.cover_image,
    trailerUrl: row.trailer_url ?? undefined,
    telegramLink: row.telegram_link ?? undefined,
    year: row.year ?? undefined,
    genre: row.genre ?? undefined,
    duration: row.duration ?? undefined,
    difficulty: row.difficulty ?? undefined,
    isPremium: row.is_premium,
    isPublished: row.is_published,
    featured: row.featured,
    publishedAt: row.published_at ?? '',
    sponsorId: row.sponsor_id ?? undefined,
    translations,
  };
}

function mapSponsorRow(row: SponsorRow): Sponsor {
  const translations = {} as Record<Language, { label: string; message: string }>;
  for (const tr of row.sponsor_translations) {
    translations[tr.language as Language] = {
      label: tr.label,
      message: tr.message,
    };
  }
  return {
    id: row.id,
    name: row.name,
    logo: row.logo ?? undefined,
    banner: row.banner ?? undefined,
    link: row.link,
    message: '',
    translations,
  };
}

export async function fetchContentByProgram(programSlug: string): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*, content_translations (*)')
      .eq('program_slug', programSlug)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      return sampleContent.filter((c) => c.programSlug === programSlug && c.isPublished);
    }
    return (data as unknown as ContentRow[]).map(mapContentRow);
  } catch {
    return sampleContent.filter((c) => c.programSlug === programSlug && c.isPublished);
  }
}

export async function fetchContentBySlug(slug: string): Promise<ContentItem | undefined> {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*, content_translations (*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return sampleContent.find((c) => c.slug === slug && c.isPublished);
    }
    return mapContentRow(data as unknown as ContentRow);
  } catch {
    return sampleContent.find((c) => c.slug === slug && c.isPublished);
  }
}

export async function fetchFeaturedContent(): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*, content_translations (*)')
      .eq('is_published', true)
      .eq('featured', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      return sampleContent.filter((c) => c.featured && c.isPublished);
    }
    return (data as unknown as ContentRow[]).map(mapContentRow);
  } catch {
    return sampleContent.filter((c) => c.featured && c.isPublished);
  }
}

export async function fetchRelatedContent(item: ContentItem, limit = 3): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*, content_translations (*)')
      .eq('program_slug', item.programSlug)
      .eq('is_published', true)
      .neq('id', item.id)
      .limit(limit);

    if (error) throw error;
    if (!data || data.length === 0) {
      return sampleContent
        .filter((c) => c.id !== item.id && c.programSlug === item.programSlug && c.isPublished)
        .slice(0, limit);
    }
    return (data as unknown as ContentRow[]).map(mapContentRow);
  } catch {
    return sampleContent
      .filter((c) => c.id !== item.id && c.programSlug === item.programSlug && c.isPublished)
      .slice(0, limit);
  }
}

export async function fetchSponsorById(id?: string): Promise<Sponsor | undefined> {
  if (!id) return undefined;
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*, sponsor_translations (*)')
      .eq('id', id)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return sampleSponsors.find((s) => s.id === id);
    }
    return mapSponsorRow(data as unknown as SponsorRow);
  } catch {
    return sampleSponsors.find((s) => s.id === id);
  }
}

export async function fetchLessonsByTier(isPremium: boolean): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*, content_translations (*)')
      .eq('program_slug', 'academy')
      .eq('is_published', true)
      .eq('is_premium', isPremium)
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      return sampleContent.filter(
        (c) => c.programSlug === 'academy' && c.isPublished && c.isPremium === isPremium
      );
    }
    return (data as unknown as ContentRow[]).map(mapContentRow);
  } catch {
    return sampleContent.filter(
      (c) => c.programSlug === 'academy' && c.isPublished && c.isPremium === isPremium
    );
  }
}
