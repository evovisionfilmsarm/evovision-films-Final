import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { ContentCard } from '../components/ContentCard';
import { SponsorBlock } from '../components/SponsorBlock';
import { useContentByProgram, useSponsorById } from '../lib/contentHooks';
import type { ContentItem } from '../lib/types';

type SectionProps = {
  title: string;
  items: ContentItem[];
};

function ContentCarousel({ title, items }: SectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const amount = Math.min(
      scrollRef.current.clientWidth * 0.85,
      900
    );

    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl lg:text-3xl font-semibold text-white">
            {title}
          </h2>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="
            flex
            gap-4 lg:gap-6
            overflow-x-auto
            pb-4
            snap-x snap-mandatory
            scrollbar-none
            [&::-webkit-scrollbar]:hidden
          "
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="
                flex-none
                w-[68vw]
                sm:w-[38vw]
                md:w-[27vw]
                lg:w-[20vw]
                max-w-[280px]
                snap-start
                transition-all
                duration-300
              "
            >
              <ContentCard item={item} />
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Previous"
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/15 bg-black/75 backdrop-blur-sm text-white/80 hover:bg-black hover:text-white transition-all items-center justify-center shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Next"
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/15 bg-black/75 backdrop-blur-sm text-white/80 hover:bg-black hover:text-white transition-all items-center justify-center shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export function ProgramListPage({
  programSlug,
  title,
  subtitle,
  heroImage,
}: {
  programSlug: string;
  title: string;
  subtitle: string;
  heroImage: string;
}) {
  const { t } = useLanguage();
  const { items, loading } = useContentByProgram(programSlug);

  const isKinoMas = programSlug === 'kinomas';
  const isCartoons = programSlug === 'cartoons';
  const isWorks = programSlug === 'works';

  /*
   * KinoMas / Cartoons:
   *
   * Both programs use the same content structure:
   * - movies
   * - series
   * - sponsor block
   *
   * The difference is only the programSlug.
   *
   * KinoMas -> films and series
   * Cartoons -> only cartoons
   */

  const movies = items.filter(
    (item) =>
      item.type === 'movie' &&
      item.categorySlug !== 'series'
  );

  const series = items.filter(
    (item) =>
      item.type === 'episode' ||
      item.categorySlug === 'series'
  );

  /*
   * Works:
   * Group published work items by categorySlug.
   *
   * Example:
   * commercial -> [work1, work2, work3]
   * music-video -> [work4, work5]
   * short-film -> [work6, work7, work8]
   */
  const worksByCategory = items.reduce<Record<string, ContentItem[]>>(
    (groups, item) => {
      const category = item.categorySlug?.trim();

      if (!category) {
        return groups;
      }

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);

      return groups;
    },
    {}
  );

  const sponsorId = items.find((item) => item.sponsorId)?.sponsorId;

  const sponsor = useSponsorById(
    isKinoMas || isCartoons ? sponsorId : undefined
  );

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
            {title}
          </h1>

          <p className="text-lg text-white/60 max-w-2xl">
            {subtitle}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading ? (
            <div className="flex gap-4 lg:gap-6 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="
                    flex-none
                    w-[68vw]
                    sm:w-[38vw]
                    md:w-[27vw]
                    lg:w-[20vw]
                    max-w-[280px]
                    aspect-[2/3]
                    rounded-xl
                    bg-zinc-900/50
                    border border-white/5
                    animate-pulse
                  "
                />
              ))}
            </div>
          ) : isKinoMas ? (
            <>
              {/* KINOMAS — FILMS */}
              <ContentCarousel
                title="KinoMas — Ֆիլմեր"
                items={movies}
              />

              {/* KINOMAS — SERIES */}
              <ContentCarousel
                title="KinoMas — Սերիալներ"
                items={series}
              />

              {/* KINOMAS — SPONSOR */}
              <SponsorBlock sponsor={sponsor} />

              {!movies.length && !series.length && (
                <p className="text-center text-white/40 py-20">
                  {t('common.noContent')}
                </p>
              )}
            </>
          ) : isCartoons ? (
            <>
              {/* CARTOONS */}
              <ContentCarousel
                title="Մուլտֆիլմեր"
                items={items}
              />

              {/* CARTOONS — SPONSOR */}
              <SponsorBlock sponsor={sponsor} />

              {!items.length && (
                <p className="text-center text-white/40 py-20">
                  {t('common.noContent')}
                </p>
              )}
            </>
          ) : isWorks ? (
            <>
              {Object.entries(worksByCategory).map(
                ([category, categoryItems]) => (
                  <ContentCarousel
                    key={category}
                    title={category}
                    items={categoryItems}
                  />
                )
              )}

              {!Object.keys(worksByCategory).length && (
                <p className="text-center text-white/40 py-20">
                  {t('common.noContent')}
                </p>
              )}
            </>
          ) : (
            /* Existing layout for other programs */
            items.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {items.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-center text-white/40 py-20">
                {t('common.noContent')}
              </p>
            )
          )}

        </div>
      </section>
    </div>
  );
}