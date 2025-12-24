
import React, { useState } from 'react';
import { Student, Mark, TeacherMapping } from '../types';

interface StudentDashboardProps {
  student: Student;
  marks: Mark[];
  resultsEnabled: boolean;
  examName: string;
  session: string;
  teacherMappings: TeacherMapping;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, marks, resultsEnabled, examName, session, teacherMappings }) => {
  const [parentMessage, setParentMessage] = useState('');

  const totalObtained = marks.reduce((sum, m) => sum + m.marks_obtained, 0);
  const totalMax = marks.reduce((sum, m) => sum + m.max_marks, 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0';
  const isPassed = parseFloat(percentage) >= 33;

  const teacherKey = `${student.class_name}-${student.section}`;
  const teacherPhone = teacherMappings[teacherKey];

  const handleDownload = () => {
    window.print();
  };

  const handleWhatsAppDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMessage.trim()) return;
    if (!teacherPhone) {
      alert("Error: Class teacher contact is not assigned by administrator.");
      return;
    }

    const formattedMsg = encodeURIComponent(
      `📌 SVM PORTAL QUERY\n👤 Student: ${student.name}\n🆔 Roll: ${student.roll_no}\n🏫 Class: ${student.class_name}-${student.section}\n📝 Query: ${parentMessage}`
    );
    
    window.open(`https://wa.me/${teacherPhone}?text=${formattedMsg}`, '_blank');
    setParentMessage('');
  };

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

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-1000">
      <div id="marksheet-to-print" className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border-[12px] border-slate-50 relative overflow-hidden print-card">
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
          <div className={`text-right ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 no-print pb-16">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest">Quick Actions</h4>
           </div>
           <button 
             onClick={handleDownload} 
             className="w-full bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95 group"
           >
              Download PDF Report
           </button>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
           <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest">Message Teacher</h4>
           </div>
           <form onSubmit={handleWhatsAppDirect} className="space-y-4">
              <textarea 
                value={parentMessage}
                onChange={e => setParentMessage(e.target.value)}
                placeholder="Type your message for the class teacher here..."
                className="w-full p-5 bg-slate-50 border-0 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-emerald-500 h-28 resize-none"
              ></textarea>
              <button 
                type="submit"
                disabled={!parentMessage.trim()}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] disabled:bg-slate-200 text-white px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95"
              >
                 Open WhatsApp & Send
              </button>
              {!teacherPhone && (
                <p className="text-[8px] font-black text-red-400 uppercase text-center">Note: Teacher contact details not set in portal.</p>
              )}
           </form>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
