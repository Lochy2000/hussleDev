import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Github, Mail } from 'lucide-react';
import { loginSchema, type LoginInput } from '../lib/schemas';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      const formData: LoginInput = { email, password };
      const validatedData = loginSchema.parse(formData);

      await login(validatedData.email, validatedData.password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err: any) {
      if (err.formErrors) {
        // Zod validation error
        toast.error(err.formErrors.fieldErrors[Object.keys(err.formErrors.fieldErrors)[0]][0]);
      } else if (err.message?.includes('email_not_confirmed')) {
        toast.error('Please check your email inbox and verify your account before logging in.');
      } else if (err.message?.includes('invalid_credentials')) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else {
        toast.error('Failed to log in. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);

    try {
      await loginWithGithub();
      toast.success('Successfully logged in with GitHub!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Failed to log in with GitHub. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Link to="/" className="absolute top-8 left-8 text-dark-300 hover:text-white flex items-center">
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-mono font-bold mb-2">Welcome to Hustle.dev</h1>
          <p className="text-dark-300">Sign in to access your hustle dashboard</p>
        </div>

        <div className="bg-dark-800 rounded-lg p-8 border border-dark-700 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-200 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-dark-200">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-hustle-300 hover:text-hustle-200">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-hustle-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary neon-glow neon-purple flex items-center justify-center py-2"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  Sign in with Email
                </span>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-800 text-dark-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="w-full btn btn-secondary flex items-center justify-center py-2"
              >
                <Github size={16} className="mr-2" />
                Sign in with GitHub
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-dark-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-hustle-300 hover:text-hustle-200 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;