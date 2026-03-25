import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// RTL languages list
export const RTL_LANGUAGES = ['ur'];

// All supported languages with metadata
export const LANGUAGES = [
    // Indian Languages
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', group: 'indian' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', group: 'indian' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', group: 'indian' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', group: 'indian' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', group: 'indian' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', group: 'indian' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', group: 'indian' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', group: 'indian' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', group: 'indian' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', group: 'indian' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', group: 'indian' },
    // International Languages
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', group: 'international' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', group: 'international' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', group: 'international' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', group: 'international' },
];

// Apply RTL direction based on language
export const applyLanguageDirection = (lng) => {
    const lang = lng?.split('-')[0]; // handle codes like 'en-US'
    const isRTL = RTL_LANGUAGES.includes(lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang || 'en';
};

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: LANGUAGES.map(l => l.code),
        fallbackLng: 'en',
        debug: false,

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },

        backend: {
            loadPath: '/locales/{{lng}}.json',
        },

        interpolation: {
            escapeValue: false, // React already escapes
        },

        react: {
            useSuspense: true,
        },
    });

// Apply direction on initial load
applyLanguageDirection(i18n.language);

// Apply direction whenever language changes
i18n.on('languageChanged', (lng) => {
    applyLanguageDirection(lng);
});

export default i18n;
