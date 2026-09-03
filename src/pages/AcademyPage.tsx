import { Lock, Sparkles, CirclePlay as PlayCircle, Info } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { ContentCard } from '../components/ContentCard';
import { useLessonsByTier } from '../lib/contentHooks';
import { sampleImages } from '../lib/sampleData';

export function AcademyPage() {
  const { t } = useLanguage();
  const { items: freeLessons, loading: freeLoading } = useLessonsByTier(false);
  const { items: premiumLessons, loading: premiumLoading } = useLessonsByTier(true);

  return (
    <div>
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={sampleImages.editor} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
            {t('academy.title')}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl">{t('academy.subtitle')}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Free Lessons */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-600/15 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-green-400 font-semibold block mb-0.5">
                  {t('lessons.freeLabel')}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {t('lessons.freeTitle')}
                </h2>
              </div>
            </div>
            <p className="text-base text-white/60 leading-relaxed mb-8 max-w-2xl">
              {t('lessons.freeBody')}
            </p>
            {freeLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] rounded-xl bg-zinc-900/50 border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : freeLessons.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {freeLessons.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-center text-white/40 py-12">{t('common.noContent')}</p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Premium Lessons */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-600/15 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-red-400 font-semibold block mb-0.5">
                  {t('lessons.premiumLabel')}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {t('lessons.premiumTitle')}
                </h2>
              </div>
            </div>
            <p className="text-base text-white/60 leading-relaxed mb-8 max-w-2xl">
              {t('lessons.premiumBody')}
            </p>

            {/* Premium notice */}
            <div className="mb-8 p-4 lg:p-5 rounded-xl border border-red-600/20 bg-red-600/5 flex items-start gap-3">
              <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/60 leading-relaxed">
                {t('lessons.premiumNote')}
              </p>
            </div>

            {premiumLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] rounded-xl bg-zinc-900/50 border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : premiumLessons.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {premiumLessons.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-center text-white/40 py-12">{t('common.noContent')}</p>
            )}
          </div>

          {/* Coming soon teaser */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900/60 to-black">
            <div className="absolute inset-0">
              <img src={sampleImages.reel} alt="" className="w-full h-full object-cover opacity-15" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>
            <div className="relative p-8 lg:p-12 max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-red-500" />
                <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">
                  {t('common.comingSoon')}
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-3">
                {t('lessons.premiumTitle')}
              </h3>
              <p className="text-base text-white/60 leading-relaxed">
                {t('lessons.premiumNote')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
