import type { Language } from './types';

export const languages: { code: Language; label: string; short: string }[] = [
  { code: 'hy', label: 'Հայերեն', short: 'HY' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'en', label: 'English', short: 'EN' },
];

export const defaultLanguage: Language = 'hy';
