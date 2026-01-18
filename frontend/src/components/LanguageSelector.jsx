import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // Persist capability is handled by language detector, but we can verify
    };

    return (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md border border-gray-200">
            <Globe className="w-4 h-4 text-green-600" />
            <select
                value={i18n.language.split('-')[0]}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
            >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
