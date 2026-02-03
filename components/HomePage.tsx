
import React, { useState } from 'react';

interface HomePageProps {
  onEnterPortal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterPortal }) => {
  const [showTour, setShowTour] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdf0] relative overflow-hidden hero-pattern">
      {/* Moving Heritage Objects */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="moving-object" 
          style={{ top: `${15 + i * 15}%`, animationDelay: `${i * 7}s`, animationDuration: `${30 + i * 5}s` }}
        >
          {i % 2 === 0 ? (
            <svg className="w-16 h-16 text-amber-600/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20V5H6.5a2.5 2.5 0 000 5H20v11H6.5C4.01 21 2 18.99 2 16.5V6a2 2 0 012-2h16a2 2 0 012 2v15a1 1 0 01-1 1H6.5a1 1 0 01-2.5-1.5z"/>
            </svg>
          ) : (
            <svg className="w-20 h-20 text-amber-500/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v2.81L12 20l7-4.01v-2.81l-7 4-7-4z"/>
            </svg>
          )}
        </div>
      ))}

      {/* Vertical Shloka Sidebars */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4 opacity-10">
        <div className="shlok-text text-amber-950 font-black text-xl">सा विद्या या विमुक्तये</div>
        <div className="h-32 w-px bg-amber-950/20"></div>
      </div>
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-4 opacity-10">
        <div className="h-32 w-px bg-amber-950/20"></div>
        <div className="shlok-text text-amber-950 font-black text-xl">तमसो मा ज्योतिर्गमय</div>
      </div>

      {/* Navigation */}
      <nav className="h-28 px-8 md:px-16 flex justify-between items-center fixed top-0 w-full z-50 glass border-b-2 border-amber-500/20">
        <div className="flex items-center gap-6 group cursor-pointer">
          <div className="w-16 h-16 saffron-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-900/30 group-hover:rotate-12 transition-all duration-500 border-2 border-white/20">
            <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-amber-950 uppercase tracking-tighter text-3xl leading-none">SVM RAMBAGH</span>
            <span className="text-[11px] font-black text-amber-700 uppercase tracking-[0.5em] mt-2 opacity-60">BASTI • UTTAR PRADESH</span>
          </div>
        </div>
        <div className="hidden lg:flex gap-12 items-center">
          <button onClick={() => setShowTour(true)} className="text-amber-950/40 hover:text-amber-700 font-black text-[12px] uppercase tracking-[0.2em] transition-all">Digital Tour</button>
          <button 
            onClick={onEnterPortal}
            className="btn-3d saffron-gradient text-white px-12 py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all border border-white/20"
          >
            Enter Portal
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10 pt-32">
        <div className="max-w-7xl w-full text-center">
          <div className="inline-flex items-center gap-4 bg-white/60 border-2 border-amber-500/20 px-12 py-4 rounded-full mb-16 backdrop-blur-3xl shadow-xl animate-in slide-in-from-top-4 duration-1000">
            <div className="w-3 h-3 gold-gradient rounded-full animate-pulse shadow-lg shadow-amber-500/50"></div>
            <span className="text-[12px] font-black text-amber-950 uppercase tracking-[0.6em]">Affiliated to Vidya Bharti</span>
          </div>

          <h1 className="text-8xl md:text-[14rem] font-black text-amber-950 uppercase tracking-tighter mb-10 leading-[0.75] drop-shadow-[0_20px_40px_rgba(180,83,9,0.2)]">
            विद्या <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-600 via-amber-400 to-amber-900">मंदिर</span>
          </h1>

          <p className="text-2xl md:text-4xl text-amber-900/40 font-bold max-w-5xl mx-auto mb-20 leading-relaxed tracking-tight italic">
            Nurturing heritage, tradition, and digital excellence at SVM Rambagh Basti.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <button 
              onClick={onEnterPortal}
              className="btn-3d saffron-gradient px-24 py-10 rounded-[3rem] text-white font-black uppercase tracking-[0.4em] text-[14px] hover:scale-105 active:scale-95 transition-all group border-2 border-white/20"
            >
              Access Digital Hub
              <svg className="w-7 h-7 inline-block ml-6 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
            <button 
              onClick={() => setShowTour(true)}
              className="bg-white/40 hover:bg-white/80 border-2 border-amber-500/10 px-24 py-10 rounded-[3rem] text-amber-950 font-black uppercase tracking-[0.4em] text-[14px] transition-all flex items-center gap-6 backdrop-blur-3xl group"
            >
              Virtual Tour
            </button>
          </div>
        </div>

        {/* Dense Information Grid */}
        <div className="mt-32 max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
           {[
             { label: 'Enrolled Scholars', val: '2200+' },
             { label: 'Senior Mentors', val: '95+' },
             { label: 'Success Rate', val: '100%' },
             { label: 'Years of Legacy', val: '42+' }
           ].map((stat, idx) => (
             <div key={idx} className="card-bhara p-10 rounded-[2.5rem] text-center transform hover:-translate-y-2 transition-transform duration-500">
                <div className="text-4xl font-black text-amber-950 mb-2">{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600/60">{stat.label}</div>
             </div>
           ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-40 bg-[#fefce8] py-40 px-12 border-t-4 border-amber-500/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="w-32 h-32 gold-gradient rounded-[3rem] flex items-center justify-center mx-auto mb-16 shadow-[0_40px_80px_-15px_rgba(217,119,6,0.3)] animate-float-custom">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
              </svg>
          </div>
          <p className="text-amber-950 font-bold italic text-3xl mb-16 opacity-40">"सा विद्या या विमुक्तये"</p>
          <div className="flex flex-wrap justify-center gap-16 mb-24 text-amber-950 font-black text-[12px] uppercase tracking-[0.4em]">
            <a href="#" className="hover:text-amber-600 transition-colors">Digital Privacy</a>
            <a href="#" className="hover:text-amber-600 transition-colors">Legal Terms</a>
            <a href="#" className="hover:text-amber-600 transition-colors">Student Help</a>
          </div>
          <p className="text-amber-950/20 font-black text-[12px] uppercase tracking-[0.5em] leading-loose">
            Official Academic Repository &bull; SVM Rambagh Basti &bull; Uttar Pradesh
          </p>
        </div>
      </footer>
    </div>
  );
};
