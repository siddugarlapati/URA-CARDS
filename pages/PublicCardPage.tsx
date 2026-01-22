
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CardService } from '../services/cards';
import { AnalyticsService } from '../services/analytics';
import { CardData } from '../types';
import CardPreview from '../components/CardPreview';
import { Sparkles, ArrowUpRight, Hexagon, ShieldCheck, Lock, Share2, Users } from 'lucide-react';

const PublicCardPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      CardService.getCardBySlug(username)
        .then((data) => {
          setCard(data);
          if (data) {
            AnalyticsService.trackEvent({
              card_id: data.id,
              event_type: 'view'
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [username]);

  const handleLinkClick = (type: string, url: string) => {
    if (card) {
      AnalyticsService.trackEvent({
        card_id: card.id,
        event_type: 'click',
        metadata: { link_type: type, url }
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <div className="w-12 h-12 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Identity</p>
    </div>
  );

  if (!card) return (
    <div className="min-h-screen flex items-center justify-center p-12 text-center bg-slate-50">
      <div className="max-w-md bento-card p-16 bg-white shadow-2xl">
        <Hexagon className="w-16 h-16 text-slate-200 mx-auto mb-8" />
        <h1 className="text-4xl font-black font-outfit text-slate-950 mb-4 uppercase">Identity Hidden</h1>
        <p className="text-slate-500 font-medium mb-12">This master identity has restricted public visibility or does not exist.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest border-b-2 border-amber-500 pb-1">Return to Base</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-16 px-8 flex flex-col items-center justify-center relative bg-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden select-none">
        <h1 className="text-[30vw] font-black text-slate-950 leading-none rotate-[-15deg] whitespace-nowrap uppercase tracking-tighter">URA NETWORK</h1>
      </div>

      <div className="fixed top-12 left-12 flex items-center gap-3 z-50">
        <Hexagon className="w-10 h-10 text-slate-950 fill-current" />
        <span className="text-2xl font-black font-outfit text-slate-950 tracking-tighter uppercase">URA</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full flex flex-col items-center"
      >
        <div className="mb-14 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 border border-slate-100 mb-8 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Verified Institutional Identity</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-3 italic">Discovering profile of</p>
          <h2 className="text-5xl md:text-6xl font-black font-outfit text-slate-950 uppercase tracking-tighter leading-none">{card.name}</h2>
        </div>

        <CardPreview data={card} onLinkClick={handleLinkClick} />

        <div className="mt-20 flex flex-col items-center space-y-12 w-full max-w-sm">
          <Link to="/auth" className="group w-full flex items-center justify-center space-x-4 bg-slate-950 text-white px-10 py-6 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(2,6,23,0.3)] transition-all hover:scale-105">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span className="font-black text-sm uppercase tracking-widest">Join the Network</span>
            <ArrowUpRight className="w-5 h-5 text-white/40" />
          </Link>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
              <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> Encrypted Vault</span>
              <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> 2.4k Mutuals</span>
            </div>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Private fields visible only to selected members</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicCardPage;
