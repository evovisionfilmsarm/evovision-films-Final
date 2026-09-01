import { Send, Instagram, Youtube, Mail } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { sampleImages } from '@/lib/sampleData';

export function ContactPage() {
  const { t } = useLanguage();

  const contacts = [
    { icon: Send, label: t('contact.telegram'), value: '@evovisionfilms', url: 'https://t.me/evovisionfilmsarm' },
    { icon: Instagram, label: t('contact.instagram'), value: '@evovisionfilms', url: 'https://instagram.com/evovisionfilms' },
    { icon: Youtube, label: t('contact.youtube'), value: '@evovisionfilms', url: 'https://youtube.com/@evovisionfilms' },
    { icon: Mail, label: t('contact.email'), value: 'contact@evovisionfilms.com', url: 'mailto:evovisionfilms@gmail.com' },
  ];

  return (
    <div>
      <section className="relative h-[40vh] min-h-[280px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={sampleImages.editor} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-white/60 max-w-2xl">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-white mb-8">{t('contact.follow')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-xl border border-white/10 bg-zinc-900/40 hover:border-red-600/40 hover:bg-red-600/5 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-lg bg-red-600/15 flex items-center justify-center group-hover:bg-red-600/25 transition-colors">
                  <c.icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/40 mb-0.5">{c.label}</div>
                  <div className="text-sm text-white font-medium">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
