
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
   ArrowRight, Globe, Hexagon,
   Layout,
   GitMerge, Server, Cpu as ChipIcon, QrCode, Fingerprint,
   Users, MapPin, Target, Database, Zap, UserPlus, Network, ShieldCheck
} from 'lucide-react';
import CardPreview from '../components/CardPreview';
import { DEFAULT_THEME } from '../constants';

const LandingPage: React.FC = () => {
   const navigate = useNavigate();

   const mockData = {
      name: "Alexander Thorne",
      role: "Managing Partner",
      company: "Ura Capital Group",
      bio: "Pioneering the global architecture for institutional identity and high-trust professional networking.",
      theme: { ...DEFAULT_THEME, primaryColor: '#020617', borderRadius: 40 },
      socialLinks: { linkedin: 'https://linkedin.com', github: 'https://github.com', twitter: 'https://twitter.com' },
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&clothes=blazerAndShirt&mouth=smile",
      primaryCTA: 'save_contact',
      customFields: [
         { id: '1', key: 'Division', value: 'Strategic Assets' },
         { id: '2', key: 'Identity', value: 'Verified v4.0' }
      ],
      isPhonePrivate: true,
      phone: "+44 20 7946 0000",
      email: "alex@uracapital.com"
   } as any;

   return (
      <div className="relative bg-white font-inter">
         {/* PERSISTENT BACKGROUND LAYER */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.1]" />
            <div className="absolute inset-0 bg-mesh-pattern opacity-[0.15]" />

            {/* Subtle Decorative Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
         </div>

         {/* 1. HERO SECTION - SPLIT LAYOUT */}
         <section className="relative min-h-screen z-10 flex items-center pt-20">
            <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-12 items-center">

               {/* LEFT: CONTENT */}
               <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-left relative z-20"
               >
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-950 text-white mb-8 border border-slate-800 shadow-xl">
                     <Hexagon className="w-4 h-4 text-amber-500 fill-current" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Architecture v4.0</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black font-outfit text-slate-950 mb-6 leading-[0.9] tracking-tighter uppercase">
                     Ura <br /><span className="text-amber-500">Mastery.</span>
                  </h1>
                  <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed mb-10">
                     The institutional standard for professional identity. Engineered for high-trust environments and global networking.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                     <button onClick={() => navigate('/auth')} className="px-10 py-5 bg-slate-950 text-white font-black rounded-2xl text-lg shadow-2xl flex items-center gap-4 group transition-all hover:scale-105 hover:bg-slate-900 border border-slate-900">
                        Begin Architecture <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-2 transition-all" />
                     </button>
                  </div>

                  <div className="mt-16 flex items-center gap-8 text-slate-400">
                     <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(i => (
                           <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                              <Users className="w-4 h-4 text-slate-400" />
                           </div>
                        ))}
                     </div>
                     <div className="text-xs font-bold uppercase tracking-widest">
                        <span className="text-slate-950">18k+</span> Active Nodes
                     </div>
                  </div>
               </motion.div>

               {/* RIGHT: CARD PREVIEW */}
               <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative z-20 flex justify-center perspective-lg"
               >
                  <div className="relative transform transition-all duration-700 hover:rotate-y-6 hover:rotate-x-6 preserve-3d">
                     {/* Decorative backdrop for card */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-amber-500/5 blur-[100px] rounded-full -z-10" />

                     <CardPreview data={mockData} interactive={true} />
                  </div>
               </motion.div>

            </div>
         </section>

         {/* 2. INSTITUTIONAL REACH (DENSE SECTION) */}
         <section className="py-24 bg-white px-8 relative z-20 overflow-hidden border-y border-slate-50">
            <div className="max-w-7xl mx-auto">
               <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div className="relative">
                     <div className="absolute -inset-10 bg-emerald-500/5 blur-[80px] rounded-full" />
                     <div className="relative bg-white border border-slate-100 p-12 rounded-[4rem] shadow-2xl group overflow-hidden">
                        <div className="absolute inset-0 opacity-5 pointer-events-none grayscale">
                           <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="World Map" />
                        </div>
                        <div className="relative z-10 space-y-10">
                           <div className="flex justify-between items-center">
                              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-md group-hover:scale-105 transition-transform"><Globe className="w-10 h-10" /></div>
                              <div className="text-right">
                                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Live Global Nodes</p>
                                 <p className="text-3xl font-black text-slate-950 font-outfit">18,402</p>
                              </div>
                           </div>
                           <div className="h-48 flex items-end gap-2 px-2">
                              {[30, 60, 45, 90, 70, 40, 80, 50, 100, 60].map((h, i) => (
                                 <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} className="flex-1 bg-emerald-500/10 rounded-t-lg transition-all group-hover:bg-emerald-500/30" />
                              ))}
                           </div>
                           <div className="flex gap-3">
                              <div className="px-5 py-2 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">London</div>
                              <div className="px-5 py-2 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400">NY</div>
                              <div className="px-5 py-2 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400">Tokyo</div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-10">
                     <h2 className="text-6xl font-black font-outfit text-slate-950 tracking-tighter uppercase leading-[0.9]">Global <br /><span className="text-emerald-500">Architecture.</span></h2>
                     <p className="text-lg text-slate-500 font-medium leading-relaxed">Ura provides a seamless infrastructure for global networking, ensuring your professional legacy is portable, secure, and always impressive.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                           { icon: MapPin, title: "Proximity Sync", desc: "Context-aware ID sharing." },
                           { icon: Users, title: "Firm Suite", desc: "Enterprise brand compliance." },
                           { icon: Target, title: "Lead Matrix", desc: "Direct CRM handshake." },
                           { icon: Database, title: "Asset Vault", desc: "Encrypted document sharing." }
                        ].map((feat, i) => (
                           <div key={i} className="flex gap-4 group">
                              <div className="p-3 bg-slate-50 rounded-xl text-slate-950 group-hover:bg-amber-500 group-hover:text-white transition-all"><feat.icon className="w-6 h-6" /></div>
                              <div>
                                 <h5 className="font-black text-base uppercase tracking-tight mb-1">{feat.title}</h5>
                                 <p className="text-xs text-slate-400 font-medium leading-snug">{feat.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 3. CTA CONVERSION SCHEMATIC */}
         <section className="py-24 bg-slate-950 px-8 relative z-20 overflow-hidden text-white">
            <div className="max-w-7xl mx-auto">
               <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <div className="order-2 lg:order-1">
                     <h2 className="text-6xl font-black font-outfit text-white mb-10 tracking-tighter uppercase leading-[0.9]">Smart <br /><span className="text-amber-500">Conversions.</span></h2>
                     <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12">Every handshake is an opportunity. Our CTA Engine optimizes your profile layout to prioritize your primary conversion path.</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                           { icon: GitMerge, title: "Handshake v4.0", desc: "Proximity protocol for identity exchange." },
                           { icon: Server, title: "Cloud ID", desc: "Managed private infrastructure." },
                           { icon: Layout, title: "Bento Logic", desc: "Dynamic high-density layout grids." },
                           { icon: Fingerprint, title: "Biometric Secure", desc: "Multi-factor ID verification." }
                        ].map((item, i) => (
                           <div key={i} className="flex flex-col gap-4 p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-amber-500/20 transition-all">
                              <div className="p-3 bg-white/10 rounded-xl w-fit text-amber-500"><item.icon className="w-5 h-5" /></div>
                              <h5 className="font-black text-xl uppercase tracking-tighter">{item.title}</h5>
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="order-1 lg:order-2 flex justify-center">
                     <div className="relative bg-white/5 p-16 rounded-[4rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                        <div className="w-64 h-64 bg-white p-10 rounded-[3rem] shadow-2xl relative flex items-center justify-center">
                           <QrCode className="w-full h-full text-slate-950" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                                 <Hexagon className="w-6 h-6 text-amber-500 fill-amber-500" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 4. MEMBERSHIP TIERS */}
         <section className="py-24 bg-white px-8 relative z-20">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-20">
                  <h2 className="text-5xl font-black font-outfit text-slate-950 mb-4 uppercase tracking-tighter">Membership.</h2>
                  <p className="text-xl text-slate-400 font-medium uppercase tracking-[0.4em] italic">Architecting Professional Excellence</p>
               </div>

               <div className="grid lg:grid-cols-3 gap-12">
                  {[
                     { title: 'Identity', icon: UserPlus, color: 'text-slate-950', desc: 'Elite essentials for individual leaders. LuxeDrop™ enabled.' },
                     { title: 'Platinum', icon: ChipIcon, color: 'text-amber-500', desc: 'Branded QRs, Advanced Schematic Controls, and Velocity Suite.' },
                     { title: 'Institutional', icon: Network, color: 'text-emerald-500', desc: 'Multi-identity firm-wide sync and automated brand compliance.' }
                  ].map((tier, i) => (
                     <div key={i} className="bento-card p-12 bg-white border-slate-100 flex flex-col justify-between group hover:bg-slate-950 hover:text-white transition-all duration-500">
                        <div className={`p-8 bg-slate-50 rounded-[2rem] ${tier.color} w-fit mb-10 group-hover:bg-white/10 group-hover:text-white transition-all shadow-md`}>
                           <tier.icon className="w-12 h-12" />
                        </div>
                        <div>
                           <h4 className="text-4xl font-black font-outfit mb-6 uppercase tracking-tighter">{tier.title}</h4>
                           <p className="text-slate-400 font-medium text-base group-hover:text-slate-300 transition-colors leading-relaxed">{tier.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* 5. FINAL CALL TO ACTION */}
         <section className="py-32 text-center bg-slate-50 px-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
               <h1 className="text-[30vw] font-black text-slate-950 leading-none rotate-[-10deg] whitespace-nowrap uppercase tracking-tighter">ARCHITECTURE</h1>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
               <h2 className="text-7xl md:text-9xl font-black font-outfit text-slate-950 mb-12 tracking-tighter uppercase leading-[0.8]">Build Your <br /><span className="text-amber-500">Legacy.</span></h2>
               <p className="text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed uppercase tracking-[0.1em] italic">The global institutional standard for digital identity.</p>
               <button onClick={() => navigate('/auth')} className="px-16 py-8 bg-slate-950 text-white font-black rounded-3xl text-3xl shadow-2xl hover:scale-105 transition-all flex items-center gap-8 mx-auto uppercase tracking-tighter group">
                  Enter Studio <ArrowRight className="w-10 h-10 text-amber-500 group-hover:translate-x-3 transition-all" />
               </button>
            </motion.div>
         </section>

         {/* FOOTER */}
         <footer className="py-24 border-t border-slate-100 bg-white relative z-30">
            <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-4 gap-16">
               <div className="lg:col-span-1 text-left">
                  <div className="flex items-center gap-3 mb-8">
                     <Hexagon className="w-10 h-10 text-slate-950 fill-current" />
                     <span className="text-4xl font-black font-outfit tracking-tighter uppercase leading-none">URA</span>
                  </div>
                  <p className="text-slate-400 font-medium text-base leading-relaxed mb-10">Institutional identity architecture for the global elite. Portable. Secure. Verified.</p>
               </div>

               <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-16">
                  <div className="space-y-6">
                     <h5 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.4em]">Architecture</h5>
                     <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <li><a href="#" className="hover:text-amber-500 transition-colors">LuxeDrop™</a></li>
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Vault Engine</a></li>
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Bento Grids</a></li>
                     </ul>
                  </div>
                  <div className="space-y-6">
                     <h5 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.4em]">Institution</h5>
                     <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Membership</a></li>
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Firm Solutions</a></li>
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Support Desk</a></li>
                     </ul>
                  </div>
                  <div className="space-y-6">
                     <h5 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.4em]">Compliance</h5>
                     <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Security Audit</a></li>
                        <li><a href="#" className="hover:text-amber-500 transition-colors">Institutional Terms</a></li>
                     </ul>
                  </div>
               </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 mt-24 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] gap-4">
               <span>URA Institutional Identity Architecture v4.0 © 2025</span>
               <span className="flex items-center gap-3 text-emerald-500/50"><ShieldCheck className="w-3.5 h-3.5" /> SECURE AES-256 CORE ACTIVE</span>
            </div>
         </footer>
      </div>
   );
};

export default LandingPage;
