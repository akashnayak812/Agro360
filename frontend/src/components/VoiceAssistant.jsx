import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Activity, Globe, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';

const LANGUAGES = [
    { code: 'en-US', label: 'English', name: 'English' },
    { code: 'hi-IN', label: 'Hindi', name: 'हिन्दी' },
    { code: 'te-IN', label: 'Telugu', name: 'తెలుగు' },
    { code: 'ta-IN', label: 'Tamil', name: 'தமிழ்' },
    { code: 'kn-IN', label: 'Kannada', name: 'kannada' },
    { code: 'ml-IN', label: 'Malayalam', name: 'Malayalam' },
    { code: 'pa-IN', label: 'Punjabi', name: 'Punjabi' }
];

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [showLangMenu, setShowLangMenu] = useState(false);

    const recognitionRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = selectedLang;

            recognitionRef.current.onstart = () => setIsListening(true);
            recognitionRef.current.onend = () => setIsListening(false);

            recognitionRef.current.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                processCommand(text);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
        } else {
            console.warn("Web Speech API not supported.");
        }
    }, [selectedLang]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            setResponse('');
            // Ensure lang is set
            recognitionRef.current.lang = selectedLang;
            recognitionRef.current.start();
        }
    };

    const processCommand = async (text) => {
        setIsProcessing(true);
        try {
            const res = await fetch('http://localhost:5001/api/voice/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    language: selectedLang
                })
            });
            const data = await res.json();

            if (data.success) {
                setResponse(data.response);
                speakResponse(data.response);
                handleIntent(data);
            } else {
                setResponse("Sorry, I didn't catch that. Please try again.");
                speakResponse("Sorry, I didn't catch that.");
            }
        } catch (error) {
            console.error("Voice processing error:", error);
            setResponse("Error connecting to Agro AI.");
            speakResponse("Error connecting to Agro AI.");
        }
        setIsProcessing(false);
    };

    const handleIntent = (data) => {
        if (data.intent && data.intent.startsWith('navigate_')) {
            const target = data.target || '/';
            window.location.href = target;
        }
    };

    const speakResponse = (text) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLang;

        // Try to find a matching voice for better quality
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(v => v.lang === selectedLang || v.lang.startsWith(selectedLang.split('-')[0]));
        if (matchingVoice) utterance.voice = matchingVoice;

        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {(transcript || response || showLangMenu) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl max-w-sm border border-agro-green/20"
                    >
                        {showLangMenu ? (
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Select Language</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setSelectedLang(lang.code);
                                                setShowLangMenu(false);
                                                // Give feedback
                                                speakResponse(`Switched to ${lang.label}`);
                                            }}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-2 ${selectedLang === lang.code
                                                    ? 'bg-agro-green text-white shadow-md'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <span className="text-xs opacity-70">{lang.code.split('-')[0].toUpperCase()}</span>
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-agro-green bg-green-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                        Agro Assistant
                                    </span>
                                    <button onClick={() => setResponse('')} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                                </div>

                                {transcript && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-xl rounded-tr-none text-right">
                                        <p className="text-gray-600 text-sm">"{transcript}"</p>
                                    </div>
                                )}

                                {isProcessing && (
                                    <div className="flex items-center gap-2 text-agro-green font-medium text-sm animate-pulse mb-2">
                                        <Activity className="w-4 h-4" />
                                        Consulting agricultural data...
                                    </div>
                                )}

                                {response && !isProcessing && (
                                    <div className="flex gap-3 items-start">
                                        <div className="p-3 bg-gradient-to-br from-agro-green to-agro-darkGreen text-white rounded-xl rounded-tl-none shadow-sm">
                                            <p className="text-sm leading-relaxed">{response}</p>
                                        </div>
                                        <button onClick={() => speakResponse(response)} className="mt-2 text-gray-400 hover:text-agro-green">
                                            <Volume2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="p-3 bg-white text-gray-600 rounded-full shadow-lg border border-gray-100 hover:text-agro-green transition-colors"
                >
                    <Globe size={20} />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleListening}
                    className={`p-4 rounded-full shadow-2xl transition-all flex items-center justify-center ${isListening
                        ? 'bg-red-500 text-white ring-4 ring-red-200 animate-pulse-slow'
                        : 'bg-gradient-to-r from-agro-green to-agro-darkGreen text-white ring-4 ring-green-100'
                        }`}
                >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>
            </div>
        </div>
    );
};

export default VoiceAssistant;
