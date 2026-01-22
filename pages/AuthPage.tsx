
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { authApi } from '../services/auth';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onAuthSuccess: (user: User) => void;
}

const AuthPage: React.FC<Props> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = isLogin ? await authApi.signIn(formData.email, formData.password) : await authApi.signUp(formData.email, formData.password, formData.name);
      // authApi returns session/user data structure, but onAuthSuccess expects User type
      // authApi.signIn returns { user, session }
      // We need to fetch the full user profile or just pass compatible object
      // Actually authApi.getCurrentUser returns Promise<User | null>
      // Let's just reload or fetch user
      const currentUser = await authApi.getCurrentUser();
      if (currentUser) onAuthSuccess(currentUser);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen py-20 px-6 flex items-center justify-center relative bg-slate-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="bg-indigo-600 p-4 rounded-[2rem] w-fit mx-auto mb-6 shadow-2xl shadow-indigo-100 text-white"><Sparkles className="w-8 h-8" /></div>
          <h1 className="text-4xl font-black font-outfit text-slate-900 mb-2">{isLogin ? 'Welcome Back' : 'Create Identity'}</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">LuxeCard Professional Access</p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
          {error && <div className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-xs font-bold mb-8 text-center border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
              <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
            <button disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-2xl shadow-slate-200 flex items-center justify-center space-x-2 text-lg">
              {loading ? 'Authenticating...' : <>{isLogin ? 'Sign In' : 'Register Identity'}<ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors">
              {isLogin ? "New here? Create your profile" : "Already registered? Login here"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
