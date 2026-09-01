import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { languages } from '@/lib/languages';
import { Link, useRouter } from '@/lib/router';
import type { Language } from '@/lib/types';

const navItems = [
  { to: '/', key: 'nav.home' as const },
  { to: '/kinomas', key: 'nav.kinomas' as const },
  { to: '/kadrich-durs', key: 'nav.kadrichDurs' as const },
  { to: '/academy', key: 'nav.academy' as const },
  { to: '/works', key: 'nav.works' as const },
  { to: '/partners', key: 'nav.sponsors' as const },
  { to: '/about', key: 'nav.about' as const },
  { to: '/contact', key: 'nav.contact' as const },
];

export function Header() {
  const { t, lang, setLang } = useLanguage();
  const route = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isActive = (to: string) => {
    if (to === '/') return route.path === '/';
    return route.path.startsWith(to);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/brand/evovision_spitak_karmir.png"
              alt="EvoVision Films"
              className="h-9 lg:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200 relative ${
                  isActive(item.to)
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {t(item.key)}

                {isActive(item.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-px bg-red-600" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-white/70 hover:text-white transition-colors"
                aria-label="Language"
              >
                <Globe className="w-4 h-4" />

                <span className="hidden sm:inline">
                  {languages.find((l) => l.code === lang)?.short}
                </span>
              </button>

              {langOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangOpen(false)}
                  />

                  <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code as Language);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          lang === l.code
                            ? 'bg-red-600/20 text-white'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-lg">
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive(item.to)
                    ? 'bg-red-600/15 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}