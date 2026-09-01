import { ArrowRight, Clock, Star, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Link } from '@/lib/router';
import type { ContentItem } from '@/lib/types';

export function ContentCard({ item }: { item: ContentItem }) {
  const { lang, t } = useLanguage();
  const tr = item.translations[lang];

  const detailPath = `/${item.programSlug}/${item.slug}`;
  const isPremium = item.isPremium;
  const showComingSoon = isPremium && item.programSlug === 'academy';

  return (
    <Link to={detailPath} className="group block">
      <article className="relative overflow-hidden rounded-xl bg-zinc-900/50 border border-white/5 transition-all duration-300 hover:border-white/15 hover:shadow-2xl hover:shadow-red-950/20">
        <div className="relative aspect-[2/3] overflow-hidden bg-zinc-950">
          <img
            src={item.coverImage}
            alt={tr.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {item.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded">
              <Star className="w-3 h-3 fill-white" />
              {t('home.featuredLabel')}
            </div>
          )}

          {showComingSoon && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/70 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold rounded">
              <Lock className="w-3 h-3" />
              {t('common.premiumComingSoon')}
            </div>
          )}

          {item.type === 'movie' && item.year && (
            <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white/80 text-xs rounded">
              {item.year}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white text-base leading-snug mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
            {tr.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50 mb-3">
            {item.genre && <span>{item.genre}</span>}
            {item.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.duration}
              </span>
            )}
            {item.difficulty && <span>{t(`academy.${item.difficulty}` as never)}</span>}
          </div>

          <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
            {tr.synopsis}
          </p>

          <div className="mt-3 flex items-center gap-1 text-xs text-red-400 group-hover:text-red-300 transition-colors">
            {t('common.readMore')}
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}
