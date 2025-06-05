import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ArrowRight, User, RefreshCw, Copy, Check } from 'lucide-react';
import { generateResponse } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const BotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm HustleBot, your AI assistant for developer side hustles. How can I help you today? You can ask me for project ideas, tech stack recommendations, or advice on monetizing your skills.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const examplePrompts = [
    "Suggest a micro-SaaS idea based on Notion",
    "What's a good side hustle for a React developer?",
    "Recommend a tech stack for a productivity app",
    "How can I monetize my JavaScript skills?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Create context from previous messages
      const context = messages.map(msg => 
        `${msg.sender === 'user' ? 'User: ' : 'Assistant: '}${msg.content}`
      );

      const response = await generateResponse(userMessage.content, context);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="container mx-auto pb-12 flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-mono font-bold mb-2">HustleBot</h1>
        <p className="text-dark-300">Your AI assistant for developer side hustle ideas and advice</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6">
        {/* Chat UI */}
        <div className="flex-1 bg-dark-800 rounded-lg border border-dark-700 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 relative group ${
                      message.sender === 'user'
                        ? 'bg-hustle-600 text-white rounded-tr-none'
                        : 'bg-dark-700 text-dark-100 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <div className="w-6 h-6 rounded-full bg-hustle-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot size={14} className="text-hustle-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <div className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                    {message.sender === 'bot' && (
                      <button
                        onClick={() => handleCopyMessage(message.id, message.content)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-dark-600"
                      >
                        {copiedId === message.id ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-dark-300" />
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="bg-dark-700 rounded-lg rounded-tl-none p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-hustle-700 flex items-center justify-center">
                        <RefreshCw size={14} className="text-hustle-300 animate-spin" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-dark-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-dark-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-dark-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-dark-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask HustleBot about side hustle ideas..."
                className="flex-1 px-4 py-2 bg-dark-700 border border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={`btn ${
                  isLoading || !inputValue.trim()
                    ? 'bg-dark-600 text-dark-400 cursor-not-allowed'
                    : 'btn-primary neon-glow neon-purple'
                }`}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar with example prompts */}
        <div className="w-full md:w-64 bg-dark-800 rounded-lg border border-dark-700 p-4">
          <h2 className="font-mono font-medium text-lg mb-3">Example Prompts</h2>
          <div className="space-y-2">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="w-full text-left p-3 bg-dark-700 hover:bg-dark-600 rounded-md text-sm flex items-center justify-between group transition-colors"
              >
                <span className="text-dark-200 group-hover:text-white">{prompt}</span>
                <ArrowRight size={14} className="text-dark-400 group-hover:text-hustle-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotPage;