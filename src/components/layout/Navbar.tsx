import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    ...(isAuthenticated
      ? [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Templates', path: '/templates' },
          { name: 'HustleBot', path: '/bot' },
        ]
      : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-dark-900/80 backdrop-blur-md border-b border-dark-700' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-mono font-bold">
            <span className="text-white">Hustle</span>
            <span className="text-neon-purple">.</span>
            <span className="text-neon-blue">dev</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-neon-purple'
                    : 'text-dark-200 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2"
              >
                <img
                  src={currentUser?.photoURL}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-full border-2 border-hustle-500"
                />
                <ChevronDown size={16} className="text-dark-300" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 py-2 bg-dark-800 rounded-md shadow-lg border border-dark-700 z-50"
                  >
                    <div className="px-4 py-2 border-b border-dark-700">
                      <p className="text-sm font-medium text-white truncate">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-dark-300 truncate">
                        {currentUser?.email}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 hover:text-white flex items-center"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 hover:text-white flex items-center"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 hover:text-white flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="py-2 text-sm font-medium text-dark-200 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="btn btn-primary neon-glow neon-purple"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-dark-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark-800 border-b border-dark-700"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 text-base font-medium ${
                    location.pathname === link.path
                      ? 'text-white'
                      : 'text-dark-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="pt-2 border-t border-dark-700 flex items-center">
                    <img
                      src={currentUser?.photoURL}
                      alt={currentUser?.name}
                      className="w-8 h-8 rounded-full mr-2 border-2 border-hustle-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-dark-400">{currentUser?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-base font-medium text-dark-300 hover:text-white flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-2 border-t border-dark-700">
                  <Link
                    to="/login"
                    className="btn btn-secondary w-full"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-primary w-full neon-glow neon-purple"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;