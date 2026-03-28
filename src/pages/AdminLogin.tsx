import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp({ email, password });
        if (error) throw error;
        toast.success("Account created successfully. You can now log in.");
        setIsSignUp(false);
      } else {
        const { error } = await signIn({ email, password });
        if (error) throw error;
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[var(--color-primary)] selection:text-white transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center shadow-lg">
            <Lock size={24} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {isSignUp ? 'Create Admin Account' : 'Sign in to Admin Dashboard'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 dark:border-white/5 animate-[slideUp_0.4s_ease]">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-base font-medium outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all dark:text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-black/10 dark:shadow-[var(--color-primary)]/20 text-sm font-extrabold text-white bg-black dark:bg-[var(--color-primary)] hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign up' : 'Sign in')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
