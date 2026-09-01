import { useEffect, useState } from 'react';
import { ArrowRight, ExternalLink, Handshake } from 'lucide-react';
import { Link } from '@/lib/router';
import { useLanguage } from '@/lib/LanguageContext';
import { fetchAllSponsors } from '@/lib/adminApi';
import type { Sponsor } from '@/lib/types';

export function PartnersPage() {
  const { t, lang } = useLanguage();
  const [partners, setPartners] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetchAllSponsors()
      .then((data) => {
        if (mounted) {
          setPartners(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setPartners([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const content = {
    hy: {
      label: 'ԳՈՐԾԸՆԿԵՐՈՒԹՅՈՒՆ',
      title: 'Դարձիր մեր գործընկերը',
      body:
        'Ցանկանո՞ւմ ես դառնալ EvoVision Films-ի գործընկեր։ Կապվիր մեզ հետ և միասին ստեղծենք հետաքրքիր ու արդյունավետ համագործակցություն։',
      button: 'Կապվել մեզ հետ',
      sectionTitle: 'Մեր գործընկերները',
      sectionSubtitle:
        'Շնորհակալ ենք մեր գործընկերներին վստահության և համատեղ աշխատանքի համար։',
      empty: 'Դեռևս գործընկերներ չկան։',
    },

    ru: {
      label: 'ПАРТНЁРСТВО',
      title: 'Стань нашим партнёром',
      body:
        'Хотите стать партнёром EvoVision Films? Свяжитесь с нами, и мы обсудим возможности сотрудничества.',
      button: 'Связаться с нами',
      sectionTitle: 'Наши партнёры',
      sectionSubtitle:
        'Мы благодарны нашим партнёрам за доверие и совместную работу.',
      empty: 'Пока партнёров нет.',
    },

    en: {
      label: 'PARTNERSHIP',
      title: 'Become our partner',
      body:
        'Would you like to become a partner of EvoVision Films? Get in touch with us and let’s discuss collaboration opportunities.',
      button: 'Contact us',
      sectionTitle: 'Our partners',
      sectionSubtitle:
        'We are grateful to our partners for their trust and collaboration.',
      empty: 'There are no partners yet.',
    },
  };

  const currentContent =
    content[lang as keyof typeof content] || content.en;

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Partnership CTA */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950 px-6 py-7 sm:px-10 sm:py-8">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-red-600/10 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-12 h-12 shrink-0 items-center justify-center rounded-xl bg-red-600/15 border border-red-500/20">
                  <Handshake className="w-6 h-6 text-red-500" />
                </div>

                <div>
                  <p className="text-red-500 text-xs font-semibold uppercase tracking-[0.25em] mb-2">
                    {currentContent.label}
                  </p>

                  <h1 className="text-xl sm:text-2xl font-bold mb-2">
                    {currentContent.title}
                  </h1>

                  <p className="text-white/60 text-sm sm:text-base max-w-2xl leading-relaxed">
                    {currentContent.body}
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 px-5 py-3 text-sm font-semibold text-white transition-colors"
              >
                {currentContent.button}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section>
          <div className="mb-8">
            <p className="text-red-500 text-xs font-semibold uppercase tracking-[0.25em] mb-2">
              EvoVision Films
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold">
              {currentContent.sectionTitle}
            </h2>

            <p className="mt-3 text-white/50 max-w-2xl">
              {currentContent.sectionSubtitle}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-44 rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse"
                />
              ))}
            </div>
          ) : partners.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <Handshake className="w-10 h-10 mx-auto mb-4 text-white/20" />

              <p className="text-white/50">
                {currentContent.empty}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {partners.map((partner) => {
                const partnerCard = (
                  <div className="group relative h-44 rounded-2xl border border-white/10 bg-zinc-950 hover:border-red-500/30 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-950/0 via-transparent to-red-950/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative h-full flex flex-col items-center justify-center p-6">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="max-h-20 max-w-[75%] object-contain mb-5 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-5">
                          <Handshake className="w-7 h-7 text-white/30" />
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                        <span>{partner.name}</span>

                        {partner.link && (
                          <ExternalLink className="w-3.5 h-3.5 text-red-500 opacity-70" />
                        )}
                      </div>
                    </div>
                  </div>
                );

                if (partner.link) {
                  return (
                    <a
                      key={partner.id}
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {partnerCard}
                    </a>
                  );
                }

                return (
                  <div key={partner.id}>
                    {partnerCard}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}