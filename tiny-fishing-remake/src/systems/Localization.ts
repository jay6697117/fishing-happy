import { saveManager } from '@/systems/SaveManager';

type TranslationTable = Record<string, Record<string, string>>;

let translations: TranslationTable = {};
let availableLanguages: string[] = [];
let currentLanguage = 'EN';

function normalizeLanguage(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  return normalized.length > 0 ? normalized : null;
}

function detectBrowserLanguage(): string | null {
  if (typeof navigator === 'undefined') return null;
  const lang = normalizeLanguage(navigator.language);
  if (!lang) return null;
  if (lang.startsWith('RU')) return 'RU';
  return 'EN';
}

function setLanguageInternal(language: string, persist: boolean): void {
  currentLanguage = language;
  if (persist) {
    saveManager.update({ language });
  }
}

export function initializeLocalization(csvText: string, preferredLanguage?: string): void {
  translations = {};
  availableLanguages = [];
  currentLanguage = 'EN';

  const lines = csvText.split(/\r?\n/).filter((line) => line.length > 0);
  for (const line of lines) {
    const cells = line.split(';');
    const key = cells[0];
    if (!key) continue;

    if (key === 'Language_short_name') {
      availableLanguages = cells
        .slice(1)
        .map((value) => value.replace(/\r/g, ''))
        .map((value) => value.trim())
        .filter((value) => value.length > 0);
      continue;
    }

    if (availableLanguages.length === 0) continue;
    availableLanguages.forEach((lang, index) => {
      const value = (cells[index + 1] ?? '').replace(/\r/g, '');
      if (!translations[lang]) {
        translations[lang] = {};
      }
      translations[lang][key] = value;
    });
  }

  const normalizedPreferred = normalizeLanguage(preferredLanguage);
  const preferred = normalizedPreferred && availableLanguages.includes(normalizedPreferred)
    ? normalizedPreferred
    : null;

  const browser = detectBrowserLanguage();
  const fallback = availableLanguages[0] ?? 'EN';
  const resolved = preferred ?? browser ?? fallback;

  setLanguageInternal(resolved, true);
}

export function getAvailableLanguages(): string[] {
  return [...availableLanguages];
}

export function getCurrentLanguage(): string {
  return currentLanguage;
}

export function setLanguage(language: string): void {
  const normalized = normalizeLanguage(language);
  if (!normalized) return;
  if (!availableLanguages.includes(normalized)) return;
  setLanguageInternal(normalized, true);
}

export function t(key: string, fallback?: string): string {
  const value =
    translations[currentLanguage]?.[key] ??
    translations.EN?.[key] ??
    fallback ??
    key;
  return value.replace(/#/g, '\n');
}
