import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Volume2,
    VolumeX,
    Pause,
    Play,
    SkipForward,
    SkipBack,
    Settings,
    Globe,
    Mic,
    X,
    ChevronDown,
    Eye,
    EyeOff,
    Accessibility,
    HelpCircle
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
    { code: 'en-IN', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' }
];

const ReadAloudButton = ({ text, className = '' }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { i18n } = useTranslation();

    const speak = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            
            if (isSpeaking) {
                setIsSpeaking(false);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'te' ? 'te-IN' : 'en-IN';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            // Try to find matching voice
            const voices = window.speechSynthesis.getVoices();
            const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
            if (matchingVoice) utterance.voice = matchingVoice;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <button
            onClick={speak}
            className={`p-2 rounded-lg transition-all ${
                isSpeaking 
                    ? 'bg-green-100 text-green-600 animate-pulse' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            } ${className}`}
            title={isSpeaking ? 'Stop Reading' : 'Read Aloud'}
        >
            {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
    );
};

// Global Accessibility Widget
const AccessibilityWidget = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState({
        readAloudEnabled: true,
        autoReadEnabled: false,
        speechRate: 1,
        language: 'en-IN',
        highContrast: false,
        largeText: false,
        dyslexiaFont: false
    });
    const [isReading, setIsReading] = useState(false);
    const [currentText, setCurrentText] = useState('');
    const utteranceRef = useRef(null);

    // Apply accessibility settings
    useEffect(() => {
        if (settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }

        if (settings.largeText) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }

        if (settings.dyslexiaFont) {
            document.body.classList.add('dyslexia-font');
        } else {
            document.body.classList.remove('dyslexia-font');
        }
    }, [settings]);

    // Read page content aloud
    const readPageContent = useCallback(() => {
        if (!settings.readAloudEnabled || !('speechSynthesis' in window)) return;

        // Get main content text
        const mainContent = document.querySelector('main') || document.body;
        const textElements = mainContent.querySelectorAll('h1, h2, h3, p, button, label, td, th');
        
        let fullText = '';
        textElements.forEach(el => {
            if (el.textContent && el.offsetParent !== null) { // visible elements only
                fullText += el.textContent + '. ';
            }
        });

        speakText(fullText);
    }, [settings.readAloudEnabled, settings.language, settings.speechRate]);

    const speakText = (text) => {
        if (!('speechSynthesis' in window)) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = settings.language;
        utterance.rate = settings.speechRate;
        utterance.pitch = 1;

        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(v => v.lang === settings.language || v.lang.startsWith(settings.language.split('-')[0]));
        if (matchingVoice) utterance.voice = matchingVoice;

        utterance.onstart = () => {
            setIsReading(true);
            setCurrentText(text.substring(0, 100) + '...');
        };
        utterance.onend = () => {
            setIsReading(false);
            setCurrentText('');
        };
        utterance.onerror = () => {
            setIsReading(false);
            setCurrentText('');
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const stopReading = () => {
        window.speechSynthesis.cancel();
        setIsReading(false);
        setCurrentText('');
    };

    const pauseReading = () => {
        if (window.speechSynthesis.speaking) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            } else {
                window.speechSynthesis.pause();
            }
        }
    };

    // Read selected text on double-click
    useEffect(() => {
        if (!settings.autoReadEnabled) return;

        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection?.toString().trim();
            if (text && text.length > 0) {
                speakText(text);
            }
        };

        document.addEventListener('dblclick', handleSelection);
        return () => document.removeEventListener('dblclick', handleSelection);
    }, [settings.autoReadEnabled, settings.language, settings.speechRate]);

    return (
        <>
            {/* Floating Accessibility Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-24 left-6 z-50 p-4 rounded-full shadow-lg transition-colors ${
                    isOpen ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50'
                }`}
                title="Accessibility Options"
            >
                <Accessibility size={24} />
            </motion.button>

            {/* Reading Indicator */}
            <AnimatePresence>
                {isReading && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 max-w-md"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Volume2 size={18} className="text-green-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">Reading...</div>
                            <div className="text-xs text-gray-500 truncate">{currentText}</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={pauseReading} className="p-2 hover:bg-gray-100 rounded-lg">
                                <Pause size={16} />
                            </button>
                            <button onClick={stopReading} className="p-2 hover:bg-gray-100 rounded-lg text-red-500">
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Accessibility Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        className="fixed bottom-44 left-6 z-50 bg-white rounded-2xl shadow-2xl p-6 w-80"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Accessibility className="text-green-600" size={20} />
                                Accessibility
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Language Selection */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                    <Globe size={16} />
                                    Voice Language
                                </label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500"
                                >
                                    {SUPPORTED_LANGUAGES.map(lang => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.flag} {lang.name} ({lang.nativeName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Speech Rate */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 flex items-center justify-between mb-2">
                                    <span>Speech Speed</span>
                                    <span className="text-gray-500">{settings.speechRate}x</span>
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={settings.speechRate}
                                    onChange={(e) => setSettings({ ...settings, speechRate: parseFloat(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            {/* Toggle Options */}
                            <div className="space-y-3">
                                <ToggleOption
                                    label="Read Aloud Enabled"
                                    description="Enable voice reading feature"
                                    checked={settings.readAloudEnabled}
                                    onChange={(v) => setSettings({ ...settings, readAloudEnabled: v })}
                                />
                                <ToggleOption
                                    label="Auto-Read Selection"
                                    description="Double-click text to hear it"
                                    checked={settings.autoReadEnabled}
                                    onChange={(v) => setSettings({ ...settings, autoReadEnabled: v })}
                                />
                                <ToggleOption
                                    label="High Contrast"
                                    description="Increase color contrast"
                                    checked={settings.highContrast}
                                    onChange={(v) => setSettings({ ...settings, highContrast: v })}
                                />
                                <ToggleOption
                                    label="Large Text"
                                    description="Increase font size"
                                    checked={settings.largeText}
                                    onChange={(v) => setSettings({ ...settings, largeText: v })}
                                />
                            </div>

                            {/* Read Page Button */}
                            <button
                                onClick={readPageContent}
                                disabled={!settings.readAloudEnabled || isReading}
                                className={`w-full p-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                                    settings.readAloudEnabled
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <Volume2 size={18} />
                                {isReading ? 'Reading...' : 'Read This Page'}
                            </button>

                            {/* Help Text */}
                            <p className="text-xs text-gray-500 text-center">
                                💡 Tip: Double-click any text to hear it read aloud
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

// Toggle Option Component
const ToggleOption = ({ label, description, checked, onChange }) => {
    return (
        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
                <div className="text-sm font-medium text-gray-900">{label}</div>
                <div className="text-xs text-gray-500">{description}</div>
            </div>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                        checked ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                </div>
            </div>
        </label>
    );
};

// Text-to-Speech Wrapper Component
const SpeakableText = ({ children, className = '' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const textRef = useRef(null);

    const handleSpeak = () => {
        if (textRef.current && 'speechSynthesis' in window) {
            const text = textRef.current.textContent;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <span
            ref={textRef}
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
            {isHovered && (
                <button
                    onClick={handleSpeak}
                    className="absolute -right-6 top-1/2 -translate-y-1/2 p-1 bg-green-100 rounded-full text-green-600 hover:bg-green-200 transition-colors"
                    title="Read Aloud"
                >
                    <Volume2 size={12} />
                </button>
            )}
        </span>
    );
};

// Read Aloud Card Component for displaying content with audio option
const ReadAloudCard = ({ title, content, icon: Icon, className = '' }) => {
    const { i18n } = useTranslation();
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = () => {
        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
                return;
            }

            const fullText = `${title}. ${content}`;
            const utterance = new SpeechSynthesisUtterance(fullText);
            utterance.lang = i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'te' ? 'te-IN' : 'en-IN';
            utterance.rate = 0.9;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${className}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    {Icon && (
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <Icon size={20} />
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{content}</p>
                    </div>
                </div>
                <button
                    onClick={speak}
                    className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                        isSpeaking 
                            ? 'bg-green-100 text-green-600 animate-pulse' 
                            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                    }`}
                    title={isSpeaking ? 'Stop' : 'Listen'}
                >
                    {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
            </div>
        </div>
    );
};

// Voice Command Help Modal
const VoiceCommandHelp = ({ isOpen, onClose }) => {
    const commands = [
        { command: 'Go to Dashboard', action: 'Opens the Dashboard page' },
        { command: 'Show Crop Recommendation', action: 'Opens Crop Recommendation' },
        { command: 'Check Weather', action: 'Shows weather advisory' },
        { command: 'What is the price of wheat?', action: 'Provides wheat market price' },
        { command: 'Detect Disease', action: 'Opens Disease Detection' },
        { command: 'Help me with fertilizer', action: 'Opens Fertilizer Guide' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <HelpCircle className="text-green-600" size={24} />
                                Voice Commands
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {commands.map((cmd, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 text-green-600 font-medium">
                                        <Mic size={14} />
                                        "{cmd.command}"
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">{cmd.action}</div>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs text-gray-500 text-center mt-6">
                            💡 Press the microphone button and speak clearly in your preferred language
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Export all components
export { 
    ReadAloudButton, 
    AccessibilityWidget, 
    SpeakableText, 
    ReadAloudCard, 
    VoiceCommandHelp,
    SUPPORTED_LANGUAGES 
};
export default AccessibilityWidget;
