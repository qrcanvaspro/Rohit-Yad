
import React, { useState } from 'react';

interface HomePageProps {
  onEnterPortal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterPortal }) => {
  const [showTour, setShowTour] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdf0] relative overflow-hidden hero-pattern-rich">
      {/* Decorative Moving Background Objects */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="moving-object" 
          style={{ top: `${10 + i * 12}%`, animationDelay: `${i * 6}s`, animationDuration: `${25 + i * 8}s` }}
        >
          {i % 2 === 0 ? (
            <svg className="w-20 h-20 text-orange-600/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v2.81L12 20l7-4.01v-2.81l-7 4-7-4z"/>
            </svg>
          ) : (
            <svg className="w-16 h-16 text-orange-500/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20V5H6.5a2.5 2.5 0 000 5H20v11H6.5C4.01 21 2 18.99 2 16.5V6a2 2 0 012-2h16a2 2 0 012 2v15a1 1 0 01-1 1H6.5a1 1 0 01-2.5-1.5z"/>
            </svg>
          )}
        </div>
      ))}

      {/* Vertical Cultural Anchors */}
      <div className="hidden xl:flex fixed left-10 top-1/2 -translate-y-1/2 flex-col items-center gap-6 opacity-20 pointer-events-none">
        <div className="shloka-sidebar shloka-font text-orange-950 text-2xl font-black">सा विद्या या विमुक्तये</div>
        <div className="h-40 w-1 bg-gradient-to-b from-orange-400 to-transparent rounded-full"></div>
      </div>
      <div className="hidden xl:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-6 opacity-20 pointer-events-none">
        <div className="h-40 w-1 bg-gradient-to-t from-orange-400 to-transparent rounded-full"></div>
        <div className="shloka-sidebar shloka-font text-orange-950 text-2xl font-black">तमसो मा ज्योतिर्गमय</div>
      </div>

      {/* Navigation - Bhara Bhara Design */}
      <nav className="h-32 px-10 md:px-20 flex justify-between items-center fixed top-0 w-full z-50 glass-heavy border-b-4 border-orange-500/20">
        <div className="flex items-center gap-6 group cursor-pointer">
          <div className="w-20 h-20 saffron-gradient rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-900/30 group-hover:rotate-12 transition-all duration-700 border-4 border-white/20">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-orange-950 uppercase tracking-tighter text-4xl leading-none">SVM RAMBAGH</span>
            <span className="text-[12px] font-black text-orange-600 uppercase tracking-[0.5em] mt-2 opacity-70">BASTI &bull; UTTAR PRADESH</span>
          </div>
        </div>
        <div className="hidden lg:flex gap-16 items-center">
          <button onClick={() => setShowTour(true)} className="text-orange-900/40 hover:text-orange-900 font-black text-[13px] uppercase tracking-[0.3em] transition-all">Digital Tour</button>
          <button 
            onClick={onEnterPortal}
            className="btn-heritage text-sm"
          >
            Access Portal
          </button>
        </div>
      </nav>

      {/* Hero Content - Centralized & Dense */}
      <section className="min-h-screen flex flex-col items-center justify-center px-10 relative z-10 pt-40 pb-20">
        <div className="max-w-7xl w-full flex flex-col items-center">
          {/* Emblem Background */}
          <div className="absolute -z-10 opacity-5 animate-float-heritage">
            <svg className="w-[40rem] h-[40rem] text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
          </div>

          <div className="bg-white/80 border-4 border-orange-500/20 px-16 py-6 rounded-full mb-16 backdrop-blur-3xl shadow-2xl animate-in slide-in-from-top-10 duration-1000">
            <span className="shloka-font text-2xl font-black text-orange-950 tracking-[0.2em]">सा विद्या या विमुक्तये</span>
          </div>

          <h1 className="text-9xl md:text-[16rem] font-black text-orange-950 uppercase tracking-tighter mb-12 leading-[0.7] drop-shadow-2xl animate-in fade-in zoom-in duration-1000">
            विद्या <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-600 via-orange-400 to-orange-900">मंदिर</span>
          </h1>

          <p className="text-3xl md:text-5xl text-orange-900/50 font-black max-w-5xl mx-auto mb-20 leading-tight tracking-tight italic animate-in fade-in duration-1000 delay-500 text-center">
            Establishing the foundation of character through traditional knowledge and modern digital tools.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
            <button 
              onClick={onEnterPortal}
              className="btn-heritage px-28 py-12 rounded-[3.5rem] text-[18px] group"
            >
              Access Digital Results
              <svg className="w-8 h-8 inline-block ml-6 group-hover:translate-x-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
            <button 
              onClick={() => setShowTour(true)}
              className="bg-white/60 hover:bg-white/90 border-4 border-orange-500/10 px-24 py-11 rounded-[3.5rem] text-orange-950 font-black uppercase tracking-[0.5em] text-[16px] transition-all flex items-center gap-8 backdrop-blur-3xl group shadow-2xl"
            >
              School Website
            </button>
          </div>
        </div>

        {/* Dense Grid - Bhara Bhara Look */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-7xl px-8">
           {[
             { title: 'Tradition', desc: 'Values of Vidya Bharti', icon: 'M12 3L1 9l11 6 9-4.91V17h2V9L12 3z' },
             { title: 'Digital', desc: 'E-Result Management', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
             { title: 'Secure', desc: 'End-to-End Encryption', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
             { title: 'Connect', desc: 'Direct Teacher Hub', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
           ].map((item, idx) => (
             <div key={idx} className="card-heritage p-12 rounded-[3.5rem] flex flex-col items-center text-center group">
               <div className="w-20 h-20 saffron-gradient rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-orange-900/20 group-hover:scale-110 transition-transform">
                 <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon}></path></svg>
               </div>
               <h3 className="text-2xl font-black text-orange-950 uppercase mb-3">{item.title}</h3>
               <p className="text-[12px] font-bold text-orange-900/40 uppercase tracking-widest">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Footer - Dense & Official */}
      <footer className="mt-40 bg-white py-48 px-16 border-t-8 border-orange-500/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
          <div className="w-40 h-40 gold-gradient rounded-[4rem] flex items-center justify-center mb-20 shadow-[0_50px_100px_-20px_rgba(217,119,6,0.4)] border-4 border-white animate-float-heritage">
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
              </svg>
          </div>
          <h2 className="shloka-font text-5xl font-black text-orange-950 mb-20 opacity-30 italic">"तमसो मा ज्योतिर्गमय"</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-20 w-full mb-32 border-y-4 border-orange-500/5 py-20">
             {[
               { h: 'Institutional', l: ['About SVM', 'Vidya Bharti', 'Our Vision'] },
               { h: 'Resources', l: ['Digital Library', 'Exam Portal', 'Help Desk'] },
               { h: 'Parents', l: ['Fee Structure', 'Academic Calendar', 'Portal Support'] },
               { h: 'Legal', l: ['Privacy Policy', 'Terms of Use', 'Data Protection'] }
             ].map((col, i) => (
               <div key={i} className="flex flex-col gap-6">
                 <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-orange-950 underline underline-offset-8 decoration-orange-500/20">{col.h}</h4>
                 {col.l.map((link, j) => <a key={j} href="#" className="text-[11px] font-bold text-orange-900/40 hover:text-orange-900 uppercase tracking-widest">{link}</a>)}
               </div>
             ))}
          </div>

          <p className="text-orange-950/20 font-black text-[13px] uppercase tracking-[0.6em] text-center leading-loose">
            &copy; 2024-2025 Saraswati Vidya Mandir &bull; Rambagh Basti &bull; Uttar Pradesh &bull; All Academic Rights Reserved.
          </p>
        </div>
      </footer>

      {/* School Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 z-[100] bg-orange-950/20 backdrop-blur-3xl animate-in fade-in zoom-in duration-300 flex flex-col">
          <div className="h-28 glass-heavy border-b-4 border-orange-500/20 flex items-center justify-between px-10">
            <span className="text-orange-950 font-black uppercase tracking-[0.3em] text-sm">Official School Repository Browser</span>
            <button 
              onClick={() => setShowTour(false)}
              className="btn-heritage py-4 px-10 text-[10px]"
            >
              Exit Viewer
            </button>
          </div>
          <div className="flex-grow bg-white">
             <iframe src="https://svmrambaghbasti.in/" className="w-full h-full border-0" title="SVM Official Website" />
          </div>
        </div>
      )}
    </div>
  );
};
