import { Send, Instagram, Youtube, Mail } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { sampleImages } from '../lib/sampleData';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export function ContactPage() {
  const { t } = useLanguage();

  const contacts = [
    { icon: Send, label: t('contact.telegram'), value: '@evovisionfilms', url: 'https://t.me/evovisionfilmsarm' },
    { icon: Instagram, label: t('contact.instagram'), value: '@evovisionfilms', url: 'https://instagram.com/evovisionfilms' },
    { icon: Youtube, label: t('contact.youtube'), value: '@evovisionfilms', url: 'https://youtube.com/@evovisionfilms' },
    { icon: TikTokIcon, label: 'TikTok', value: '@evovisionfilms', url: 'https://www.tiktok.com/@evovisionfilms' },
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
