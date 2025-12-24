
import React from 'react';
import { Student, Mark } from '../types';

interface StudentDashboardProps {
  student: Student;
  marks: Mark[];
  resultsEnabled: boolean;
  examName: string;
  session: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, marks, resultsEnabled, examName, session }) => {
  const totalObtained = marks.reduce((sum, m) => sum + m.marks_obtained, 0);
  const totalMax = marks.reduce((sum, m) => sum + m.max_marks, 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0';
  const isPassed = parseFloat(percentage) >= 33;

  if (!resultsEnabled) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100 animate-in fade-in zoom-in">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Portal Locked</h2>
        <p className="text-slate-400 max-w-sm font-bold text-xs uppercase tracking-widest leading-loose">
          Publication pending by administration. Please check back later.
        </p>
      </div>
    );
  }

  if (marks.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] shadow-2xl animate-in zoom-in">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Grading Pending</h2>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Faculty is still updating records for your session.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-1000">
      <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border-[12px] border-slate-50 relative overflow-hidden print-card">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/5 rounded-tr-full"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b-2 border-slate-50 mb-12 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-12 h-12 bg-indigo-900 rounded-2xl flex items-center justify-center shadow-lg">
                 <svg className="w-7 h-7 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path></svg>
               </div>
               <div className="h-px w-8 bg-slate-200"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{examName} | {session}</p>
            </div>
            <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4">{student.name}</h2>
            <div className="flex flex-wrap gap-2">
               <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">ROLL: {student.roll_no}</span>
               <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">CLASS {student.class_name}-{student.section}</span>
               <span className="bg-orange-50 text-orange-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">{student.stream} STREAM</span>
            </div>
          </div>
          <div className={`text-right no-print ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
             <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">Final Result</div>
             <div className="text-4xl font-black uppercase tracking-tighter">{isPassed ? 'Passed' : 'Failed'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          <div className="lg:col-span-7">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Detailed Marksheet</h3>
            <div className="space-y-6">
              {marks.map((m, idx) => (
                <div key={m.id} className="animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-slate-800 uppercase tracking-tight text-sm">{m.subject}</span>
                    <span className="text-sm font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">{m.marks_obtained} <span className="text-slate-400">/ {m.max_marks}</span></span>
                  </div>
                  <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${m.marks_obtained >= 33 ? 'bg-indigo-600' : 'bg-red-500'}`}
                      style={{ width: `${(m.marks_obtained / m.max_marks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-indigo-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-4 text-indigo-300">Total Score</p>
              <div className="text-7xl font-black tracking-tighter mb-4">{percentage}%</div>
              <div className="h-1.5 w-12 bg-orange-400 rounded-full mb-6"></div>
              <p className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest">Aggregate: {totalObtained} / {totalMax}</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Status Division</p>
                <p className={`text-2xl font-black uppercase tracking-tight ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>{isPassed ? 'Qualified' : 'Re-Appear'}</p>
              </div>
              <div className={`p-4 rounded-2xl ${isPassed ? 'bg-white text-emerald-500 shadow-sm' : 'bg-white text-red-500 shadow-sm'}`}>
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-12 border-t-2 border-slate-50 no-print text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em] mb-2">Authenticated Digital Copy</p>
          <div className="text-slate-400 italic text-[10px]">Issued for: {examName} ({session})</div>
        </div>
      </div>

      <div className="flex justify-center gap-4 no-print pb-16">
        <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-indigo-100 flex items-center gap-3 active:scale-95">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
           Print Marksheet
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
