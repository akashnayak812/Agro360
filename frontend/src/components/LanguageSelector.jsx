import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES, applyLanguageDirection } from '../i18n';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLang = i18n.language?.split('-')[0] || 'en';
    const currentLangData = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

    const indianLanguages = LANGUAGES.filter(l => l.group === 'indian');
    const internationalLanguages = LANGUAGES.filter(l => l.group === 'international');

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        applyLanguageDirection(lng);
        setIsOpen(false);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    return (
        <div className="relative" ref={dropdownRef} id="language-selector">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-200 group"
                aria-label="Select language"
                aria-expanded={isOpen}
            >
                <Globe className="w-4 h-4 text-gray-600 group-hover:text-agro-green transition-colors" />
                <span className="text-sm font-semibold text-gray-700">
                    {currentLangData.code.toUpperCase()}
                </span>
                <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 w-72 max-h-[70vh] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 border border-gray-200/80 z-[100] custom-scrollbar"
                        style={{ direction: 'ltr' }}
                    >
                        {/* Header */}
                        <div className="px-4 pt-4 pb-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {t('language.selectLanguage')}
                            </p>
                        </div>

                        {/* Indian Languages */}
                        <div className="px-2">
                            <div className="px-2 py-1.5">
                                <span className="text-[10px] font-bold text-agro-green uppercase tracking-widest">
                                    {t('language.indian')}
                                </span>
                            </div>
                            {indianLanguages.map((lang) => (
                                <LanguageOption
                                    key={lang.code}
                                    lang={lang}
                                    isActive={currentLang === lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                />
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="mx-4 my-1 border-t border-gray-100" />

                        {/* International Languages */}
                        <div className="px-2 pb-2">
                            <div className="px-2 py-1.5">
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                                    {t('language.international')}
                                </span>
                            </div>
                            {internationalLanguages.map((lang) => (
                                <LanguageOption
                                    key={lang.code}
                                    lang={lang}
                                    isActive={currentLang === lang.code}
                                    onClick={() => changeLanguage(lang.code)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LanguageOption = ({ lang, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
            isActive
                ? 'bg-agro-green/10 text-agro-darkGreen'
                : 'hover:bg-gray-50 text-gray-700'
        }`}
    >
        <span className="text-lg flex-shrink-0">{lang.flag}</span>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isActive ? 'text-agro-darkGreen' : 'text-gray-800'}`}>
                    {lang.nativeName}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                    {lang.code.toUpperCase()}
                </span>
            </div>
            <span className="text-xs text-gray-400">{lang.name}</span>
        </div>
        {isActive && (
            <Check className="w-4 h-4 text-agro-green flex-shrink-0" />
        )}
    </button>
);

export default LanguageSelector;
