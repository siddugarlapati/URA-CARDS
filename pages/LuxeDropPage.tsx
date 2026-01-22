
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wifi, X, ShieldCheck, CheckCircle2, QrCode, Smartphone, Zap } from 'lucide-react';

const LuxeDropPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'searching' | 'connecting' | 'complete'>('searching');

  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('connecting'), 3500);
    const timer2 = setTimeout(() => setStatus('complete'), 7000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Wavefront Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="wave-ring w-40 h-40" />
         <div className="wave-ring w-40 h-40" style={{ animationDelay: '1s' }} />
         <div className="wave-ring w-40 h-40" style={{ animationDelay: '2s' }} />
         
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/5 blur-[120px] rounded-full" />
      </div>

      <button onClick={() => navigate(-1)} className="absolute top-10 left-10 p-5 bg-white/5 rounded-3xl text-white hover:bg-white/10 transition-all z-50">
        <X className="w-6 h-6" />
      </button>

      <div className="relative z-10 text-center max-w-sm w-full">
        <AnimatePresence mode="wait">
          {status === 'searching' && (
            <motion.div key="searching" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
               <div className="mb-16 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-slate-900 border border-amber-600/30 flex items-center justify-center relative shadow-[0_0_50px_rgba(217,119,6,0.3)]">
                     <Wifi className="w-12 h-12 text-amber-500 animate-pulse" />
                  </div>
               </div>
               <h1 className="text-4xl font-black font-outfit text-white mb-6 tracking-tight">Initiating LuxeDrop</h1>
               <p className="text-slate-500 font-medium leading-relaxed">Place your device within 2 inches of another LuxeCard member to begin the exchange.</p>
            </motion.div>
          )}

          {status === 'connecting' && (
            <motion.div key="connecting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center">
               <div className="flex items-center gap-6 mb-16">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-20 h-20 rounded-[2rem] bg-amber-500 shadow-[0_0_30px_rgba(217,119,6,0.5)]" />
                  <div className="w-8 h-1 bg-slate-800 rounded-full" />
                  <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl" />
               </div>
               <h1 className="text-4xl font-black font-outfit text-white mb-6 tracking-tight">Identity Vault Found</h1>
               <p className="text-slate-500 font-medium">Validating institutional credentials and privacy keys...</p>
            </motion.div>
          )}

          {status === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="bento-card p-12 bg-white text-slate-950 premium-shadow">
               <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-10 mx-auto">
                  <CheckCircle2 className="w-12 h-12" />
               </div>
               <h1 className="text-4xl font-black font-outfit mb-4 tracking-tight">Exchange Verified</h1>
               <p className="text-slate-500 font-medium mb-12">Institutional identity has been securely transferred to your global network.</p>
               
               <div className="space-y-4">
                  <button onClick={() => navigate('/card/alex-pro')} className="w-full py-6 bg-slate-950 text-white font-black rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-900 transition-all">
                     View Identity <Zap className="w-5 h-5 text-amber-500" />
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="w-full py-6 bg-slate-50 text-slate-950 font-black rounded-[2rem] hover:bg-slate-100 transition-all">
                     Finish Transaction
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 flex items-center gap-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
         <ShieldCheck className="w-4 h-4 text-amber-500" /> AES-256 Proximity Encryption Active
      </div>
    </div>
  );
};

export default LuxeDropPage;
