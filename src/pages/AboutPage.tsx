import { Film, Clapperboard, Scissors, Target, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { sampleImages } from '../lib/sampleData';

export function AboutPage() {
  const { t } = useLanguage();

  const programs = [
    { icon: Film, title: t('home.kinomasTitle'), desc: t('home.kinomasBody') },
    { icon: Clapperboard, title: t('home.kadrichTitle'), desc: t('home.kadrichBody') },
    { icon: Scissors, title: t('home.academyTitle'), desc: t('home.academyBody') },
  ];

  return (
    <div>
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={sampleImages.projector} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
            {t('about.title')}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl">{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Brand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-semibold">{t('about.brand')}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-lg text-white/70 leading-relaxed">{t('about.brandBody')}</p>
            </div>
          </div>

          {/* Creator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-12 border-t border-white/10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <User className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-semibold">{t('about.creator')}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-lg text-white/70 leading-relaxed">{t('about.creatorBody')}</p>
            </div>
          </div>

          {/* Mission */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-12 border-t border-white/10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest font-semibold">{t('about.mission')}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-lg text-white/70 leading-relaxed">{t('about.missionBody')}</p>
            </div>
          </div>

          {/* Programs */}
          <div className="pt-12 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-8">{t('about.programs')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map((p) => (
                <div key={p.title} className="p-6 rounded-xl border border-white/10 bg-zinc-900/40 hover:border-white/20 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center mb-4">
                    <p.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
