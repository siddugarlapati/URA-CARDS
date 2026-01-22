
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockApi } from '../services/mockApi';
import { CardData } from '../types';
import { 
  Plus, Eye, Share2, ArrowUpRight, 
  Settings, BarChart2,
  Wifi, ShieldCheck, QrCode, Scan, TrendingUp,
  Users, UserCheck, Linkedin, ArrowRight, Zap, Hexagon,
  Target, Github, Globe, ChevronRight, MousePointer2, UserPlus
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'cards' | 'intelligence'>('cards');
  const [showQr, setShowQr] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadCards(); }, []);

  const loadCards = async () => {
    try { 
      const data = await mockApi.getUserCards();
      setCards(data); 
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <div className="w-14 h-14 border-[5px] border-slate-100 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Synchronizing Identity Hub</p>
    </div>
  );

  const primaryCard = cards[0];

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-20 gap-12">
        <div>
          <h1 className="text-6xl font-black font-outfit text-slate-950 mb-4 tracking-tighter uppercase leading-none">Command Center</h1>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setActiveView('cards')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all py-3 border-b-2 ${activeView === 'cards' ? 'text-amber-600 border-amber-600' : 'text-slate-300 border-transparent hover:text-slate-600'}`}
            >
              Identities
            </button>
            <button 
              onClick={() => setActiveView('intelligence')}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all py-3 border-b-2 ${activeView === 'intelligence' ? 'text-amber-600 border-amber-600' : 'text-slate-300 border-transparent hover:text-slate-600'}`}
            >
              Intelligence
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/drop')}
            className="flex-1 lg:flex-none px-10 py-5 bg-amber-600 text-white rounded-2xl font-black flex items-center justify-center gap-4 shadow-2xl shadow-amber-600/20 text-xs uppercase tracking-widest">
            <Wifi className="w-5 h-5" /><span>LuxeDrop</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/scan')}
            className="flex-1 lg:flex-none px-10 py-5 bg-slate-950 text-white rounded-2xl font-black flex items-center justify-center gap-4 shadow-2xl text-xs uppercase tracking-widest">
            <Scan className="w-5 h-5" /><span>Scanner</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'cards' ? (
          <motion.div key="cards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-8">Master Identity</h3>
              <div className="relative group perspective-lg">
                {primaryCard ? (
                  <motion.div 
                    className="relative transition-all duration-1000 h-[620px]"
                    animate={{ rotateY: showQr ? 180 : 0 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute inset-0 [backface-visibility:hidden] bento-card p-12 flex flex-col border-slate-950/5 shadow-2xl">
                        <div 
                          onClick={() => setShowQr(true)}
                          className="w-full h-64 rounded-[3rem] mb-12 flex items-center justify-center relative overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform shadow-inner border border-slate-950/5"
                          style={{ background: `linear-gradient(135deg, ${primaryCard?.theme.gradientFrom}, ${primaryCard?.theme.gradientTo})` }}
                        >
                          <img src={primaryCard?.profileImage} className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover z-10" />
                          <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="bg-white p-4 rounded-full text-slate-950 shadow-2xl border border-slate-100"><QrCode className="w-8 h-8" /></div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                              <h2 className="text-4xl font-black font-outfit text-slate-950 tracking-tighter leading-none uppercase">{primaryCard?.name}</h2>
                              <Link to={`/card/${primaryCard?.usernameSlug}`} className="p-3 text-slate-200 hover:text-amber-600 transition-colors"><ArrowUpRight className="w-8 h-8" /></Link>
                          </div>
                          <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.4em] mb-8">{primaryCard?.role}</p>
                          <p className="text-[13px] font-medium text-slate-400 mb-10 leading-relaxed italic truncate">"{primaryCard?.bio}"</p>
                        </div>

                        <div className="flex gap-4">
                          <button onClick={() => navigate(`/editor/${primaryCard?.id}`)} className="flex-1 py-6 bg-slate-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all hover:bg-slate-900">Configure</button>
                          <button className="p-6 bg-slate-50 rounded-3xl text-slate-300 hover:text-amber-600 transition-all"><Share2 className="w-6 h-6" /></button>
                        </div>
                    </div>

                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bento-card p-12 flex flex-col items-center justify-center bg-slate-950 text-white shadow-2xl border-white/5">
                        <button onClick={() => setShowQr(false)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors"><ChevronRight className="w-10 h-10 rotate-180" /></button>
                        <div className="w-64 h-64 bg-white p-8 rounded-[4rem] shadow-[0_0_80px_rgba(245,158,11,0.3)] mb-12 relative overflow-hidden group">
                          <QrCode className="w-full h-full text-slate-950" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                             <Hexagon className="w-16 h-16 text-slate-950 fill-slate-950" />
                          </div>
                        </div>
                        <p className="text-3xl font-black font-outfit mb-2 uppercase tracking-tight">Institutional Pass</p>
                        <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">Encryption Active</p>
                    </div>
                  </motion.div>
                ) : (
                    <button onClick={() => navigate('/editor')} className="w-full h-[620px] bento-card border-dashed border-2 border-slate-100 flex flex-col items-center justify-center text-slate-200 hover:text-amber-600 hover:border-amber-200 transition-all bg-slate-50/50">
                      <Plus className="w-16 h-16 mb-6" />
                      <span className="font-black uppercase tracking-[0.4em] text-xs">Build Master Card</span>
                    </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bento-card p-12 group hover:border-emerald-200">
                    <div className="flex items-center gap-5 mb-12">
                       <div className="p-4 bg-emerald-50 rounded-[2rem] text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all"><Users className="w-8 h-8" /></div>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Global Peers</span>
                    </div>
                    <p className="text-6xl font-black font-outfit text-slate-950 mb-3 tracking-tighter">{primaryCard?.views || 0}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Discovery</p>
                  </div>
                  <div className="bento-card p-12 bg-slate-950 text-white group hover:border-amber-500/30">
                    <div className="flex items-center gap-5 mb-12">
                       <div className="p-4 bg-white/5 rounded-[2rem] text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all"><Zap className="w-8 h-8" /></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Engagement</span>
                    </div>
                    <p className="text-6xl font-black font-outfit text-amber-500 mb-3 tracking-tighter">+{primaryCard?.mutuals || 0}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Trusted Handshakes</p>
                  </div>
               </div>
               
               <div className="bento-card p-16 flex-1 flex flex-col items-center justify-center text-center bg-white border-slate-100 group">
                  <UserPlus className="w-24 h-24 text-slate-100 mb-10 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-700" />
                  <h4 className="text-3xl font-black font-outfit text-slate-950 mb-4 uppercase tracking-tighter leading-none">Expand Your Institution</h4>
                  <p className="text-slate-400 text-base max-w-sm font-medium leading-relaxed mb-10">Invite team members or partners to the Ura Network and unlock Platinum multi-card management.</p>
                  <button className="px-10 py-4 bg-slate-50 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200">Generate Invite Link</button>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="intelligence" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-16">
             <div className="grid lg:grid-cols-4 gap-8">
                {[
                  { label: 'Total Views', value: primaryCard?.views, icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Followers', value: primaryCard?.followers, icon: Users, color: 'text-slate-900', bg: 'bg-slate-100' },
                  { label: 'Mutuals', value: primaryCard?.mutuals, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Retention', value: `${primaryCard?.retentionRate}%`, icon: Target, color: 'text-amber-500', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                  <div key={i} className="bento-card p-10 bg-white flex flex-col items-center text-center border-slate-100">
                    <div className={`p-5 ${stat.bg} ${stat.color} rounded-[2rem] mb-8`}><stat.icon className="w-10 h-10" /></div>
                    <p className="text-5xl font-black font-outfit text-slate-950 mb-2 tracking-tighter">{stat.value}</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{stat.label}</p>
                  </div>
                ))}
             </div>

             <div className="grid lg:grid-cols-2 gap-16">
                <div className="bento-card p-12 bg-white border-slate-100">
                   <div className="flex items-center justify-between mb-16">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Engagement Velocity</h4>
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                         <span className="text-[10px] font-black uppercase text-slate-950 tracking-widest">Live Activity</span>
                      </div>
                   </div>
                   <div className="h-72 flex items-end gap-4 px-6">
                      {[40, 70, 50, 90, 60, 100, 80, 50, 70, 90, 60, 40].map((h, i) => (
                        <div key={i} className="flex-1 bg-slate-50/50 relative rounded-t-xl group overflow-hidden">
                           <motion.div 
                             initial={{ height: 0 }} 
                             animate={{ height: `${h}%` }} 
                             className="w-full bg-slate-950 transition-all group-hover:bg-amber-500" 
                           />
                        </div>
                      ))}
                   </div>
                   <div className="flex justify-between mt-10 text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">
                      <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                   </div>
                </div>

                <div className="bento-card p-12 bg-slate-950 text-white border-white/5">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-16">Smart Link Analytics</h4>
                   <div className="space-y-10">
                      {[
                        { label: 'LinkedIn Professional Profile', icon: Linkedin, clicks: primaryCard?.linkAnalytics?.linkedin || 450, color: 'text-white' },
                        { label: 'GitHub Repository / Assets', icon: Github, clicks: primaryCard?.linkAnalytics?.github || 230, color: 'text-slate-400' },
                        { label: 'Corporate Landing Page', icon: Globe, clicks: primaryCard?.linkAnalytics?.website || 120, color: 'text-amber-500' },
                        { label: 'Institutional Network Flow', icon: MousePointer2, clicks: 840, color: 'text-emerald-500' }
                      ].map((link, i) => (
                        <div key={i} className="space-y-4 group">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <link.icon className={`w-6 h-6 ${link.color}`} />
                                 <span className="text-sm font-black tracking-tight uppercase group-hover:text-amber-500 transition-colors">{link.label}</span>
                              </div>
                              <span className="text-sm font-black text-amber-500 tracking-tighter">{link.clicks} clicks</span>
                           </div>
                           <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${Math.min(100, (link.clicks / 1000) * 100)}%` }} 
                                className="h-full bg-amber-600 group-hover:bg-amber-500 transition-all" 
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
