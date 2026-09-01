import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Language } from './types';
import { defaultLanguage } from './languages';
import { translate, type TranslationKey } from './translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'evovision-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return defaultLanguage;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    return stored ?? defaultLanguage;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Language) => setLangState(l);
  const t = (key: TranslationKey) => translate(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
