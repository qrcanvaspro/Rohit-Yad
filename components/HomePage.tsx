import React, { useState } from 'react';

interface HomePageProps {
  onEnterPortal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterPortal }) => {
  const [showTour, setShowTour] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* School Tour Viewer Modal */}
      {showTour && (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in zoom-in duration-300 flex flex-col">
          <div className="h-16 bg-slate-900 border-b border-white/10 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 saffron-gradient rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              </div>
              <span className="text-white font-black uppercase tracking-widest text-[10px]">Official School Website Viewer</span>
            </div>
            <button 
              onClick={() => setShowTour(false)}
              className="bg-white/10 hover:bg-red-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
            >
              Exit Viewer
            </button>
          </div>
          <div className="flex-grow relative bg-white">
             <iframe 
               src="https://svmrambaghbasti.in/" 
               className="w-full h-full border-0"
               title="SVM Rambagh Official Site"
             />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="h-24 px-8 md:px-16 flex justify-between items-center fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 saffron-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20 group-hover:rotate-12 transition-transform">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white uppercase tracking-tighter text-xl leading-none">SVM Rambagh</span>
            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.4em] mt-1">Basti, Uttar Pradesh</span>
          </div>
        </div>
        <div className="hidden md:flex gap-10 items-center">
          <button onClick={() => setShowTour(true)} className="text-white/60 hover:text-orange-400 font-black text-[10px] uppercase tracking-widest transition-all">Official Site</button>
          <a href="#" className="text-white/60 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">Notice Board</a>
          <button 
            onClick={onEnterPortal}
            className="saffron-gradient text-white px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 hover:scale-110 active:scale-95 border border-white/10"
          >
            Enter Portal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-pattern min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Animated Background Icons */}
        <div className="absolute top-[20%] left-[10%] text-white/5 animate-float opacity-30"><svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg></div>
        <div className="absolute top-[60%] right-[15%] text-white/5 animate-float opacity-30" style={{ animationDelay: '2s' }}><svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.17 0-2.39.15-3.5.5V19c1.11-.35 2.33-.5 3.5-.5 1.95 0-4.05.4-5.5 1.5 1.45-1.1 3.55-1.5 5.5-1.5 1.17 0 2.39.15 3.5.5v2c-1.11-.35-2.33-.5-3.5-.5-1.7 0-3.41.35-4.66 1.09-.23.13-.34.4-.34.66V5s1.66-1.09 4.66-1.09c1.95 0 4.05.4 5.5 1.5 1.45-1.1 3.55-1.5 5.5-1.5 1.7 0 3.41.35 4.66 1.09.23.13.34.4.34.66V5z"/></svg></div>

        <div className="max-w-6xl w-full text-center relative z-10 pt-24">
          <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-3 rounded-full mb-12 backdrop-blur-2xl">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Digital Academic Hub &bull; 2024-25</span>
          </div>

          <h1 className="text-7xl md:text-[10rem] font-black text-white uppercase tracking-tighter mb-10 leading-[0.8] [text-shadow:0_30px_60px_rgba(0,0,0,0.8)]">
            Vidya <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-600">Bharti</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-400 font-semibold max-w-3xl mx-auto mb-16 leading-relaxed italic">
            "Sa Vidya Ya Vimuktaye" - Nurturing traditional values with a vision for digital transformation.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <button 
              onClick={onEnterPortal}
              className="saffron-gradient px-16 py-8 rounded-[2.5rem] text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-[0_25px_60px_-15px_rgba(255,153,51,0.5)] hover:scale-110 hover:-rotate-1 transition-all active:scale-95 group"
            >
              Access Digital Results
              <svg className="w-5 h-5 inline-block ml-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
            <button 
              onClick={() => setShowTour(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/20 px-16 py-8 rounded-[2.5rem] text-white font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center gap-4 backdrop-blur-xl group"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                 <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              Explore School
            </button>
          </div>
        </div>

        {/* Floating Stats Section */}
        <div className="absolute bottom-10 left-0 w-full px-10 hidden lg:block">
           <div className="max-w-7xl mx-auto flex justify-between items-center text-white/40">
              <div className="flex flex-col"><span className="text-3xl font-black text-white/80">1500+</span><span className="text-[10px] font-black uppercase tracking-widest">Students enrolled</span></div>
              <div className="h-10 w-px bg-white/10"></div>
              <div className="flex flex-col"><span className="text-3xl font-black text-white/80">75+</span><span className="text-[10px] font-black uppercase tracking-widest">Expert Faculty</span></div>
              <div className="h-10 w-px bg-white/10"></div>
              <div className="flex flex-col"><span className="text-3xl font-black text-white/80">45+</span><span className="text-[10px] font-black uppercase tracking-widest">Years of Excellence</span></div>
              <div className="h-10 w-px bg-white/10"></div>
              <div className="flex flex-col"><span className="text-3xl font-black text-white/80">A+</span><span className="text-[10px] font-black uppercase tracking-widest">Academic Grade</span></div>
           </div>
        </div>
      </section>

      {/* NEW: Mentorship Animation Section */}
      <section className="py-32 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-slate-950 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* SVG Animation Content */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-10 bg-orange-500/10 rounded-full blur-[100px] animate-pulse"></div>
            <svg viewBox="0 0 600 500" className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Teacher Figure */}
              <g className="animate-float" style={{ animationDuration: '4s' }}>
                <circle cx="200" cy="150" r="40" fill="#FF9933" />
                <path d="M140 220 Q200 180 260 220 L270 380 Q200 400 130 380 Z" fill="#FF9933" />
                {/* Book in hand */}
                <rect x="230" y="240" width="80" height="100" rx="10" fill="#0f172a" stroke="#FF9933" strokeWidth="4" className="animate-bounce" style={{ animationDuration: '3s' }} />
                <line x1="250" y1="265" x2="290" y2="265" stroke="#FF9933" strokeWidth="2" />
                <line x1="250" y1="285" x2="290" y2="285" stroke="#FF9933" strokeWidth="2" />
              </g>
              {/* Student Figure */}
              <g className="animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
                <circle cx="400" cy="250" r="30" fill="#ffffff" opacity="0.8" />
                <path d="M350 300 Q400 280 450 300 L460 420 Q400 440 340 420 Z" fill="#ffffff" opacity="0.5" />
                {/* Pointer arm */}
                <path d="M360 320 L280 270" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
              </g>
              {/* Knowledge Particles */}
              {[...Array(8)].map((_, i) => (
                <circle 
                  key={i} 
                  cx={200 + Math.random() * 300} 
                  cy={100 + Math.random() * 300} 
                  r={3 + Math.random() * 5} 
                  fill="#FF9933" 
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </svg>
          </div>

          <div className="order-1 lg:order-2">
            <h4 className="text-orange-500 font-black uppercase tracking-[0.5em] text-[10px] mb-6">Mentorship & Growth</h4>
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[0.9]">
              Nurturing <br/> <span className="text-white/40">The Future Leaders</span>
            </h2>
            <p className="text-slate-400 font-medium text-lg mb-10 leading-relaxed">
              At SVM Rambagh, education goes beyond books. Our dedicated faculty ensures every student receives personalized attention to unlock their true academic and ethical potential.
            </p>
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                  <div className="text-orange-500 font-black text-2xl mb-1">1:20</div>
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Teacher-Student Ratio</p>
               </div>
               <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                  <div className="text-white font-black text-2xl mb-1">Modern</div>
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Interactive Labs</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motto & Values */}
      <section className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <h2 className="text-sm font-black text-orange-500 uppercase tracking-[1em] mb-4">Core Values</h2>
          <p className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">Our Foundation</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Shiksha", desc: "Holistic academic excellence combined with modern technology.", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
            { title: "Sanskar", desc: "Instilling deep cultural values and ethical character in every child.", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
            { title: "Swavlamban", desc: "Empowering students to be self-reliant and future-ready.", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
          ].map((v, i) => (
            <div key={i} className="group relative bg-slate-50 p-16 rounded-[4rem] border border-slate-100 transition-all hover:bg-slate-900 overflow-hidden">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-orange-500 mb-10 group-hover:scale-110 transition-all">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={v.icon}></path></svg>
               </div>
               <h3 className="text-3xl font-black text-slate-900 group-hover:text-white uppercase tracking-tighter mb-6 transition-colors">{v.title}</h3>
               <p className="text-slate-500 group-hover:text-slate-400 font-bold text-sm leading-loose transition-colors">{v.desc}</p>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 saffron-gradient opacity-0 group-hover:opacity-10 rounded-full transition-opacity"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-32 px-6 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] saffron-gradient opacity-5 rounded-full blur-[150px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="w-20 h-20 saffron-gradient rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-orange-500/20 animate-float">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
              </svg>
          </div>
          <p className="text-white/20 text-xs font-black uppercase tracking-[1em] mb-12">Established to Enlighten</p>
          
          <div className="flex flex-col md:flex-row justify-center gap-12 mb-20 text-white/40 font-black text-[10px] uppercase tracking-widest">
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact Office</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Digital Helpdesk</a>
          </div>

          <p className="text-slate-600 font-black text-[11px] uppercase tracking-[0.4em] leading-loose">
            &copy; 2024 Saraswati Vidya Mandir, Rambagh Basti. <br/> 
            <span className="text-white/10 mt-4 block italic">Proudly part of the Vidya Bharti Akhil Bhartiya Shiksha Sansthan network.</span>
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
};