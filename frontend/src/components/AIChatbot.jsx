import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Send, Minimize2, Maximize2, X, Trash2, MessageCircle,
  Mic, MicOff, Volume2, Navigation, Sparkles, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../lib/api';
import { RTL_LANGUAGES } from '../i18n';
import {
  detectNavigationIntent, parseBackendIntent,
  getLanguageCode, getTTSLanguage
} from '../lib/chatbotIntents';

const AIChatbot = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language?.split('-')[0] || 'en';
  const isRTL = RTL_LANGUAGES.includes(currentLang);

  // --- State ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Drag state
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Refs
  const chatContainerRef = useRef(null);
  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // --- Initialize greeting on language change ---
  useEffect(() => {
    setMessages([{
      type: 'bot',
      text: t('chatbot.greeting'),
      timestamp: new Date(),
    }]);
    setShowSuggestions(true);
  }, [currentLang]);

  // --- Auto scroll ---
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // --- Drag handlers ---
  const handleMouseDown = (e) => {
    if (e.target.closest('.chat-header')) {
      setIsDragging(true);
      const rect = chatbotRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      const maxX = window.innerWidth - (chatbotRef.current?.offsetWidth || 400);
      const maxY = window.innerHeight - (chatbotRef.current?.offsetHeight || 500);
      setPosition({
        x: Math.max(0, Math.min(e.clientX - dragOffset.x, maxX)),
        y: Math.max(0, Math.min(e.clientY - dragOffset.y, maxY)),
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // --- Navigation helper ---
  const handleNavigation = useCallback((route, label) => {
    const navMsg = t('chatbot.navigatingTo', { page: label });
    setMessages(prev => [...prev, {
      type: 'bot',
      text: navMsg,
      isNavigation: true,
      route,
      timestamp: new Date(),
    }]);
    setTimeout(() => navigate(route), 800);
  }, [navigate, t]);

  // --- Send message ---
  const sendMessage = async (overrideText) => {
    const userMessage = (overrideText || input).trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { type: 'user', text: userMessage, timestamp: new Date() }]);
    setInput('');
    setShowSuggestions(false);

    // 1. Try client-side navigation intent
    const navIntent = detectNavigationIntent(userMessage);
    if (navIntent) {
      handleNavigation(navIntent.route, navIntent.label);
      return;
    }

    // 2. Fall back to API
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/chatbot/chat`, {
        message: userMessage,
        language: currentLang,
      });

      if (response.data.success) {
        // Check for backend navigation intent
        const backendNav = parseBackendIntent(response.data.intent);
        if (backendNav && response.data.navigation?.route) {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: response.data.response,
            timestamp: new Date(),
          }]);
          handleNavigation(response.data.navigation.route, response.data.navigation.label);
        } else {
          setMessages(prev => [...prev, {
            type: 'bot',
            text: response.data.response,
            timestamp: new Date(),
          }]);
        }
      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: t('chatbot.errorGeneral'),
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: t('chatbot.errorConnect'),
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Clear chat ---
  const clearChat = async () => {
    try {
      await axios.post(`${API_URL}/api/chatbot/clear`);
    } catch (err) {
      console.error('Clear chat error:', err);
    }
    setMessages([{
      type: 'bot',
      text: t('chatbot.cleared'),
      timestamp: new Date(),
    }]);
    setShowSuggestions(true);
  };

  // --- Voice input ---
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getLanguageCode(currentLang);
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = (e) => {
      console.error('Speech error:', e.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // --- Text-to-speech ---
  const speakText = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const ttsLang = getTTSLanguage(currentLang);

    // Try to find a voice matching the language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(ttsLang));
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.lang = getLanguageCode(currentLang);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // --- Key press ---
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- Suggested prompts ---
  const suggestedPrompts = t('chatbot.suggestedPrompts', { returnObjects: true }) || [];

  // --- Closed state: floating button ---
  if (isClosed) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsClosed(false)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all z-50"
        id="chatbot-toggle"
      >
        <MessageCircle size={28} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full" />
      </motion.button>
    );
  }

  // --- Chat window ---
  return (
    <motion.div
      ref={chatbotRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: 1000,
        direction: isRTL ? 'rtl' : 'ltr',
      }}
      onMouseDown={handleMouseDown}
      className="select-none"
      id="chatbot-window"
    >
      <div className={`bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 transition-all overflow-hidden ${
        isMinimized ? 'w-80' : 'w-[420px]'
      }`}>
        {/* ─── Header ─── */}
        <div className="chat-header bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-4 cursor-grab active:cursor-grabbing flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Sparkles size={20} className="text-yellow-200" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-300 rounded-full border-2 border-green-600 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{t('chatbot.title')}</h3>
              <p className="text-[11px] text-green-100/80">{t('chatbot.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clearChat} className="p-2 hover:bg-white/20 rounded-lg transition" title={t('chatbot.clear')}>
              <Trash2 size={16} />
            </button>
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/20 rounded-lg transition">
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button onClick={() => setIsClosed(true)} className="p-2 hover:bg-white/20 rounded-lg transition" title={t('chatbot.close')}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ─── Chat body ─── */}
        {!isMinimized && (
          <>
            <div
              ref={chatContainerRef}
              className="h-[380px] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50/50 to-white"
              style={{ scrollbarWidth: 'thin' }}
            >
              {/* Messages */}
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      {msg.type === 'bot' && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Sparkles size={14} className="text-white" />
                        </div>
                      )}

                      <div className="flex flex-col gap-1">
                        {/* Bubble */}
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            msg.type === 'user'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-md shadow-md shadow-green-500/20'
                              : msg.isNavigation
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-800 rounded-bl-md'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm'
                          }`}
                        >
                          {msg.isNavigation && (
                            <Navigation size={14} className="inline mr-1.5 text-blue-500" />
                          )}
                          <span className="whitespace-pre-wrap">{msg.text}</span>
                        </div>

                        {/* TTS + timestamp for bot messages */}
                        {msg.type === 'bot' && !msg.isNavigation && (
                          <div className="flex items-center gap-2 px-1">
                            <button
                              onClick={() => speakText(msg.text)}
                              className="text-gray-400 hover:text-green-600 transition p-0.5"
                              title={t('chatbot.speakTooltip')}
                            >
                              <Volume2 size={13} />
                            </button>
                            <span className="text-[10px] text-gray-300">
                              {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}

                        {/* Timestamp for user messages */}
                        {msg.type === 'user' && (
                          <div className="flex justify-end px-1">
                            <span className="text-[10px] text-gray-300">
                              {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                      <Sparkles size={14} className="text-white" />
                    </div>
                    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── Suggested prompts ─── */}
            {showSuggestions && Array.isArray(suggestedPrompts) && suggestedPrompts.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-full transition-all hover:shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* ─── Input area ─── */}
            <div className="p-3 border-t border-gray-100 bg-white/80">
              <div className="flex gap-2 items-center">
                {/* Voice button */}
                <button
                  onClick={toggleVoiceInput}
                  className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                    isListening
                      ? 'bg-red-100 text-red-600 animate-pulse shadow-inner'
                      : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'
                  }`}
                  title={t('chatbot.voiceTooltip')}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t('chatbot.placeholder')}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-400 bg-gray-50/50 transition"
                  disabled={isLoading}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />

                {/* Send button */}
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2.5 rounded-xl hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  title={t('chatbot.send')}
                >
                  <Send size={18} />
                </button>
              </div>

              <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                {t('chatbot.dragHint')}
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AIChatbot;
