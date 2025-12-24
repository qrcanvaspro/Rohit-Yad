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
  const themeColor = role === 'STUDENT' ? 'orange' : role === 'TEACHER' ? 'indigo' : 'slate';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
              <svg className="w-7 h-7 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">{schoolName}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{role} PORTAL ACCESS</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
              <p className="text-sm font-bold text-slate-800">{user?.name || 'Authorized User'}</p>
            </div>
            <button 
              onClick={onLogout}
              className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10 relative z-10">
        {children}
      </main>

      <footer className="py-12 bg-white/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-slate-200"></div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Academic System v5.0</p>
            <div className="h-px w-12 bg-slate-200"></div>
          </div>
          <p className="text-xs font-bold text-slate-400">© 2024 Saraswati Vidya Mandir Rambagh Basti. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};