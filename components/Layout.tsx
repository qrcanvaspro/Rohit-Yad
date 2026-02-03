
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
    <div className="flex flex-col min-h-screen bg-[#fffdf0] hero-pattern">
      {/* Decorative Shloka Bar */}
      <div className="h-10 saffron-gradient text-white flex items-center justify-center gap-10 px-6 overflow-hidden z-[60]">
         <span className="text-[11px] font-black uppercase tracking-[1em] whitespace-nowrap animate-pulse">सा विद्या या विमुक्तये</span>
         <div className="hidden md:block w-3 h-3 bg-white/20 rounded-full"></div>
         <span className="hidden md:block text-[11px] font-black uppercase tracking-[1em] whitespace-nowrap opacity-60">Saraswati Vidya Mandir &bull; Rambagh Basti</span>
         <div className="hidden md:block w-3 h-3 bg-white/20 rounded-full"></div>
         <span className="text-[11px] font-black uppercase tracking-[1em] whitespace-nowrap animate-pulse">तमसो मा ज्योतिर्गमय</span>
      </div>

      <header className="bg-white/90 backdrop-blur-3xl border-b-4 border-amber-500/10 sticky top-0 z-50 px-10 h-32">
        <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 gold-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/40 border-2 border-white/20">
              <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-amber-950 uppercase tracking-tighter leading-none">{schoolName}</h1>
              <p className="text-[12px] font-black text-amber-600 uppercase tracking-[0.5em] mt-2.5 opacity-80">{role} Authorized Gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <div className="hidden lg:block text-right">
              <p className="text-[11px] font-black text-amber-950/30 uppercase tracking-[0.3em] mb-1.5">Authorized Identity</p>
              <p className="text-lg font-black text-amber-950 uppercase tracking-tight">{user?.name || 'Academic Scholar'}</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-red-50 hover:bg-red-100 text-red-900/60 hover:text-red-950 px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all border-2 border-red-500/10 active:scale-95 shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-10 py-20 relative">
         <div className="relative z-10">
            {children}
         </div>
      </main>

      <footer className="py-32 bg-white border-t-8 border-amber-500/5">
        <div className="max-w-7xl mx-auto px-10 flex flex-col items-center">
          <div className="flex items-center gap-12 mb-12">
            <div className="h-px w-32 bg-amber-200/40"></div>
            <div className="w-6 h-6 gold-gradient rounded-full shadow-2xl shadow-amber-500/50"></div>
            <div className="h-px w-32 bg-amber-200/40"></div>
          </div>
          <p className="text-[13px] font-black text-amber-950/30 uppercase tracking-[1em] mb-8 animate-pulse">Official Academic Archive &bull; V6.5</p>
          <p className="text-sm font-bold text-amber-950/40 tracking-tight text-center max-w-2xl">
            Saraswati Vidya Mandir, Rambagh Basti. This system is monitored and protected. All data processed is property of the Principal's Office.
          </p>
        </div>
      </footer>
    </div>
  );
};
