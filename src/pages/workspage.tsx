import { useLanguage } from '@/lib/LanguageContext';
import { ContentCard } from '@/components/ContentCard';
import { SponsorBlock } from '@/components/SponsorBlock';
import { useContentByProgram, useSponsorById } from '@/lib/contentHooks';

export function WorksPage() {
  const { t } = useLanguage();

  const { items, loading } = useContentByProgram('works');

  const works = items.filter(
    (item) =>
      item.programSlug === 'works' &&
      item.type === 'movie'
  );

  const sponsorId = works.find((item) => item.sponsorId)?.sponsorId;
  const sponsor = useSponsorById(sponsorId);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950 to-black" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(220,38,38,0.12),transparent_45%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <p className="text-red-500 text-xs uppercase tracking-[0.25em] font-semibold mb-3">
            EvoVision Films
          </p>

          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
            {t('works.title')}
          </h1>

          <p className="text-lg text-white/60 max-w-2xl">
            {t('works.subtitle')}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-xl bg-zinc-900/50 border border-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : works.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-semibold text-white">
                  {t('works.catalogTitle')}
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  {t('works.catalogSubtitle')}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {works.map((work) => (
                  <ContentCard
                    key={work.id}
                    item={work}
                  />
                ))}
              </div>

              <div className="mt-16">
                <SponsorBlock sponsor={sponsor} />
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-900/30 py-20 px-6 text-center">
              <p className="text-white/40">
                {t('common.noContent')}
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}

export default WorksPage;