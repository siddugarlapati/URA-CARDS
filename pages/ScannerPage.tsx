
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, X, QrCode, Zap, Info, ShieldCheck, Search } from 'lucide-react';

const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) { videoRef.current.srcObject = stream; }
      } catch (err) { console.error("Camera access denied", err); }
    }
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = (e.target as any).username.value;
    if (val) navigate(`/card/${val}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-amber-500 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col h-full flex-1">
        <div className="p-8 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-4 bg-white/5 rounded-3xl text-white hover:bg-white/10 transition-all">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Secure Scanner 2.0</span>
          </div>
          <div className="w-12" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black font-outfit text-white mb-3">Connect Instantly</h1>
            <p className="text-slate-500 font-medium">Auto-captures any LuxeCard QR or Member Identity</p>
          </div>

          <div className="relative w-full max-w-sm aspect-square">
             <div className="absolute -top-2 -left-2 w-20 h-20 border-t-4 border-l-4 border-amber-600 rounded-tl-[3rem] z-20" />
             <div className="absolute -top-2 -right-2 w-20 h-20 border-t-4 border-r-4 border-amber-600 rounded-tr-[3rem] z-20" />
             <div className="absolute -bottom-2 -left-2 w-20 h-20 border-b-4 border-l-4 border-amber-600 rounded-bl-[3rem] z-20" />
             <div className="absolute -bottom-2 -right-2 w-20 h-20 border-b-4 border-r-4 border-amber-600 rounded-br-[3rem] z-20" />
             
             <motion.div 
               animate={{ top: ['10%', '90%', '10%'] }} 
               transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute left-[10%] right-[10%] h-1 bg-amber-500 shadow-[0_0_30px_rgba(217,119,6,1)] z-20 opacity-80" 
             />

             <div className="w-full h-full bg-slate-900 rounded-[4rem] overflow-hidden border border-white/10 relative shadow-2xl">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <QrCode className="w-32 h-32 text-white/5" />
                </div>
             </div>
          </div>

          <form onSubmit={handleManualSearch} className="mt-20 w-full max-w-md">
             <div className="relative group">
               <input 
                 name="username"
                 type="text" 
                 placeholder="Search by institutional alias..." 
                 className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] pl-8 pr-20 py-6 text-white font-bold outline-none focus:border-amber-500 transition-all text-lg"
               />
               <button type="submit" className="absolute right-3 top-3 p-4 bg-amber-600 rounded-3xl text-white shadow-xl hover:bg-amber-500 transition-all">
                  <Search className="w-6 h-6" />
               </button>
             </div>
          </form>
        </div>

        <div className="p-12 text-center">
           <div className="inline-flex items-center justify-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> Adaptive Focus</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Encrypted Scan</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
