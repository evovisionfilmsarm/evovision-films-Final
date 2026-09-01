import { useEffect, useState } from 'react';
import type { ContentItem, Sponsor } from './types';
import {
  fetchContentByProgram,
  fetchContentBySlug,
  fetchFeaturedContent,
  fetchRelatedContent,
  fetchSponsorById,
  fetchLessonsByTier,
} from './contentRepository';

export function useContentByProgram(programSlug: string) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchContentByProgram(programSlug).then((data) => {
      if (active) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [programSlug]);
  return { items, loading };
}

export function useContentBySlug(slug: string) {
  const [item, setItem] = useState<ContentItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchContentBySlug(slug).then((data) => {
      if (active) {
        setItem(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [slug]);
  return { item, loading };
}

export function useFeaturedContent() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchFeaturedContent().then((data) => {
      if (active) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);
  return { items, loading };
}

export function useRelatedContent(item: ContentItem | undefined) {
  const [items, setItems] = useState<ContentItem[]>([]);
  useEffect(() => {
    if (!item) return;
    let active = true;
    fetchRelatedContent(item).then((data) => {
      if (active) setItems(data);
    });
    return () => { active = false; };
  }, [item]);
  return items;
}

export function useSponsorById(id?: string) {
  const [sponsor, setSponsor] = useState<Sponsor | undefined>(undefined);
  useEffect(() => {
    if (!id) return;
    let active = true;
    fetchSponsorById(id).then((data) => {
      if (active) setSponsor(data);
    });
    return () => { active = false; };
  }, [id]);
  return sponsor;
}

export function useLessonsByTier(isPremium: boolean) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchLessonsByTier(isPremium).then((data) => {
      if (active) {
        setItems(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [isPremium]);
  return { items, loading };
}
