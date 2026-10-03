import en from './en.json';
import de from './de.json';

export const languages = { en: 'English', de: 'Deutsch' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export type Dict = typeof en;
const dict: Record<Lang, Dict> = { en, de };

export function useT(lang: Lang): Dict {
  return dict[lang];
}

/** Site base path without a trailing slash ('' at the root, '/repo' on GitHub Pages). */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Localised URL for a route key ('' = home, 'tebeto' = case study). */
export function localePath(lang: Lang, route = ''): string {
  const tail = route ? `${route}/` : '';
  return lang === defaultLang ? `${base}/${tail}` : `${base}/${lang}/${tail}`;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Tiny inline markup for lang strings: **strong** and *emphasis*. */
export function fmt(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
