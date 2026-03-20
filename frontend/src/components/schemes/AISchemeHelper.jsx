import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { API_URL } from '../../lib/api';

const AISchemeHelper = ({ scheme }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const QUICK_QUESTIONS = [
    `Am I eligible for ${scheme.name}?`,
    `What documents do I need for ${scheme.name}?`,
    `How long does ${scheme.name} approval take?`,
    `Can tenant farmers apply for ${scheme.name}?`,
  ];

  const askQuestion = async (question) => {
    if (!question.trim()) return;

    const userMsg = { role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/schemes/ai-help`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheme_id: scheme.id,
          scheme_name: scheme.name,
          scheme_details: JSON.stringify({
            name: scheme.name,
            fullName: scheme.fullName,
            benefit: scheme.benefit,
            eligibility: scheme.eligibility,
            howToApply: scheme.howToApply,
            documents: scheme.documents,
            helpline: scheme.helpline,
            applyLink: scheme.applyLink,
          }),
          question,
          language: 'en',
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'ai',
          text: data.answer || data.response,
          keyPoints: data.key_points,
          nextStep: data.next_step,
          helpline: data.helpline,
        }]);
      } else {
        throw new Error(data.error || 'Failed');
      }
    } catch {
      // Fallback: provide helpful info from the scheme data itself
      const fallback = `Here's what I know about **${scheme.name}**:\n\n` +
        `**Benefit:** ${scheme.benefit}\n\n` +
        `**Eligibility:** ${scheme.eligibility.join(', ')}\n\n` +
        `**How to Apply:** ${scheme.howToApply[0]}\n\n` +
        `📞 Call free helpline: **${scheme.helpline}** for personalized help.`;

      setMessages(prev => [...prev, {
        role: 'ai',
        text: fallback,
      }]);
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-80">
      <p className="text-sm text-gray-500 mb-3">
        🤖 Ask anything about <strong>{scheme.name}</strong> — I'll explain in simple language
      </p>

      {/* Quick Questions */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => askQuestion(q)}
              className="text-xs font-medium bg-[#F5F2E8] text-[#1A3C2B] px-3 py-1.5 rounded-full hover:bg-[#E8B84B]/20 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'ai' && (
              <div className="shrink-0 w-7 h-7 rounded-full bg-[#2C6E49] flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              msg.role === 'user'
                ? 'bg-[#2C6E49] text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-700 rounded-bl-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.keyPoints && msg.keyPoints.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {msg.keyPoints.map((p, j) => (
                    <li key={j} className="text-xs flex items-start gap-1">
                      <span>•</span>{p}
                    </li>
                  ))}
                </ul>
              )}
              {msg.nextStep && (
                <p className="mt-2 text-xs font-medium border-t border-gray-200 pt-1.5">
                  👉 Next: {msg.nextStep}
                </p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="shrink-0 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={14} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={14} className="animate-spin" /> Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && askQuestion(input)}
          placeholder={`Ask about ${scheme.name}...`}
          className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#78C850]/50"
          disabled={loading}
        />
        <button
          onClick={() => askQuestion(input)}
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-[#2C6E49] text-white rounded-xl hover:bg-[#1A3C2B] transition-colors disabled:opacity-50"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default AISchemeHelper;
