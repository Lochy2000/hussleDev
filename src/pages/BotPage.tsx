import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, ArrowRight, User, RefreshCw, Copy, Check } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      generateBotResponse(inputValue);
    }, 1500);
  };

  const generateBotResponse = (userInput: string) => {
    let botResponse = '';

    // Very simple pattern matching for demo purposes
    const input = userInput.toLowerCase();

    if (input.includes('saas') || input.includes('notion')) {
      botResponse = "Here are three Notion-based SaaS ideas:\n\n1. **Notion Templates Marketplace**: Create a platform where people can buy and sell custom Notion templates for various use cases like project management, personal finance tracking, or content calendars.\n\n2. **Notion API Integration Platform**: Build a service that connects Notion to other tools without coding, similar to Zapier but specifically optimized for Notion workflows.\n\n3. **Notion Analytics Dashboard**: Develop a tool that gives teams insights into how they're using Notion - which pages get the most views, who contributes most, and how information flows.";
    } else if (input.includes('react') || input.includes('javascript')) {
      botResponse = "As a React/JavaScript developer, you have many profitable side hustle options:\n\n1. **Custom React Component Library**: Create premium, highly customizable UI components that save other developers time.\n\n2. **React Performance Consulting**: Offer services to optimize slow React applications.\n\n3. **React Course or Ebook**: Create educational content teaching specific React patterns or techniques.\n\n4. **React Plugins/Extensions**: Develop and sell plugins for popular React-based platforms like Gatsby or Next.js.\n\n5. **React App Templates**: Build and sell starter templates for common applications like dashboards, e-commerce, or portfolio sites.";
    } else if (input.includes('tech stack') || input.includes('productivity')) {
      botResponse = "For a modern productivity app, I recommend this tech stack:\n\n**Frontend**:\n- Next.js (React framework with SSR)\n- TailwindCSS for styling\n- SWR or React Query for data fetching\n- Framer Motion for animations\n\n**Backend**:\n- Node.js with Express or Nest.js\n- Prisma as an ORM\n- PostgreSQL for database\n\n**Authentication**:\n- NextAuth.js or Clerk\n\n**Deployment**:\n- Vercel for frontend\n- Railway or Render for backend\n- Supabase or Neon for PostgreSQL\n\nThis stack gives you great developer experience, performance, and scalability with minimal configuration.";
    } else if (input.includes('monetize')) {
      botResponse = "Here are effective ways to monetize your developer skills:\n\n1. **Freelancing**: Platforms like Upwork, Toptal, or specialized ones like React Jobs.\n\n2. **Digital Products**: Sell templates, components, or plugins on marketplaces like Gumroad or your own site.\n\n3. **Educational Content**: Create courses on platforms like Udemy or eBooks.\n\n4. **SaaS Products**: Build small software tools that solve specific problems.\n\n5. **Open Source Monetization**: Create a popular OSS project and offer premium support or enterprise features.\n\n6. **Technical Writing**: Write for publications that pay for technical content.\n\n7. **Code Reviews**: Offer professional code review services.";
    } else {
      botResponse = "That's an interesting question about developer side hustles. Here are some general ideas:\n\n1. **Niche Website Builder**: Create a specialized website builder for a specific industry.\n\n2. **Developer Tools**: Build VS Code extensions or CLI tools that solve common pain points.\n\n3. **API Integrations**: Create middleware that connects popular services in unique ways.\n\n4. **Technical Blogging**: Start a blog focusing on solving specific technical problems.\n\n5. **Automation Services**: Offer to automate business processes for non-technical clients.\n\nWould you like me to elaborate on any of these ideas?";
    }

    const newBotMessage: Message = {
      id: Date.now().toString(),
      content: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newBotMessage]);
    setIsLoading(false);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
                      <div>
                        <div className="whitespace-pre-line">
                          {message.content.split('\n').map((line, i) => {
                            // Replace markdown bold with proper styling
                            const boldPattern = /\*\*(.*?)\*\*/g;
                            const styledLine = line.replace(
                              boldPattern,
                              (_, text) => `<strong>${text}</strong>`
                            );
                            
                            return (
                              <p 
                                key={i} 
                                className="mb-2 last:mb-0"
                                dangerouslySetInnerHTML={{ __html: styledLine }}
                              />
                            );
                          })}
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