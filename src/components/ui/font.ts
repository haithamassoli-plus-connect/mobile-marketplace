import { isRTL } from '@/lib/i18n';

// Arabic → IBM Plex Sans Arabic, else Noto Sans. The app force-reloads on language
// change (lib/i18n changeLanguage), so resolving once at load is correct for the
// whole session.
// ponytail: 'ar' is the only RTL locale today; if a non-Arabic RTL language is
// added, switch this to an explicit i18n.language check.
export const FONT_CLASS = isRTL ? 'font-arabic' : 'font-sans';
