import { supabase } from './supabase';
import type { ContentItem, ContentTranslation, Sponsor, Language } from './types';

export interface ContentInput {
  slug: string;
  type: 'movie' | 'episode' | 'lesson';
  programSlug: string;
  categorySlug?: string;
  coverImage: string;
  trailerUrl?: string;
  telegramLink?: string;
  year?: number;
  genre?: string;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  isPublished: boolean;
  featured: boolean;
  sponsorId?: string;
  translations: Record<Language, ContentTranslation>;
}

export interface SponsorInput {
  name: string;
  logo?: string;
  banner?: string;
  link: string;
  isActive: boolean;
  translations: Record<Language, { label: string; message: string }>;
}

export async function createContent(input: ContentInput): Promise<{ error: string | null }> {
  try {
    const { data: itemData, error: itemError } = await supabase
      .from('content_items')
      .insert({
        slug: input.slug,
        type: input.type,
        program_slug: input.programSlug,
        category_slug: input.categorySlug ?? null,
        cover_image: input.coverImage,
        trailer_url: input.trailerUrl ?? null,
        telegram_link: input.telegramLink ?? null,
        year: input.year ?? null,
        genre: input.genre ?? null,
        duration: input.duration ?? null,
        difficulty: input.difficulty ?? null,
        is_premium: input.isPremium,
        is_published: input.isPublished,
        featured: input.featured,
        published_at: input.isPublished ? new Date().toISOString() : null,
        sponsor_id: input.sponsorId ?? null,
      })
      .select('id')
      .single();

    if (itemError) throw itemError;
    const contentId = itemData.id;

    const trRows = (['hy', 'ru', 'en'] as Language[]).map((lang) => ({
      content_id: contentId,
      language: lang,
      title: input.translations[lang].title,
      synopsis: input.translations[lang].synopsis,
      description: input.translations[lang].description,
      seo_title: input.translations[lang].seoTitle || null,
      seo_description: input.translations[lang].seoDescription || null,
    }));

    const { error: trError } = await supabase.from('content_translations').insert(trRows);
    if (trError) throw trError;

    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function updateContent(
  id: string,
  input: Partial<ContentInput>
): Promise<{ error: string | null }> {
  try {
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (input.slug !== undefined) update.slug = input.slug;
    if (input.type !== undefined) update.type = input.type;
    if (input.programSlug !== undefined) update.program_slug = input.programSlug;
    if (input.categorySlug !== undefined) update.category_slug = input.categorySlug ?? null;
    if (input.coverImage !== undefined) update.cover_image = input.coverImage;
    if (input.trailerUrl !== undefined) update.trailer_url = input.trailerUrl ?? null;
    if (input.telegramLink !== undefined) update.telegram_link = input.telegramLink ?? null;
    if (input.year !== undefined) update.year = input.year ?? null;
    if (input.genre !== undefined) update.genre = input.genre ?? null;
    if (input.duration !== undefined) update.duration = input.duration ?? null;
    if (input.difficulty !== undefined) update.difficulty = input.difficulty ?? null;
    if (input.isPremium !== undefined) update.is_premium = input.isPremium;
    if (input.isPublished !== undefined) {
      update.is_published = input.isPublished;
      if (input.isPublished) update.published_at = new Date().toISOString();
    }
    if (input.featured !== undefined) update.featured = input.featured;
    if (input.sponsorId !== undefined) update.sponsor_id = input.sponsorId ?? null;

    const { error: itemError } = await supabase.from('content_items').update(update).eq('id', id);
    if (itemError) throw itemError;

    if (input.translations) {
      for (const lang of ['hy', 'ru', 'en'] as Language[]) {
        const tr = input.translations[lang];
        if (!tr) continue;
        const { error: trError } = await supabase
          .from('content_translations')
          .update({
            title: tr.title,
            synopsis: tr.synopsis,
            description: tr.description,
            seo_title: tr.seoTitle || null,
            seo_description: tr.seoDescription || null,
          })
          .eq('content_id', id)
          .eq('language', lang);
        if (trError) throw trError;
      }
    }

    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function deleteContent(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('content_items').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function fetchAllContent(): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*, content_translations (*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((row: Record<string, unknown>) => {
      const translations = {} as Record<Language, ContentTranslation>;
      const trs = row.content_translations as Array<Record<string, unknown>>;
      for (const tr of trs) {
        translations[tr.language as Language] = {
          title: tr.title as string,
          synopsis: tr.synopsis as string,
          description: tr.description as string,
          seoTitle: (tr.seo_title as string) ?? '',
          seoDescription: (tr.seo_description as string) ?? '',
        };
      }
      return {
        id: row.id as string,
        slug: row.slug as string,
        type: row.type as ContentItem['type'],
        programSlug: row.program_slug as string,
        categorySlug: (row.category_slug as string) ?? undefined,
        coverImage: row.cover_image as string,
        trailerUrl: (row.trailer_url as string) ?? undefined,
        telegramLink: (row.telegram_link as string) ?? undefined,
        year: (row.year as number) ?? undefined,
        genre: (row.genre as string) ?? undefined,
        duration: (row.duration as string) ?? undefined,
        difficulty: (row.difficulty as ContentItem['difficulty']) ?? undefined,
        isPremium: row.is_premium as boolean,
        isPublished: row.is_published as boolean,
        featured: row.featured as boolean,
        publishedAt: (row.published_at as string) ?? '',
        sponsorId: (row.sponsor_id as string) ?? undefined,
        translations,
      };
    });
  } catch {
    return [];
  }
}

export async function fetchAllSponsors(): Promise<Sponsor[]> {
  try {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*, sponsor_translations (*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((row: Record<string, unknown>) => {
      const translations = {} as Record<Language, { label: string; message: string }>;
      const trs = row.sponsor_translations as Array<Record<string, unknown>>;
      for (const tr of trs) {
        translations[tr.language as Language] = {
          label: tr.label as string,
          message: tr.message as string,
        };
      }
      return {
        id: row.id as string,
        name: row.name as string,
        logo: (row.logo as string) ?? undefined,
        banner: (row.banner as string) ?? undefined,
        link: row.link as string,
        isActive: Boolean(row.is_active),
        message: '',
        translations,
      };
    });
  } catch {
    return [];
  }
}

export async function createSponsor(input: SponsorInput): Promise<{ error: string | null }> {
  try {
    const { data: sponsorData, error: sponsorError } = await supabase
      .from('sponsors')
      .insert({
        name: input.name,
        logo: input.logo ?? null,
        banner: input.banner ?? null,
        link: input.link,
        is_active: input.isActive,
      })
      .select('id')
      .single();

    if (sponsorError) throw sponsorError;
    const sponsorId = sponsorData.id;

    const trRows = (['hy', 'ru', 'en'] as Language[]).map((lang) => ({
      sponsor_id: sponsorId,
      language: lang,
      label: input.translations[lang].label,
      message: input.translations[lang].message,
    }));

    const { error: trError } = await supabase.from('sponsor_translations').insert(trRows);
    if (trError) throw trError;

    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function updateSponsor(
  id: string,
  input: Partial<SponsorInput>
): Promise<{ error: string | null }> {
  try {
    const update: Record<string, unknown> = {};
    if (input.name !== undefined) update.name = input.name;
    if (input.logo !== undefined) update.logo = input.logo ?? null;
    if (input.banner !== undefined) update.banner = input.banner ?? null;
    if (input.link !== undefined) update.link = input.link;
    if (input.isActive !== undefined) update.is_active = input.isActive;

    if (Object.keys(update).length > 0) {
      const { error } = await supabase.from('sponsors').update(update).eq('id', id);
      if (error) throw error;
    }

    if (input.translations) {
      for (const lang of ['hy', 'ru', 'en'] as Language[]) {
        const tr = input.translations[lang];
        if (!tr) continue;
        const { error } = await supabase
          .from('sponsor_translations')
          .update({ label: tr.label, message: tr.message })
          .eq('sponsor_id', id)
          .eq('language', lang);
        if (error) throw error;
      }
    }

    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function deleteSponsor(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('sponsors').delete().eq('id', id);
    if (error) throw error;
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function fetchDashboardStats(): Promise<{
  films: number;
  episodes: number;
  lessons: number;
  sponsors: number;
  published: number;
  drafts: number;
}> {
  try {
    const { count: films } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'movie');
    const { count: episodes } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'episode');
    const { count: lessons } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'lesson');
    const { count: sponsors } = await supabase
      .from('sponsors')
      .select('*', { count: 'exact', head: true });
    const { count: published } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);
    const { count: drafts } = await supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', false);

    return {
      films: films ?? 0,
      episodes: episodes ?? 0,
      lessons: lessons ?? 0,
      sponsors: sponsors ?? 0,
      published: published ?? 0,
      drafts: drafts ?? 0,
    };
  } catch {
    return { films: 0, episodes: 0, lessons: 0, sponsors: 0, published: 0, drafts: 0 };
  }
}
