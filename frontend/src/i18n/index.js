import en from './en.json';
import es from './es.json';
import zhHans from './zh-Hans.json';
import ar from './ar.json';
import fr from './fr.json';
import pt from './pt.json';
import de from './de.json';
import hi from './hi.json';

export const translations = {
  en,
  es,
  'zh-Hans': zhHans,
  ar,
  fr,
  pt,
  de,
  hi
};

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];

export const rtlLanguages = ['ar'];

export function detectLanguage() {
  // Check localStorage first
  const stored = localStorage.getItem('breatheasy-language');
  if (stored && translations[stored]) {
    return stored;
  }
  
  // Auto-detect from browser
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  
  // Match exact
  if (translations[browserLang]) {
    return browserLang;
  }
  
  // Match language code (e.g., 'zh' -> 'zh-Hans')
  const langCode = browserLang.split('-')[0];
  if (langCode === 'zh') return 'zh-Hans';
  if (translations[langCode]) return langCode;
  
  return 'en';
}

export function getTranslation(lang, path, params = {}) {
  const keys = path.split('.');
  let value = translations[lang] || translations.en;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      // Fallback to English
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
      break;
    }
  }
  
  if (typeof value === 'string' && params) {
    // Replace {{param}} with values
    return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || '');
  }
  
  return value || path;
}

export function isRtl(lang) {
  return rtlLanguages.includes(lang);
}
