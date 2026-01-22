import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Loader2, X } from 'lucide-react';
import { cn } from '../lib/utils';

// Language codes for speech recognition
const LANGUAGES = {
    'en': { code: 'en-IN', name: 'English', localName: 'English' },
    'hi': { code: 'hi-IN', name: 'Hindi', localName: 'हिंदी' },
    'te': { code: 'te-IN', name: 'Telugu', localName: 'తెలుగు' },
    'ta': { code: 'ta-IN', name: 'Tamil', localName: 'தமிழ்' },
    'mr': { code: 'mr-IN', name: 'Marathi', localName: 'मराठी' },
    'kn': { code: 'kn-IN', name: 'Kannada', localName: 'ಕನ್ನಡ' },
    'gu': { code: 'gu-IN', name: 'Gujarati', localName: 'ગુજરાતી' },
    'bn': { code: 'bn-IN', name: 'Bengali', localName: 'বাংলা' },
    'pa': { code: 'pa-IN', name: 'Punjabi', localName: 'ਪੰਜਾਬੀ' }
};

// Word mappings from regional languages to app values
const VOICE_MAPPINGS = {
    // Soil types
    'black soil': 'black_sticky',
    'काली मिट्टी': 'black_sticky',
    'నల్ల మట్టి': 'black_sticky',
    'கருப்பு மண்': 'black_sticky',
    'red soil': 'red_sandy',
    'लाल मिट्टी': 'red_sandy',
    'ఎర్ర మట్టి': 'red_sandy',
    'brown soil': 'brown_loamy',
    'भूरी मिट्टी': 'brown_loamy',
    'loamy': 'brown_loamy',
    'yellow soil': 'yellow_clay',
    'पीली मिट्टी': 'yellow_clay',
    'river soil': 'alluvial',
    'नदी मिट्टी': 'alluvial',
    
    // Water levels
    'very less water': 'very_less',
    'बहुत कम पानी': 'very_less',
    'less water': 'less',
    'कम पानी': 'less',
    'normal water': 'normal',
    'सामान्य पानी': 'normal',
    'good water': 'good',
    'अच्छा पानी': 'good',
    'heavy rain': 'heavy',
    'भारी बारिश': 'heavy',
    
    // Crops
    'rice': 'Rice',
    'चावल': 'Rice',
    'धान': 'Rice',
    'వరి': 'Rice',
    'wheat': 'Wheat',
    'गेहूं': 'Wheat',
    'cotton': 'Cotton',
    'कपास': 'Cotton',
    'పత్తి': 'Cotton',
    'sugarcane': 'Sugarcane',
    'गन्ना': 'Sugarcane',
    'చెరుకు': 'Sugarcane',
    'maize': 'Maize',
    'मक्का': 'Maize',
    'మొక్కజొన్న': 'Maize',
    'groundnut': 'Groundnut',
    'मूंगफली': 'Groundnut',
    'వేరుశెనగ': 'Groundnut'
};

const VoiceInput = ({ 
    onResult, 
    placeholder = "Click mic and speak...",
    language = 'en',
    className 
}) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            setError('Voice input not supported in your browser. Try Chrome or Edge.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = LANGUAGES[selectedLanguage]?.code || 'en-IN';

        recognition.onstart = () => {
            setIsListening(true);
            setError('');
        };

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const result = event.results[current];
            const text = result[0].transcript;
            
            setTranscript(text);
            
            if (result.isFinal) {
                // Process the final transcript
                processVoiceInput(text);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setError(getErrorMessage(event.error));
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [selectedLanguage]);

    const getErrorMessage = (error) => {
        switch (error) {
            case 'no-speech':
                return 'No speech detected. Please try again.';
            case 'audio-capture':
                return 'Microphone not found. Please check your device.';
            case 'not-allowed':
                return 'Microphone access denied. Please allow microphone access.';
            default:
                return 'Could not understand. Please try again.';
        }
    };

    const processVoiceInput = (text) => {
        const lowerText = text.toLowerCase().trim();
        
        // Check if text matches any known mapping
        const mappedValue = VOICE_MAPPINGS[lowerText] || VOICE_MAPPINGS[text];
        
        if (onResult) {
            onResult({
                raw: text,
                mapped: mappedValue,
                language: selectedLanguage
            });
        }
    };

    const startListening = () => {
        if (recognitionRef.current) {
            setTranscript('');
            setError('');
            try {
                recognitionRef.current.lang = LANGUAGES[selectedLanguage]?.code || 'en-IN';
                recognitionRef.current.start();
            } catch (e) {
                console.error('Error starting recognition:', e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Language selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Speak in:</span>
                <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                    {Object.entries(LANGUAGES).map(([key, lang]) => (
                        <option key={key} value={key}>
                            {lang.localName}
                        </option>
                    ))}
                </select>
            </div>

            {/* Voice input button */}
            <div className="flex items-center gap-3">
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isListening ? stopListening : startListening}
                    className={cn(
                        "relative p-4 rounded-full transition-all duration-200",
                        isListening
                            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                            : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                    )}
                >
                    {/* Pulse animation when listening */}
                    {isListening && (
                        <motion.div
                            className="absolute inset-0 rounded-full bg-red-500"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                    
                    {isListening ? (
                        <MicOff size={24} className="relative z-10" />
                    ) : (
                        <Mic size={24} className="relative z-10" />
                    )}
                </motion.button>

                <div className="flex-1">
                    <div className={cn(
                        "p-3 rounded-xl border-2 min-h-[48px] flex items-center",
                        isListening 
                            ? "border-emerald-300 bg-emerald-50" 
                            : "border-gray-200 bg-gray-50"
                    )}>
                        {isListening ? (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <Loader2 size={16} className="animate-spin" />
                                <span>{transcript || 'Listening...'}</span>
                            </div>
                        ) : transcript ? (
                            <span className="text-gray-700">{transcript}</span>
                        ) : (
                            <span className="text-gray-400">{placeholder}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-2 bg-red-50 text-red-600 rounded-lg text-sm"
                    >
                        <X size={16} />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tips */}
            <div className="text-xs text-gray-500 space-y-1">
                <p>💡 Say things like:</p>
                <ul className="list-disc list-inside pl-2 space-y-0.5">
                    <li>"Black soil" / "काली मिट्टी" / "నల్ల మట్టి"</li>
                    <li>"Good water" / "अच्छा पानी"</li>
                    <li>"Rice" / "चावल" / "వరి"</li>
                </ul>
            </div>
        </div>
    );
};

// Text-to-Speech component for reading out results
const SpeakResult = ({ text, language = 'en' }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speak = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = LANGUAGES[language]?.code || 'en-IN';
            utterance.rate = 0.9;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            window.speechSynthesis.speak(utterance);
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isSpeaking ? stop : speak}
            className={cn(
                "p-2 rounded-full transition-all duration-200",
                isSpeaking
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            )}
            title={isSpeaking ? "Stop" : "Read aloud"}
        >
            <Volume2 size={18} />
        </motion.button>
    );
};

export default VoiceInput;
export { SpeakResult, LANGUAGES, VOICE_MAPPINGS };
