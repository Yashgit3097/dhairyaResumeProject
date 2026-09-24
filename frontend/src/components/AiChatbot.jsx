import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Minimize2,
  Maximize2,
  Trash2,
  ChevronDown,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
  '📋 How can I build my resume in this app?',
  '💡 Write a 3-sentence summary for my role',
  '🚀 Turn my job notes into STAR bullet points',
  '🎯 What are the top skills for my resume?',
];

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi there! I'm your **Resume Builder AI Assistant**.\n\nI can guide you step-by-step on building your resume in this app, write professional summaries, polish your bullet points, and answer any career questions. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (messageToSend = null) => {
    const text = messageToSend || inputValue;
    if (!text || !text.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 1)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          content: m.text,
        }));

      const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
        message: userMessage.text,
        history: historyPayload,
      });

      if (response.data && response.data.reply) {
        const aiReply = {
          id: Date.now() + 1,
          sender: 'ai',
          text: response.data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiReply]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        'Sorry, I encountered an issue. Please try again.';

      const errorReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `⚠️ **Error:** ${errMsg}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: "✨ Chat cleared! I'm ready to assist you with new resume prompts or app guidance.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Helper to render markdown-like text safely
  const formatText = (content) => {
    if (!content) return '';
    return content
      .split('\n')
      .map((line, i) => {
        let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (line.startsWith('### ')) {
          return <h4 key={i} className="font-bold text-slate-900 mt-2 mb-1" dangerouslySetInnerHTML={{ __html: formattedLine.replace('### ', '') }} />;
        }
        if (line.startsWith('## ')) {
          return <h3 key={i} className="font-bold text-slate-900 text-sm mt-2 mb-1" dangerouslySetInnerHTML={{ __html: formattedLine.replace('## ', '') }} />;
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={i} className="ml-4 list-disc text-slate-700 my-0.5" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[-*]\s/, '') }} />
          );
        }
        if (line.trim() === '') {
          return <div key={i} className="h-1.5" />;
        }
        return <p key={i} className="my-0.5" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>

          <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm group-hover:rotate-12 transition-transform">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
          </div>

          <div className="flex flex-col items-start pr-1 text-left">
            <span className="text-xs font-bold leading-tight">AI Resume Assistant</span>
            <span className="text-[10px] text-purple-200">AI Powered</span>
          </div>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 animate-scaleUp ${
            isMinimized
              ? 'w-80 h-16'
              : 'w-[90vw] sm:w-[410px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white flex items-center justify-between shadow-sm select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot className="w-4 h-4 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  Resume AI Assistant
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-purple-200 font-medium">AI Powered Coach</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-end gap-1.5 max-w-[88%] group">
                      {msg.sender === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mb-1">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl relative shadow-sm ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                            : msg.isError
                            ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-none'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                        }`}
                      >
                        <div className="leading-relaxed font-normal break-words">
                          {formatText(msg.text)}
                        </div>

                        {/* Copy Button on AI responses */}
                        {msg.sender === 'ai' && !msg.isError && (
                          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">{msg.time}</span>
                            <button
                              onClick={() => handleCopyMessage(msg.text, msg.id)}
                              className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-purple-600 bg-slate-100 hover:bg-purple-50 px-2 py-0.5 rounded transition"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <span className="text-[10px] text-slate-400 mt-1 mr-1">{msg.time}</span>
                    )}
                  </div>
                ))}

                {/* Typing / Generating Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-1.5">
                      <span className="text-xs text-purple-600 font-semibold">AI is thinking</span>
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips (when few messages) */}
              {messages.length <= 2 && (
                <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200/60 overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt.replace(/^[^\s]+\s/, ''))}
                      className="text-[11px] font-medium bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 px-2.5 py-1 rounded-full shadow-xs transition shrink-0"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask AI Assistant (e.g. how to build resume)..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-2xl outline-none text-xs text-slate-800 placeholder-slate-400 transition"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-2.5 rounded-2xl text-white shadow-md transition-all ${
                    !inputValue.trim() || isLoading
                      ? 'bg-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
