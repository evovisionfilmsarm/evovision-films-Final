import { Send, Instagram, Youtube, Mail } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { Link } from '@/lib/router';

export function Footer() {
  const { t } = useLanguage();

  const socials = [
    { icon: Send, label: 'Telegram', url: 'https://t.me/evovisionfilmsarm' },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com/evovisionfilms' },
    { icon: Youtube, label: 'YouTube', url: 'https://youtube.com/@evovisionfilms' },
    { icon: Mail, label: 'Email', url: 'mailto:evovisionfilms@gmail.com' },
  ];

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/kinomas', label: t('nav.kinomas') },
    { to: '/kadrich-durs', label: t('nav.kadrichDurs') },
    { to: '/academy', label: t('nav.academy') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img
              src="/assets/brand/evovision_spitak_karmir.png"
              alt="EvoVision Films"
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
              {t('nav.home')}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
              {t('contact.follow')}
            </h4>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-red-600/50 hover:bg-red-600/10 transition-all duration-200"
                  aria-label={s.label}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} EvoVision Films. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
