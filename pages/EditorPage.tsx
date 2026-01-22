
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CardService } from '../services/cards';
import { authApi } from '../services/auth';
import { StorageService } from '../services/storage';
import { CardData, ThemeSettings, SocialLinks, PrimaryCTA } from '../types';
import { DEFAULT_THEME, GRADIENT_PRESETS, AVATAR_COLLECTION } from '../constants';
import CardPreview from '../components/CardPreview';
import {
   ChevronLeft, Save, User, Briefcase, Phone, Mail, Globe,
   Linkedin, Twitter, Github, Instagram, MapPin, Palette,
   Type, Layout, Settings, Plus, X, Link as LinkIcon,
   Share2, Shield, Eye, QrCode, Lock, Globe2, Image as ImageIcon,
   Sparkles, Layers, Sliders, Hash, Figma, Youtube, Send,
   Smartphone, Monitor, AlignLeft, AlignCenter, Music, Calendar, ExternalLink,
   Zap, Download, FileText
} from 'lucide-react';

const EditorPage: React.FC = () => {
   const { id } = useParams<{ id?: string }>();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [editorMode, setEditorMode] = useState<'quick' | 'expert'>('quick');
   const [activeTab, setActiveTab] = useState<'identity' | 'socials' | 'fields' | 'styling' | 'smart'>('identity');

   const [cardData, setCardData] = useState<Partial<CardData>>({
      name: '', usernameSlug: '', role: '', company: '', phone: '', isPhonePrivate: true,
      email: '', isEmailPrivate: false, website: '', bio: '',
      socialLinks: { custom: [], linkedin: '', github: '', twitter: '', instagram: '', tiktok: '', youtube: '', whatsapp: '' },
      primaryCTA: 'save_contact',
      customFields: [
         { id: '1', key: 'Division / Office', value: '' },
         { id: '2', key: 'Corporate HQ', value: '' }
      ],
      theme: { ...DEFAULT_THEME },
      profileImage: AVATAR_COLLECTION.boys[0].url
   });

   useEffect(() => {
      if (id) {
         CardService.getCardById(id).then(data => {
            if (data) {
               setCardData({
                  ...data,
                  socialLinks: { ...cardData.socialLinks, ...(data.socialLinks || {}) },
                  theme: { ...DEFAULT_THEME, ...(data.theme || {}) }
               });
            }
            setLoading(false);
         }).catch(() => navigate('/dashboard'));
      } else { setLoading(false); }
   }, [id]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setCardData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleSocialChange = (key: keyof SocialLinks, value: string) => {
      setCardData(prev => ({
         ...prev,
         socialLinks: { ...prev.socialLinks!, [key]: value } as SocialLinks
      }));
   };

   const updateTheme = (updates: Partial<ThemeSettings>) => {
      setCardData(prev => ({
         ...prev,
         theme: { ...prev.theme!, ...updates }
      }));
   };

   const handleSave = async () => {
      setSaving(true);
      try {
         // Auto-generate slug if missing
         let savePayload = { ...cardData };
         if (!savePayload.usernameSlug && savePayload.name) {
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            savePayload.usernameSlug = savePayload.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + randomSuffix;
         } else if (!savePayload.usernameSlug) {
            // Fallback if no name either
            savePayload.usernameSlug = 'user-' + Math.random().toString(36).substring(2, 9);
         }

         if (cardData.id) {
            await CardService.updateCard(cardData.id, savePayload);
         } else {
            const user = await authApi.getCurrentUser();
            if (user) {
               await CardService.createCard(user.id, savePayload);
            } else {
               // Redirect to login if not authenticated (unlikely if in editor but possible)
               navigate('/auth');
               return;
            }
         }
         navigate('/dashboard');
      } catch (err) { alert('Error saving'); console.error(err); } finally { setSaving(false); }
   };

   if (loading) return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
         <div className="w-12 h-12 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin" />
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Booting Studio Environment</p>
      </div>
   );

   return (
      <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col lg:flex-row gap-20">
         {/* Editor Controls */}
         <div className="flex-1 max-w-2xl">
            <div className="flex items-center justify-between mb-10">
               <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-400 hover:text-slate-950 transition-colors font-black uppercase tracking-widest text-xs">
                  <ChevronLeft className="w-4 h-4 mr-1" />Workspace
               </button>

               <div className="flex items-center gap-1 p-1.5 bg-slate-100 rounded-full border border-slate-200 shadow-inner">
                  <button onClick={() => setEditorMode('quick')} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${editorMode === 'quick' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>Quick</button>
                  <button onClick={() => setEditorMode('expert')} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${editorMode === 'expert' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>Expert Mode</button>
               </div>
            </div>

            <div className="mb-14">
               <h1 className="text-7xl font-black font-outfit text-slate-950 mb-4 tracking-tighter uppercase leading-none">Ura Studio</h1>
               <div className="flex items-center gap-3">
                  <Figma className="w-4 h-4 text-amber-500" />
                  <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Institutional Designer v4.0 Platinum Edition</p>
               </div>
            </div>

            <div className="space-y-8">
               {editorMode === 'quick' ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <section className="bg-white p-10 bento-card border-slate-900/5 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                              <input type="text" name="name" value={cardData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-950 font-bold outline-none" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Public Email</label>
                              <input type="email" name="email" value={cardData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-950 font-bold outline-none" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Role</label>
                              <input type="text" name="role" value={cardData.role} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-950 font-bold outline-none" />
                           </div>
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Institution</label>
                              <input type="text" name="company" value={cardData.company} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-950 font-bold outline-none" />
                           </div>
                        </div>
                     </section>

                     <section className="bg-white p-10 bento-card space-y-10">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Essential Networking</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">LinkedIn (Full URL)</label>
                              <input type="text" value={cardData.socialLinks?.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">GitHub (Full URL)</label>
                              <input type="text" value={cardData.socialLinks?.github} onChange={(e) => handleSocialChange('github', e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none" />
                           </div>
                        </div>
                     </section>
                  </div>
               ) : (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex flex-wrap gap-2 p-1.5 bg-slate-50 rounded-full border border-slate-100 w-fit mb-10 overflow-hidden shadow-inner">
                        {[
                           { id: 'identity', icon: User },
                           { id: 'socials', icon: Share2 },
                           { id: 'fields', icon: Hash },
                           { id: 'styling', icon: Palette },
                           { id: 'smart', icon: Zap }
                        ].map(tab => (
                           <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id as any)}
                              className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-slate-950 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                              <tab.icon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{tab.id}</span>
                           </button>
                        ))}
                     </div>

                     {activeTab === 'identity' && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                           <section className="bg-white p-12 bento-card space-y-10 shadow-xl border-slate-900/5">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Name</label>
                                    <input type="text" name="name" value={cardData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-950 font-bold outline-none" />
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Corporate Role</label>
                                    <input type="text" name="role" value={cardData.role} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-950 font-bold outline-none" />
                                 </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-1">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                                       <button
                                          onClick={() => setCardData(prev => ({ ...prev, isPhonePrivate: !prev.isPhonePrivate }))}
                                          className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${cardData.isPhonePrivate ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                                       >
                                          {cardData.isPhonePrivate ? 'Private' : 'Public'}
                                       </button>
                                    </div>
                                    <input type="text" name="phone" value={cardData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-950 font-bold outline-none" />
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institution Alias</label>
                                    <input type="text" name="usernameSlug" value={cardData.usernameSlug} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-950 font-bold outline-none" />
                                 </div>
                              </div>
                           </section>

                           <section className="bg-white p-12 bento-card space-y-10">
                              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Professional Avatars</h3>
                              <div className="space-y-10">
                                 <div>
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Executive Collection (M)</p>
                                    <div className="grid grid-cols-4 gap-4">
                                       {AVATAR_COLLECTION.boys.map(av => (
                                          <button key={av.id} onClick={() => setCardData(prev => ({ ...prev, profileImage: av.url }))} className={`p-1.5 rounded-3xl border-2 transition-all ${cardData.profileImage === av.url ? 'border-amber-500 bg-amber-50 scale-105 shadow-lg' : 'border-slate-50 bg-slate-50'}`}>
                                             <img src={av.url} className="w-full h-auto rounded-2xl" />
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                                 <div>
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Executive Collection (F)</p>
                                    <div className="grid grid-cols-4 gap-4">
                                       {AVATAR_COLLECTION.girls.map(av => (
                                          <button key={av.id} onClick={() => setCardData(prev => ({ ...prev, profileImage: av.url }))} className={`p-1.5 rounded-3xl border-2 transition-all ${cardData.profileImage === av.url ? 'border-amber-500 bg-amber-50 scale-105 shadow-lg' : 'border-slate-50 bg-slate-50'}`}>
                                             <img src={av.url} className="w-full h-auto rounded-2xl" />
                                          </button>
                                       ))}
                                    </div>
                                 </div>

                                 <div className="space-y-4 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="flex items-center justify-between">
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Profile Image</label>
                                       <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Max 2MB</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <div className="relative flex-1">
                                          <input
                                             type="file"
                                             accept="image/*"
                                             onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                try {
                                                   setLoading(true);
                                                   const url = await StorageService.uploadImage(file, 'profiles');
                                                   setCardData(prev => ({ ...prev, profileImage: url }));
                                                } catch (err) {
                                                   alert('Upload failed. Ensure "images" bucket exists and is public.');
                                                } finally {
                                                   setLoading(false);
                                                }
                                             }}
                                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          />
                                          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl px-6 py-4 text-xs font-bold text-slate-400 text-center hover:border-amber-400 hover:text-amber-500 transition-all">
                                             {loading ? 'Uploading...' : 'Click to Upload Custom Photo'}
                                          </div>
                                       </div>
                                       {cardData.profileImage && !cardData.profileImage.includes('dicebear') && (
                                          <div className="w-12 h-12 rounded-xl bg-cover bg-center shadow-lg border-2 border-white" style={{ backgroundImage: `url(${cardData.profileImage})` }} />
                                       )}
                                    </div>
                                 </div>

                                 <div className="space-y-4 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Mark / Institution Logo</label>
                                    <div className="flex gap-4">
                                       <div className="relative flex-1">
                                          <input
                                             type="file"
                                             accept="image/*"
                                             onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                try {
                                                   setLoading(true);
                                                   const url = await StorageService.uploadImage(file, 'brands');
                                                   setCardData(prev => ({ ...prev, brandLogo: url }));
                                                } catch (err) {
                                                   alert('Upload failed.');
                                                } finally {
                                                   setLoading(false);
                                                }
                                             }}
                                             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          />
                                          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl px-6 py-4 text-xs font-bold text-slate-400 text-center hover:border-amber-400 hover:text-amber-500 transition-all">
                                             {loading ? 'Uploading...' : 'Upload Logo File'}
                                          </div>
                                       </div>
                                       <input type="text" placeholder="OR paste URL..." value={cardData.brandLogo} onChange={(e) => setCardData(prev => ({ ...prev, brandLogo: e.target.value }))} className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xs font-bold outline-none focus:border-amber-500 transition-colors" />
                                    </div>
                                 </div>
                              </div>
                           </section>
                        </motion.div>
                     )}

                     {activeTab === 'socials' && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                           <section className="bg-white p-12 bento-card grid grid-cols-1 md:grid-cols-2 gap-10">
                              {[
                                 { key: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-600', bg: 'bg-blue-50' },
                                 { key: 'github', icon: Github, label: 'GitHub', color: 'text-slate-950', bg: 'bg-slate-100' },
                                 { key: 'twitter', icon: Twitter, label: 'X / Twitter', color: 'text-sky-500', bg: 'bg-sky-50' },
                                 { key: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-600', bg: 'bg-pink-50' },
                                 { key: 'tiktok', icon: Music, label: 'TikTok', color: 'text-slate-900', bg: 'bg-slate-50' },
                                 { key: 'youtube', icon: Youtube, label: 'YouTube', color: 'text-red-600', bg: 'bg-red-50' },
                                 { key: 'whatsapp', icon: Send, label: 'WhatsApp', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                 { key: 'website', icon: Globe, label: 'Public Domain', color: 'text-amber-600', bg: 'bg-amber-50' }
                              ].map(s => (
                                 <div key={s.key} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                       <div className={`p-2 ${s.bg} ${s.color} rounded-xl`}><s.icon className="w-4 h-4" /></div>
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</label>
                                    </div>
                                    <input type="text" value={cardData.socialLinks?.[s.key as keyof SocialLinks] as string} onChange={(e) => handleSocialChange(s.key as any, e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-950 font-bold outline-none focus:border-amber-500 transition-all" />
                                 </div>
                              ))}
                           </section>
                        </motion.div>
                     )}

                     {activeTab === 'styling' && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                           <section className="bg-white p-12 bento-card space-y-12">
                              <div className="grid grid-cols-2 gap-14">
                                 <div className="space-y-8">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Corner Precision</label>
                                    <input type="range" min="0" max="60" value={cardData.theme?.borderRadius} onChange={(e) => updateTheme({ borderRadius: parseInt(e.target.value) })} className="w-full h-2 bg-slate-100 rounded-full accent-amber-500 appearance-none cursor-pointer" />
                                 </div>
                                 <div className="space-y-8">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Glass Intensity</label>
                                    <input type="range" min="0" max="100" value={cardData.theme?.glassIntensity} onChange={(e) => updateTheme({ glassIntensity: parseInt(e.target.value) })} className="w-full h-2 bg-slate-100 rounded-full accent-amber-500 appearance-none cursor-pointer" />
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-14">
                                 <div className="space-y-8">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shadow Projection</label>
                                    <input type="range" min="0" max="100" value={cardData.theme?.shadowDepth} onChange={(e) => updateTheme({ shadowDepth: parseInt(e.target.value) })} className="w-full h-2 bg-slate-100 rounded-full accent-amber-500 appearance-none cursor-pointer" />
                                 </div>
                                 <div className="space-y-8">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Alignment</label>
                                    <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                                       <button onClick={() => updateTheme({ alignment: 'left' })} className={`flex-1 flex justify-center py-3 rounded-xl transition-all ${cardData.theme?.alignment === 'left' ? 'bg-white shadow-md text-slate-900' : 'text-slate-300'}`}><AlignLeft className="w-5 h-5" /></button>
                                       <button onClick={() => updateTheme({ alignment: 'center' })} className={`flex-1 flex justify-center py-3 rounded-xl transition-all ${cardData.theme?.alignment === 'center' ? 'bg-white shadow-md text-slate-900' : 'text-slate-300'}`}><AlignCenter className="w-5 h-5" /></button>
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-8">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atmospheric Background (Presets)</label>
                                 <div className="flex flex-wrap gap-5">
                                    {GRADIENT_PRESETS.map(p => (
                                       <button key={p.name} onClick={() => updateTheme({ gradientFrom: p.from, gradientTo: p.to, backgroundType: 'gradient' })} className={`w-16 h-16 rounded-[1.5rem] border-4 transition-all ${cardData.theme?.gradientFrom === p.from ? 'border-amber-500 scale-110 shadow-2xl' : 'border-white shadow-sm'}`} style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }} />
                                    ))}
                                 </div>
                              </div>

                              <div className="space-y-4 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Background Image (URL)</label>
                                 <div className="flex gap-4">
                                    <input type="text" placeholder="https://..." value={cardData.theme?.backgroundImage} onChange={(e) => updateTheme({ backgroundImage: e.target.value, backgroundType: 'image' })} className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xs font-bold outline-none" />
                                    {cardData.theme?.backgroundImage && <button onClick={() => updateTheme({ backgroundImage: undefined, backgroundType: 'gradient' })} className="p-3 text-red-500 hover:text-red-600"><X className="w-5 h-5" /></button>}
                                 </div>
                              </div>
                           </section>

                           <section className="bg-slate-950 p-12 bento-card text-white space-y-10">
                              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Branded QR Configuration</h3>
                              <div className="grid grid-cols-2 gap-10">
                                 <div className="space-y-6">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">QR Color Palette</label>
                                    <input type="color" value={cardData.theme?.qrColor} onChange={(e) => updateTheme({ qrColor: e.target.value })} className="w-full h-12 bg-transparent border border-white/10 rounded-xl cursor-pointer" />
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <button
                                       onClick={() => updateTheme({ qrLogoEnabled: !cardData.theme?.qrLogoEnabled })}
                                       className={`w-14 h-8 rounded-full transition-all relative ${cardData.theme?.qrLogoEnabled ? 'bg-amber-500' : 'bg-white/10'}`}
                                    >
                                       <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${cardData.theme?.qrLogoEnabled ? 'left-7' : 'left-1'}`} />
                                    </button>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Embed Institutional Logo</span>
                                 </div>
                              </div>
                           </section>
                        </motion.div>
                     )}

                     {activeTab === 'smart' && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                           <section className="bg-white p-12 bento-card space-y-10">
                              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Conversion Path (CTA)</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {[
                                    { id: 'save_contact', icon: Download, label: 'Save Contact', desc: 'Direct contact export' },
                                    { id: 'book_call', icon: Calendar, label: 'Book a Call', desc: 'Link to your scheduler' },
                                    { id: 'visit_website', icon: ExternalLink, label: 'Visit Website', desc: 'Primary landing path' },
                                    { id: 'view_portfolio', icon: Briefcase, label: 'View Portfolio', desc: 'Professional track record' },
                                    { id: 'download_brochure', icon: FileText, label: 'Brochure', desc: 'Institutional overview' }
                                 ].map(cta => (
                                    <button
                                       key={cta.id}
                                       onClick={() => setCardData(prev => ({ ...prev, primaryCTA: cta.id as PrimaryCTA }))}
                                       className={`p-8 text-left rounded-3xl border-2 transition-all flex flex-col items-start gap-4 ${cardData.primaryCTA === cta.id ? 'border-amber-500 bg-amber-50/30 shadow-lg' : 'border-slate-50 bg-slate-50'}`}
                                    >
                                       <div className={`p-3 rounded-2xl ${cardData.primaryCTA === cta.id ? 'bg-amber-500 text-white' : 'bg-white text-slate-400'}`}><cta.icon className="w-6 h-6" /></div>
                                       <div>
                                          <p className="font-black text-slate-950 uppercase text-xs tracking-widest mb-1">{cta.label}</p>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase">{cta.desc}</p>
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           </section>

                           <section className="bg-slate-950 p-12 bento-card text-white space-y-8">
                              <div className="flex items-center justify-between">
                                 <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Link Optimization</h3>
                                 <button className="flex items-center gap-2 px-6 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                                    <Zap className="w-3 h-3 text-amber-500" /> Auto-Prioritize
                                 </button>
                              </div>
                              <p className="text-sm text-slate-400 font-medium">Automatically reorder links based on most clicked, most recent, or proximity engagement data.</p>
                           </section>
                        </motion.div>
                     )}
                  </div>
               )}
            </div>

            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleSave}
               disabled={saving}
               className="mt-20 w-full py-9 bg-slate-950 text-white font-black text-xl rounded-[3rem] shadow-2xl flex items-center justify-center space-x-4 transition-all uppercase tracking-widest"
            >
               {saving ? 'Synchronizing Ura Core...' : <><Save className="w-6 h-6 text-amber-500" /><span>Publish Changes</span></>}
            </motion.button>
         </div>

         {/* Live Preview Column */}
         <div className="lg:w-[450px]">
            <div className="lg:sticky lg:top-32 text-center">
               <div className="mb-12 inline-flex items-center gap-3 px-8 py-3 bg-slate-50 rounded-full border border-slate-100 shadow-inner">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Live Studio Monitor (v4.0)</span>
               </div>
               <CardPreview data={cardData as CardData} />
               <p className="mt-10 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Institutional Standard Rendering active</p>
            </div>
         </div>
      </div>
   );
};

export default EditorPage;
