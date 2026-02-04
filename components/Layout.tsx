
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
    <div className="flex flex-col min-h-screen bg-[#fffdf0] hero-pattern-rich">
      {/* Heavy Decorative Status Bar */}
      <div className="h-14 saffron-gradient text-white flex items-center justify-center gap-16 px-10 overflow-hidden z-[100] shadow-2xl">
         <span className="shloka-font text-lg font-black tracking-[0.3em] animate-pulse">सा विद्या या विमुक्तये</span>
         <div className="hidden md:block w-4 h-4 bg-white/30 rounded-full animate-bounce"></div>
         <span className="hidden md:block text-[12px] font-black uppercase tracking-[1em] opacity-80 whitespace-nowrap">SVM Official Academic Repository &bull; Rambagh Basti</span>
         <div className="hidden md:block w-4 h-4 bg-white/30 rounded-full animate-bounce"></div>
         <span className="shloka-font text-lg font-black tracking-[0.3em] animate-pulse">तमसो मा ज्योतिर्गमय</span>
      </div>

      <header className="bg-white/95 backdrop-blur-3xl border-b-8 border-orange-500/10 sticky top-0 z-50 px-12 h-36">
        <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="w-20 h-20 gold-gradient rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-orange-500/40 border-4 border-white">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-orange-950 uppercase tracking-tighter leading-none">{schoolName}</h1>
              <p className="text-[13px] font-black text-orange-600 uppercase tracking-[0.6em] mt-3 opacity-80">Authenticated: {role}</p>
            </div>
          </div>

          <div className="flex items-center gap-14">
            <div className="hidden lg:block text-right">
              <p className="text-[12px] font-black text-orange-950/30 uppercase tracking-[0.4em] mb-2">Academic Profile</p>
              <p className="text-2xl font-black text-orange-950 uppercase tracking-tight">{user?.name || 'Authorized Scholar'}</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-red-50 hover:bg-red-600 hover:text-white px-14 py-6 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] transition-all border-4 border-red-500/10 active:scale-90 shadow-xl"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-12 py-24 relative z-10">
         {children}
      </main>

      <footer className="py-40 bg-white border-t-8 border-orange-500/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-12 flex flex-col items-center">
          <div className="flex items-center gap-16 mb-16">
            <div className="h-1 w-48 bg-orange-100/50 rounded-full"></div>
            <div className="w-10 h-10 gold-gradient rounded-full shadow-2xl border-4 border-white animate-pulse"></div>
            <div className="h-1 w-48 bg-orange-100/50 rounded-full"></div>
          </div>
          <p className="text-[15px] font-black text-orange-950/30 uppercase tracking-[1.2em] mb-10 text-center">Vidya Bharti Digital Integration &bull; 2024</p>
          <div className="bg-orange-50/50 p-10 rounded-[3rem] border-4 border-orange-100 max-w-4xl text-center">
             <p className="text-lg font-bold text-orange-950/50 leading-relaxed italic">
               "This portal serves as the official digital repository for Saraswati Vidya Mandir, Rambagh Basti. All intellectual and academic property recorded within this vault is protected by institutional mandates."
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
