
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Shield, Bell, User as UserIcon, Lock, 
  CreditCard, Eye, EyeOff, Info, LogOut 
} from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User;
  onUpdate: (user: User) => void;
}

const SettingsPage: React.FC<Props> = ({ user, onUpdate }) => {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState({
    incognito: false,
    verifiedOnly: true,
    autoApprove: false
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-slate-950 mb-10 font-black uppercase tracking-widest text-xs transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />Workspace
      </button>

      <h1 className="text-5xl font-black font-outfit text-slate-950 mb-12 tracking-tighter">Account Management</h1>

      <div className="space-y-12">
        {/* Profile Info */}
        <section className="bento-card p-10">
          <h3 className="text-xl font-black font-outfit mb-8 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-amber-600" /> Master Identity
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Name</label>
              <input type="text" defaultValue={user.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Email</label>
              <input type="email" defaultValue={user.email} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold outline-none" />
            </div>
          </div>
        </section>

        {/* Global Privacy Engine */}
        <section className="bento-card p-10">
          <h3 className="text-xl font-black font-outfit mb-8 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" /> Privacy Engine
          </h3>
          <div className="space-y-6">
            {[
              { id: 'incognito', label: 'Incognito Visibility', desc: 'Hide all identities from public search results and discovery.' },
              { id: 'verifiedOnly', label: 'Verified Connections Only', desc: 'Protect sensitive contact fields (phone/email) from non-verified users.' },
              { id: 'autoApprove', label: 'Auto-Approve Requests', desc: 'Automatically grant contact access to users from your same organization.' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="max-w-md">
                   <p className="font-black text-slate-900 mb-1">{item.label}</p>
                   <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                </div>
                <button 
                  onClick={() => setPrivacy(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof privacy] }))}
                  className={`w-14 h-8 rounded-full transition-all relative ${privacy[item.id as keyof typeof privacy] ? 'bg-slate-950' : 'bg-slate-200'}`}
                >
                   <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${privacy[item.id as keyof typeof privacy] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Access */}
        <div className="flex flex-col md:flex-row gap-6">
           <button className="flex-1 p-8 bento-card border-amber-100 hover:border-amber-300 transition-all text-left">
              <div className="p-3 bg-amber-50 rounded-2xl w-fit mb-6 text-amber-600"><Lock className="w-6 h-6" /></div>
              <p className="font-black font-outfit text-lg text-slate-950 mb-1">Update Password</p>
              <p className="text-xs text-slate-400">Regularly rotate credentials for security.</p>
           </button>
           <button className="flex-1 p-8 bento-card border-red-50 hover:border-red-200 transition-all text-left group">
              <div className="p-3 bg-red-50 rounded-2xl w-fit mb-6 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all"><LogOut className="w-6 h-6" /></div>
              <p className="font-black font-outfit text-lg text-slate-950 mb-1">Terminate Session</p>
              <p className="text-xs text-slate-400">Log out of the current LuxeCard environment.</p>
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
