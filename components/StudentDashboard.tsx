
import React, { useState, useEffect } from 'react';
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRevealing, setIsRevealing] = useState(true);

  useEffect(() => {
    // Stage-based reveal for a "high-tech" scanning feel
    const timer = setTimeout(() => setIsRevealing(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const totalObtained = marks.reduce((sum, m) => sum + m.marks_obtained, 0);
  const totalMax = marks.reduce((sum, m) => sum + m.max_marks, 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0';
  const isPassed = parseFloat(percentage) >= 33;

  const handlePrintAction = () => {
    window.print();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentMessage.trim()) return;

    const teacherKey = `${student.class_name}-${student.section}`;
    const teacherPhone = teacherMappings[teacherKey];

    if (!teacherPhone) {
      alert("Note: Class Teacher's WhatsApp number is not yet linked. Contact school.");
      return;
    }
    
    const text = encodeURIComponent(
      `🏛️ *SVM RAMBAGH BASTI* 🏛️\n` +
      `📜 *DIGITAL RESULT PORTAL*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Student:* ${student.name}\n` +
      `🎓 *Class:* ${student.class_name}-${student.section}\n` +
      `🔢 *Roll No:* ${student.roll_no}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💬 *PARENT QUERY:*\n` +
      `_"${parentMessage}"_\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `✨ _Generated via SVM Digital Portal_`
    );

    window.open(`https://wa.me/${teacherPhone}?text=${text}`, '_blank');
    setParentMessage('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  if (!resultsEnabled) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-amber-100 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-3xl font-black text-red-950 mb-2 uppercase tracking-tight">Results Pending</h2>
        <p className="text-amber-900/40 max-w-sm font-bold text-xs uppercase tracking-widest leading-loose">
          Authorized publication is currently in progress.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Marksheet Container */}
      <div id="marksheet" className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-amber-100 relative print-card overflow-hidden transition-all duration-1000">
        
        {/* The Scanning Animation Layer */}
        {isRevealing && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-1000">
            <div className="scan-line"></div>
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black text-red-950 uppercase tracking-[0.4em] animate-pulse">Verifying Integrity</p>
            </div>
          </div>
        )}

        {/* Decorative corner element with shimmer */}
        <div className="absolute top-0 right-0 w-64 h-64 saffron-gradient opacity-10 rounded-bl-[100%] pointer-events-none shimmer"></div>

        <div className="hidden print:block text-center mb-10 border-b-4 border-red-950 pb-8">
           <h1 className="text-4xl font-black uppercase text-red-950 mb-1">Saraswati Vidya Mandir</h1>
           <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">Rambagh Basti, Uttar Pradesh</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-2">{examName} • {session}</p>
            <h2 className="text-5xl font-black text-red-950 uppercase tracking-tighter mb-4 leading-none">{student.name}</h2>
            <div className="flex flex-wrap gap-2">
               <span className="bg-red-950 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-950/20">ROLL: {student.roll_no}</span>
               <span className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">CLASS {student.class_name}-{student.section}</span>
            </div>
          </div>
          <div className={`text-right ${isPassed ? 'text-emerald-700' : 'text-red-700'} animate-in fade-in zoom-in duration-1000 delay-500`}>
             <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-40">Portal Status</div>
             <div className="text-4xl font-black uppercase tracking-tighter flex items-center gap-2">
               {isPassed ? (
                 <>
                   Passed
                   <svg className="w-8 h-8 animate-bounce text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                 </>
               ) : 'Failed'}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-amber-50">
                  <th className="py-4 text-[10px] font-black uppercase text-amber-900/30">Academic Subject</th>
                  <th className="py-4 text-center text-[10px] font-black uppercase text-amber-900/30">Marks</th>
                  <th className="py-4 text-right text-[10px] font-black uppercase text-amber-900/30">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {marks.map((m, idx) => (
                  <tr key={m.id} className="animate-in fade-in slide-in-from-left-4 duration-700" style={{ animationDelay: `${800 + (idx * 150)}ms` }}>
                    <td className="py-4 font-bold text-red-950 uppercase text-xs">{m.subject}</td>
                    <td className="py-4 text-center font-black text-sm text-red-900">{m.marks_obtained} <span className="text-amber-200 text-[10px]">/ 100</span></td>
                    <td className="py-4 text-right">
                       <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${m.marks_obtained >= 33 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                         {m.marks_obtained >= 33 ? 'Qualified' : 'Essential Rep.'}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:col-span-4 animate-in fade-in zoom-in duration-1000 delay-1000">
            <div className="bg-red-950 p-8 rounded-[2rem] text-white text-center h-full flex flex-col justify-center shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 shimmer opacity-10 group-hover:opacity-20 transition-opacity"></div>
               <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-4 text-amber-200/40">Agg. Percentage</p>
               <div className="text-6xl font-black tracking-tighter mb-2 text-amber-400 drop-shadow-lg">{percentage}%</div>
               <p className="text-[10px] font-bold text-amber-200/30 uppercase tracking-widest">{totalObtained} / {totalMax}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 no-print pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1500">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-amber-100 flex flex-col items-center text-center group">
           <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
           </div>
           <h3 className="text-lg font-black uppercase text-red-950 mb-2">Digital Report</h3>
           <button 
             onClick={handlePrintAction}
             className="w-full bg-red-950 hover:bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-950/20 active:scale-95 flex items-center justify-center gap-3"
           >
              Print / Save PDF
           </button>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-amber-100 flex flex-col">
           {showSuccess ? (
             <div className="flex-grow flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h4 className="text-lg font-black uppercase text-red-950">Message Sent!</h4>
             </div>
           ) : (
             <>
               <h3 className="text-sm font-black uppercase tracking-widest text-red-950 mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shadow-inner">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                 </div>
                 Faculty Direct Connect
               </h3>
               <textarea 
                 value={parentMessage}
                 onChange={e => setParentMessage(e.target.value)}
                 placeholder="Parental query or help request..."
                 className="flex-grow w-full p-5 bg-amber-50/30 border border-amber-900/5 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-amber-500 mb-4 h-28 resize-none text-red-950 transition-all"
               />
               <button 
                 onClick={handleSendMessage}
                 disabled={!parentMessage.trim()}
                 className="w-full bg-[#25D366] hover:bg-[#1ebd5e] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-green-500/10"
               >
                  Connect via WhatsApp
               </button>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
