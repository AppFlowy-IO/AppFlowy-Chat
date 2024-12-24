import { useTranslation as useReactI18next } from 'react-i18next';
import { getI18n } from '@/i18n/config';

export function changeLanguage(lang: string) {
  const i18n = getI18n();
  if (!i18n) throw new Error('i18n not initialized');
  return i18n.changeLanguage(lang);
}

export function addResourceBundle(lang: string, _ns: string, resources: Record<string, string>) {
  const i18n = getI18n();
  if (!i18n) throw new Error('i18n not initialized');
  const isExist = i18n.hasResourceBundle(lang, 'chat');
  if (isExist) return;
  i18n.addResourceBundle(lang, 'chat', resources, true, true);
}

export const useTranslation: typeof useReactI18next = (_, options) => {
  const i18n = getI18n();
  if (!i18n) throw new Error('i18n not initialized');
  return useReactI18next('chat', { ...options, i18n });
};