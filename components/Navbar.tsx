
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { motion } from 'framer-motion';
import { CreditCard, LogOut, LayoutDashboard, Sparkles, User as UserIcon, Hexagon } from 'lucide-react';

interface Props {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<Props> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="bg-slate-950 p-2.5 rounded-2xl text-amber-500 shadow-xl group-hover:rotate-12 transition-transform duration-500">
            <Hexagon className="w-6 h-6 fill-current" />
          </div>
          <span className="font-outfit text-2xl font-black tracking-tighter text-slate-950">URA CARDS</span>
        </Link>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-slate-950 transition-colors font-black text-xs uppercase tracking-widest">
                <LayoutDashboard className="w-4 h-4" />
                <span>Workspace</span>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                  <span className="text-xs font-black text-slate-950 uppercase tracking-tighter">{user.name.split(' ')[0]}</span>
                </div>
                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><LogOut className="w-5 h-5" /></button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/auth" className="text-slate-600 hover:text-slate-950 transition-colors font-black text-xs uppercase tracking-widest">Login</Link>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
                className="bg-slate-950 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center space-x-2">
                <Sparkles className="w-3 h-3 text-amber-500" /><span>Get Started</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
