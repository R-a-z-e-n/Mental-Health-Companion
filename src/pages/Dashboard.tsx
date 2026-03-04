import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, Globe, Sparkles, Paperclip, X, Mic, MicOff } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "te", name: "Telugu" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
];

const SUGGESTIONS = [
  "I'm feeling anxious",
  "I can't sleep",
  "I feel overwhelmed",
  "I need someone to talk to",
  "How can I manage stress?",
  "I feel lonely",
  "I'm having a panic attack",
  "I feel depressed",
];

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I'm your Mental Health Companion. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const MAX_CHARS = 500;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => {
          const newValue = prev ? `${prev} ${transcript}` : transcript;
          return newValue.slice(0, MAX_CHARS);
        });
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition", err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setInput(value);
      
      if (value.trim().length > 1) {
        const filtered = SUGGESTIONS.filter(s => 
          s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userMessage = input.trim();
    const fileName = selectedFile ? ` [Attached: ${selectedFile.name}]` : "";
    const fullMessage = userMessage + fileName;

    setInput("");
    setSelectedFile(null);
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: "user", content: fullMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      
      const selectedLangName = LANGUAGES.find(l => l.code === language)?.name || "English";

      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [{ text: `You are a compassionate mental health companion. Respond in ${selectedLangName}. User says: ${fullMessage}` }]
          }
        ],
        config: {
          systemInstruction: "You are a supportive, empathetic, and non-judgmental mental health companion. Your goal is to listen, provide comfort, and suggest healthy coping mechanisms. If the user expresses self-harm or severe distress, gently encourage them to seek professional help and provide helpline information. Keep responses concise and warm.",
        }
      });

      const botResponse = response.text || "I'm here for you, but I'm having trouble responding right now. Please try again.";
      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "I'm sorry, I encountered an error. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-32 md:pb-8 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Chat</h1>
          <p className="text-sm text-slate-500">Always here to listen</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <Globe size={16} className="text-brand-500" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-grow bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user" ? "bg-brand-500 text-white" : "bg-white border border-slate-200 text-brand-500 shadow-sm"
                  }`}
                >
                  {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand-500 text-white rounded-tr-none"
                      : "bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-col gap-1">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-brand-500 shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-brand-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-brand-400 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-brand-400 rounded-full"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 ml-11 font-medium italic">Companion is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100 relative">
          {/* Autocomplete Suggestions */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10"
              >
                <div className="p-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Suggestions
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors border-b border-slate-50 last:border-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* File Preview */}
          {selectedFile && (
            <div className="mb-3 flex items-center gap-2 p-2 bg-brand-50 border border-brand-100 rounded-xl">
              <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
                <Paperclip size={14} />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={() => setSelectedFile(null)}
                className="p-1 hover:bg-brand-200 rounded-md transition-colors text-brand-600"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="relative flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 flex-shrink-0 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all"
              title="Attach file"
            >
              <Paperclip size={18} />
            </button>

            <button
              onClick={toggleListening}
              className={`w-10 h-10 flex-shrink-0 border rounded-xl flex items-center justify-center transition-all ${
                isListening 
                  ? "bg-red-50 border-red-200 text-red-500 animate-pulse" 
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              }`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            
            <div className="relative flex-grow">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isListening ? "Listening..." : "Type your message..."}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className={`text-[10px] font-medium ${input.length > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-slate-400'}`}>
                  {input.length}/{MAX_CHARS}
                </span>
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && !selectedFile) || isLoading}
                  className="w-8 h-8 bg-brand-500 text-white rounded-xl flex items-center justify-center hover:bg-brand-600 disabled:opacity-50 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
            <Sparkles size={10} />
            AI can make mistakes. Consider professional help for serious concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
