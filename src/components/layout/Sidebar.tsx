import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Compass, 
  FileCode, 
  Bot, 
  Settings,
  Rocket
} from 'lucide-react';

const Sidebar = () => {
  const sidebarLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Explore', path: '/explore', icon: <Compass size={20} /> },
    { name: 'Templates', path: '/templates', icon: <FileCode size={20} /> },
    { name: 'HustleBot', path: '/bot', icon: <Bot size={20} /> },
  ];

  const otherLinks = [
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    { name: 'Launch Guide', path: '/launch-guide', icon: <Rocket size={20} /> },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="hidden md:block w-64 bg-dark-800 border-r border-dark-700"
    >
      <div className="py-6 flex flex-col h-full">
        <div className="px-6 mb-6">
          <h2 className="text-sm font-medium text-dark-400 uppercase tracking-wider">
            Main
          </h2>
        </div>
        
        <nav className="space-y-1 px-3 flex-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors 
                ${isActive 
                  ? 'bg-hustle-700/50 text-hustle-200' 
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'}
              `}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 mt-6 mb-2">
          <h2 className="text-sm font-medium text-dark-400 uppercase tracking-wider">
            Other
          </h2>
        </div>

        <nav className="space-y-1 px-3 mb-6">
          {otherLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors 
                ${isActive 
                  ? 'bg-hustle-700/50 text-hustle-200' 
                  : 'text-dark-300 hover:text-white hover:bg-dark-700'}
              `}
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 mt-auto">
          <div className="p-4 bg-dark-700 rounded-lg">
            <h3 className="font-medium text-white text-sm">Pro Tip</h3>
            <p className="text-dark-300 text-xs mt-1">Use HustleBot to generate custom project ideas based on your skills.</p>
            <NavLink 
              to="/bot" 
              className="text-hustle-300 hover:text-hustle-200 text-xs mt-2 inline-block"
            >
              Try HustleBot →
            </NavLink>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;