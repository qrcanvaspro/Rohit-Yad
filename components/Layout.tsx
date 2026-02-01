import React from 'react';
import { Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  role: Role;
  onLogout: () => void;
  schoolName: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, role, onLogout, schoolName }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-slate-900 border-b border-white/5 sticky top-0 z-50 px-6 h-24">
        <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 saffron-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/20">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{schoolName}</h1>
              <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] mt-1.5">{role} Access</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:block text-right">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">Authorized Identity</p>
              <p className="text-sm font-black text-white uppercase tracking-tight">{user?.name || 'System User'}</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/10 active:scale-95"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        {children}
      </main>

      <footer className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-px w-16 bg-slate-200"></div>
            <div className="w-3 h-3 saffron-gradient rounded-full"></div>
            <div className="h-px w-16 bg-slate-200"></div>
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] mb-4">Integrated Portal v5.0 Platinum</p>
          <p className="text-xs font-bold text-slate-400">© 2024 Saraswati Vidya Mandir Rambagh Basti. Secure Examination Services.</p>
        </div>
      </footer>
    </div>
  );
};