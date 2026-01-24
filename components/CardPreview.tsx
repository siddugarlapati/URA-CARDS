
import React from 'react';
import { CardData, SocialLinks } from '../types';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Phone, Mail, Globe, Linkedin, Twitter, Github, Instagram,
  MapPin, Download, ShieldCheck, Hexagon,
  Youtube, Send, Music, Lock, Calendar, ExternalLink, Briefcase, FileText
} from 'lucide-react';

interface Props {
  data: CardData;
  scale?: number;
  interactive?: boolean;
  isFollowing?: boolean;
  onLinkClick?: (type: string, url: string) => void;
}

const CardPreview: React.FC<Props> = ({ data, scale = 1, interactive = true, isFollowing = false, onLinkClick }) => {
  const { theme } = data;
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [18, -18]);
  const rotateY = useTransform(x, [-100, 100], [-18, 18]);

  const springRotateX = useSpring(rotateX, { stiffness: 400, damping: 40 });
  const springRotateY = useSpring(rotateY, { stiffness: 400, damping: 40 });

  const reflectionOpacity = useTransform(y, [-100, 100], [0.15, 0.25]);
  const reflectionX = useTransform(x, [-100, 100], [-50, 50]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const bRadius = theme.borderRadius ?? 40;
  const glassAlpha = (theme.glassIntensity ?? 40) / 100;
  const shadowValue = (theme.shadowDepth ?? 20) / 100 * 80;
  const textAlign = theme.alignment === 'left' ? 'text-left items-start' : 'text-center items-center';

  const socialIconMap: { [key: string]: any } = {
    linkedin: Linkedin,
    github: Github,
    twitter: Twitter,
    instagram: Instagram,
    tiktok: Music,
    youtube: Youtube,
    whatsapp: Send,
    website: Globe
  };

  const bgStyle = theme.backgroundType === 'image' && theme.backgroundImage
    ? { backgroundImage: `url(${theme.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})` };

  const getCTAIcon = () => {
    switch (data.primaryCTA) {
      case 'book_call': return <Calendar className="w-5 h-5" />;
      case 'visit_website': return <ExternalLink className="w-5 h-5" />;
      case 'view_portfolio': return <Briefcase className="w-5 h-5" />;
      case 'download_brochure': return <FileText className="w-5 h-5" />;
      default: return <Download className="w-5 h-5" />;
    }
  };

  const getCTAText = () => {
    switch (data.primaryCTA) {
      case 'book_call': return 'Schedule Consult';
      case 'visit_website': return 'Explore HQ';
      case 'view_portfolio': return 'Review Credentials';
      case 'download_brochure': return 'Download Assets';
      default: return 'Save Contact';
    }
  };

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[340px] aspect-[9/16] p-3 bg-white group select-none overflow-hidden border border-slate-900/5 shadow-[0_60px_120px_-30px_rgba(2,6,23,0.3)] shrink-0"
      style={{
        scale,
        borderRadius: bRadius + 14,
        rotateX: springRotateX,
        rotateY: springRotateY,
        perspective: 2500,
        ...bgStyle
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Lighting Reflection Overlay */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
        style={{
          borderRadius: bRadius + 14,
          opacity: reflectionOpacity,
          background: `linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.6) 50%, transparent 65%)`,
          x: reflectionX
        }}
      />

      <div
        className={`h-full w-full border border-white/50 flex flex-col ${textAlign} p-9 pb-12 relative overflow-y-auto no-scrollbar shadow-[inset_0_4px_30px_rgba(255,255,255,0.9)]`}
        style={{
          borderRadius: bRadius,
          backgroundColor: `rgba(255, 255, 255, ${glassAlpha})`,
          backdropFilter: `blur(${(theme.glassIntensity ?? 40) / 3}px)`
        }}
      >
        <div className="w-full flex justify-between items-center mb-10">
          <Hexagon className="w-8 h-8 text-slate-950 fill-current opacity-20" />
          {data.brandLogo ? (
            <img src={data.brandLogo} className="h-7 w-auto object-contain opacity-70 filter grayscale brightness-50" />
          ) : (
            <div className="h-1.5 w-14 bg-slate-950/10 rounded-full" />
          )}
        </div>

        <div className="relative mb-10">
          <div className="w-32 h-32 rounded-full p-2 border-2 border-slate-950/20 shadow-2xl bg-white overflow-hidden ring-8 ring-white/50 group-hover:scale-105 transition-transform duration-1000 ease-out">
            <img src={data.profileImage} alt={data.name} className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-slate-950 border-2 border-white shadow-2xl flex items-center justify-center text-amber-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className={`w-full mb-10 ${textAlign}`}>
          <h2 className="text-4xl font-black font-outfit text-slate-950 leading-tight mb-3 tracking-tighter uppercase">{data.name || 'Julian Thorne'}</h2>
          <div className={`flex flex-col ${textAlign} space-y-1`}>
            <p className="text-[12px] font-black text-amber-600 uppercase tracking-[0.5em]">{data.role || 'Founding Partner'}</p>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">{data.company || 'Ura Capital'}</p>
          </div>
        </div>

        {data.bio && <p className={`w-full ${textAlign} text-xs font-medium text-slate-600 mb-10 px-3 leading-relaxed opacity-80 italic`}>"{data.bio}"</p>}

        <div className="w-full flex flex-col gap-3.5 mb-10">
          {data.phone && (
            <div className="flex items-center gap-4 bg-white/40 px-6 py-4.5 rounded-[2.5rem] border border-white/60 shadow-sm backdrop-blur-md">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-900 flex-1">
                {data.isPhonePrivate ? '•••• •••• •••' : data.phone}
              </span>
              {data.isPhonePrivate && <Lock className="w-4 h-4 text-amber-500" />}
            </div>
          )}
          {data.email && (
            <div className="flex items-center gap-4 bg-white/40 px-6 py-4.5 rounded-[2.5rem] border border-white/60 shadow-sm backdrop-blur-md">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-900 flex-1 truncate">{data.email}</span>
            </div>
          )}
        </div>

        {data.customFields && data.customFields.length > 0 && (
          <div className={`grid ${theme.bentoDensity === 'high' ? 'grid-cols-2' : 'grid-cols-1'} w-full gap-3.5 mb-12`}>
            {data.customFields.slice(0, 4).map((field) => field.value && (
              <div key={field.id} className="bg-slate-950/[0.04] p-5 rounded-[2.5rem] border border-white/30 overflow-hidden hover:bg-white/70 transition-all cursor-default text-left">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{field.key}</p>
                <p className="text-sm font-black text-slate-950 truncate tracking-tight leading-none">{field.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-4 w-full gap-3.5 mb-14">
          {Object.entries(socialIconMap).map(([key, Icon]) => {
            const url = data.socialLinks?.[key as keyof SocialLinks];
            if (!url || typeof url !== 'string' || url.length < 3) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick?.(key, url)}
                className="aspect-square bg-white shadow-sm rounded-[2rem] flex items-center justify-center text-slate-950 hover:bg-slate-950 hover:text-white transition-all transform hover:-translate-y-1.5 active:scale-90 border border-slate-950/5"
              >
                <Icon className="w-5.5 h-5.5" />
              </a>
            );
          })}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onLinkClick?.('primary_cta', data.primaryCTA)}
          className={`mt-auto w-full py-7 font-black text-white shadow-[0_30px_60px_-15px_rgba(2,6,23,0.4)] flex items-center justify-center space-x-3 transition-all ${theme.buttonStyle === 'pill' ? 'rounded-full' : 'rounded-[2.5rem]'}`}
          style={{ backgroundColor: theme.primaryColor || '#020617' }}
        >
          {getCTAIcon()}
          <span className="tracking-[0.4em] uppercase text-[11px] font-black">{getCTAText()}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CardPreview;
