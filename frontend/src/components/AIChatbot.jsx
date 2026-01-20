import { useState, useRef, useEffect } from 'react';
import { Send, Minimize2, Maximize2, X, Trash2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your Agro360 AI assistant. Ask me anything about farming, crops, or agriculture!' }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const chatContainerRef = useRef(null);
  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.chat-header')) {
      setIsDragging(true);
      const rect = chatbotRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - chatbotRef.current.offsetWidth;
      const maxY = window.innerHeight - chatbotRef.current.offsetHeight;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/chatbot/chat', {
        message: userMessage,
        language: 'en'
      });

      if (response.data.success) {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: response.data.response
        }]);

        // Text-to-Speech
        const utterance = new SpeechSynthesisUtterance(response.data.response);
        window.speechSynthesis.speak(utterance);

      } else {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I\'m having trouble connecting. Please check if the server is running.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await axios.post('http://localhost:5001/api/chatbot/clear');
      setMessages([
        { type: 'bot', text: 'Chat cleared! How can I help you today?' }
      ]);
    } catch (error) {
      console.error('Clear chat error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isClosed) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsClosed(false)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 transition-all z-50"
      >
        <MessageCircle size={28} />
      </motion.button>
    );
  }

  return (
    <motion.div
      ref={chatbotRef}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: 1000
      }}
      onMouseDown={handleMouseDown}
      className="select-none"
    >
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all ${isMinimized ? 'w-80' : 'w-96'
        }`}>
        {/* Header */}
        <div className="chat-header bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-t-2xl cursor-grab active:cursor-grabbing flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-bold text-lg">Agro360 AI Assistant</h3>
              <p className="text-xs text-green-100">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button
              onClick={() => setIsClosed(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        {!isMinimized && (
          <>
            <div
              ref={chatContainerRef}
              className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
              style={{ scrollbarWidth: 'thin' }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${msg.type === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about farming, crops, diseases..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={20} />
                </button>
                <button
                  onClick={() => {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                      const recognition = new SpeechRecognition();
                      recognition.lang = 'en-US';
                      recognition.start();
                      recognition.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        setInput(transcript);
                      };
                      recognition.onerror = (e) => console.error("Speech error:", e);
                    } else {
                      alert("Voice input not supported in this browser.");
                    }
                  }}
                  className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-green-100 hover:text-green-600 transition-colors"
                  title="Speak"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Drag the header to move • Press Enter to send
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AIChatbot;
