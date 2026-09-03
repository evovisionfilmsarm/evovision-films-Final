import { ArrowRight, Film, Clapperboard, Scissors } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { Link } from '../lib/router';
import { ContentCard } from '../components/ContentCard';
import { SectionHeader } from '../components/SectionHeader';
import { sampleImages } from '../lib/sampleData';
import { useFeaturedContent, useContentByProgram } from '../lib/contentHooks';

export function HomePage() {
  const { t } = useLanguage();
  const { items: featured } = useFeaturedContent();
  const { items: kinomasAll } = useContentByProgram('kinomas');
  const { items: kadrichAll } = useContentByProgram('kadrich-durs');
  const { items: academyAll } = useContentByProgram('academy');
  const { items: worksAll } = useContentByProgram('works');
  const kinomasItems = kinomasAll.slice(0, 4);
  const kadrichItems = kadrichAll.slice(0, 3);
  const academyItems = academyAll.slice(0, 3);

  // Group works by categorySlug
  const worksByCategory = worksAll.reduce((acc, work) => {
    const category = work.categorySlug || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(work);
    return acc;
  }, {} as Record<string, typeof worksAll>);

  const programs = [
    { to: '/kinomas', icon: Film, label: t('home.kinomasLabel'), title: t('home.kinomasTitle'), body: t('home.kinomasBody'), cta: t('home.kinomasCta'), image: sampleImages.reel },
    { to: '/kadrich-durs', icon: Clapperboard, label: t('home.kadrichLabel'), title: t('home.kadrichTitle'), body: t('home.kadrichBody'), cta: t('home.kadrichCta'), image: sampleImages.clapper },
    { to: '/academy', icon: Scissors, label: t('home.academyLabel'), title: t('home.academyTitle'), body: t('home.academyBody'), cta: t('home.academyCta'), image: sampleImages.editor },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={sampleImages.hero}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.3em] text-red-500 font-semibold block mb-4">
              EvoVision Films
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6">
              {t('home.heroTitle')}
            </h1>
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/kinomas"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-600/30"
              >
                {t('home.heroCta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-white/5"
              >
                {t('home.heroSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-red-500 font-semibold block mb-3">
              {t('home.introLabel')}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-6 leading-tight">
              {t('home.introTitle')}
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              {t('home.introBody')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-12 lg:py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={t('home.featuredLabel')}
              title={t('home.featuredTitle')}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featured.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Programs */}
      <section className="py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {programs.map((p, i) => (
            <div
              key={p.to}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-950 group">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-70 transition-all duration-500 group-hover:opacity-90 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 w-12 h-12 rounded-lg bg-red-600/90 flex items-center justify-center">
                  <p.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-red-500 font-semibold block mb-2">
                  {p.label}
                </span>
                <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-4">
                  {p.title}
                </h3>
                <p className="text-base text-white/60 leading-relaxed mb-6">
                  {p.body}
                </p>
                <Link
                  to={p.to}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-red-600/50 hover:bg-red-600/10 text-white font-medium rounded-lg transition-all duration-200"
                >
                  {p.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KinoMas preview */}
      {kinomasItems.length > 0 && (
        <section className="py-16 lg:py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={t('home.kinomasLabel')}
              title={t('home.kinomasTitle')}
              to="/kinomas"
              cta={t('home.kinomasCta')}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {kinomasItems.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Kadrich preview */}
      {kadrichItems.length > 0 && (
        <section className="py-16 lg:py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={t('home.kadrichLabel')}
              title={t('home.kadrichTitle')}
              to="/kadrich-durs"
              cta={t('home.kadrichCta')}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {kadrichItems.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Academy preview */}
      {academyItems.length > 0 && (
        <section className="py-16 lg:py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={t('home.academyLabel')}
              title={t('home.academyTitle')}
              to="/academy"
              cta={t('home.academyCta')}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {academyItems.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Works */}
      {Object.keys(worksByCategory).length > 0 && (
        <section className="py-16 lg:py-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              label={t('home.worksLabel')}
              title={t('home.worksTitle')}
            />
            {Object.entries(worksByCategory).map(([category, works]) => (
              <div key={category} className="mb-8 last:mb-0">
                <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                  {category}
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {works.map((work) => (
                    <div key={work.id} className="flex-shrink-0 w-[calc(33.333%-1rem)] min-w-[250px]">
                      <ContentCard item={work} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About preview */}
      <section className="py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-950">
              <img
                src={sampleImages.camera}
                alt="EvoVision Films"
                loading="lazy"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-red-500 font-semibold block mb-2">
                {t('home.aboutLabel')}
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold text-white tracking-tight mb-4">
                {t('home.aboutTitle')}
              </h3>
              <p className="text-base text-white/60 leading-relaxed mb-6">
                {t('home.aboutBody')}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-red-600/50 hover:bg-red-600/10 text-white font-medium rounded-lg transition-all duration-200"
              >
                {t('home.aboutCta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-widest text-red-500 font-semibold block mb-3">
            {t('home.contactLabel')}
          </span>
          <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
            {t('home.contactTitle')}
          </h3>
          <p className="text-lg text-white/60 leading-relaxed mb-8">
            {t('home.contactBody')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-600/30"
          >
            {t('nav.contact')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
