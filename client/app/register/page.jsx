'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] sm:min-h-[85vh] w-full flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden select-none">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Glassmorphic Register Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-[560px] p-5 sm:p-10 md:p-12 rounded-3xl bg-[#090c15]/90 border border-white/15 backdrop-blur-2xl shadow-[0_0_60px_rgba(219,39,119,0.2)] space-y-5 sm:space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-1">
            <UserPlus className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">Create Account</h1>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold">Join CineVerse to stream unlimited 4K blockbusters</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div>
            <label className="block text-[10px] sm:text-xs font-black text-gray-300 uppercase mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-black text-gray-300 uppercase mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs font-black text-gray-300 uppercase mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 sm:py-5 my-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-sm sm:text-lg flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(219,39,119,0.4)] transition-all transform hover:scale-[1.02] active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            {!loading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-gray-400 text-xs font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-pink-400 font-extrabold hover:underline">
              Sign In Instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
