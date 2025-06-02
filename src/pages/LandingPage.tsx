import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Code, Compass, Database, Bot } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-mono font-bold mb-6 leading-tight">
                <span className="text-white">Stop scrolling tools.</span><br />
                <span className="gradient-text">Start building side hustles.</span>
              </h1>
              
              <motion.p 
                className="text-lg md:text-xl text-dark-200 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Hustle.dev helps you discover, save, and act on developer side projects — fast.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link 
                  to="/explore" 
                  className="btn btn-primary neon-glow neon-purple text-white px-8 py-3 rounded-md"
                >
                  Explore Ideas
                  <ChevronRight size={18} className="ml-1" />
                </Link>
                
                <Link 
                  to="/login" 
                  className="btn btn-secondary px-8 py-3 rounded-md"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>

            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-md mx-auto"
            >
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <img 
                  src="/3.png" 
                  alt="Hustle Cat Happy"
                  className="w-full h-auto"
                />
              </motion.div>
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <img 
                  src="/4.png" 
                  alt="Hustle Cat Focused"
                  className="w-full h-auto"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-mono font-bold mb-4">Why Hustle.dev?</h2>
            <p className="text-dark-200 max-w-2xl mx-auto">
              We help developers turn ideas into profitable side projects with curated resources, templates, and AI assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Compass size={36} className="text-neon-purple" />,
                title: "Explore Curated Side Hustles",
                description: "Browse through our collection of developer-focused side hustle ideas with detailed info on tech stack, time commitment, and earning potential."
              },
              {
                icon: <Database size={36} className="text-neon-blue" />,
                title: "Build Your Hustle Room",
                description: "Save and organize your favorite ideas, track your progress, and manage your side projects in one centralized dashboard."
              },
              {
                icon: <Bot size={36} className="text-neon-cyan" />,
                title: "Chat with HustleBot",
                description: "Get personalized side hustle recommendations based on your skills, interests, and time availability using our AI assistant."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card p-6 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-mono font-bold mb-3">{feature.title}</h3>
                <p className="text-dark-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto bg-dark-800 p-8 md:p-12 rounded-2xl border border-dark-700 text-center">
            <h2 className="text-3xl font-mono font-bold mb-4">Ready to start your developer side hustle?</h2>
            <p className="text-dark-200 mb-8">
              Join Hustle.dev today and turn your coding skills into a profitable side business.
            </p>
            <Link 
              to="/login" 
              className="btn btn-primary neon-glow neon-purple text-white px-8 py-3 rounded-md inline-flex items-center"
            >
              Get Started <Code size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-dark-700 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-mono font-bold">
                <span className="text-white">Hustle</span>
                <span className="text-neon-purple">.</span>
                <span className="text-neon-blue">dev</span>
              </span>
              <p className="text-dark-400 mt-2">Turn your code into cash</p>
            </div>
            
            <div className="flex space-x-8">
              <Link to="/explore" className="text-dark-300 hover:text-white transition-colors">
                Explore
              </Link>
              <Link to="/templates" className="text-dark-300 hover:text-white transition-colors">
                Templates
              </Link>
              <Link to="/bot" className="text-dark-300 hover:text-white transition-colors">
                HustleBot
              </Link>
              <Link to="/login" className="text-dark-300 hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="border-t border-dark-700 mt-8 pt-8 text-center">
            <p className="text-dark-400 text-sm">
              © {new Date().getFullYear()} Hustle.dev. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;