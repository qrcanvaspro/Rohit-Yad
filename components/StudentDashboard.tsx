
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
  const [showSuccess, setShowSuccess] = useState(false);

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
      alert("Note: Class Teacher's WhatsApp number is not yet linked by Admin. Please contact school office.");
      return;
    }
    
    // Construct STYLISH WhatsApp message
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
      `⏰ _Sent at: ${new Date().toLocaleString()}_\n` +
      `✨ _Generated via SVM Digital Portal_`
    );

    window.open(`https://wa.me/${teacherPhone}?text=${text}`, '_blank');
    
    setParentMessage('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  if (!resultsEnabled) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Results Pending</h2>
        <p className="text-slate-400 max-w-sm font-bold text-xs uppercase tracking-widest leading-loose">
          Publishing soon. Please check back later today.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Marksheet Container - Designed for Professional Print */}
      <div id="marksheet" className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100 relative print-card">
        {/* Only visible in Print/PDF */}
        <div className="hidden print:block text-center mb-10 border-b-4 border-slate-900 pb-8">
           <h1 className="text-4xl font-black uppercase text-slate-900 mb-1">Saraswati Vidya Mandir</h1>
           <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Rambagh Basti, Uttar Pradesh</p>
           <div className="flex justify-center gap-12 mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span>Affiliation No: 123456</span>
             <span>School Code: 78910</span>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">{examName} • {session}</p>
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">{student.name}</h2>
            <div className="flex flex-wrap gap-2">
               <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">ROLL: {student.roll_no}</span>
               <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">CLASS {student.class_name}-{student.section}</span>
               <span className="bg-orange-50 text-orange-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">{student.stream}</span>
            </div>
          </div>
          <div className={`text-right ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
             <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">Annual Evaluation</div>
             <div className="text-4xl font-black uppercase tracking-tighter">{isPassed ? 'Passed' : 'Failed'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="py-4 text-[10px] font-black uppercase text-slate-400">Subject Name</th>
                  <th className="py-4 text-center text-[10px] font-black uppercase text-slate-400">Marks</th>
                  <th className="py-4 text-right text-[10px] font-black uppercase text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {marks.map(m => (
                  <tr key={m.id}>
                    <td className="py-4 font-bold text-slate-700 uppercase text-xs">{m.subject}</td>
                    <td className="py-4 text-center font-black text-sm">{m.marks_obtained} <span className="text-slate-300 text-[10px]">/ 100</span></td>
                    <td className="py-4 text-right">
                       <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${m.marks_obtained >= 33 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                         {m.marks_obtained >= 33 ? 'Pass' : 'Fail'}
                       </span>
                    </td>
                  </tr>
                ))}
                {marks.length === 0 && (
                   <tr><td colSpan={3} className="py-10 text-center text-slate-300 font-black uppercase text-[10px] italic">No marks updated for this student yet.</td></tr>
                )}
              </tbody>
            </table>
            
            {/* Signature Area for Print */}
            <div className="hidden print:flex justify-between mt-20 pt-10">
               <div className="text-center border-t border-slate-200 pt-2 w-40">
                 <p className="text-[9px] font-black uppercase text-slate-500">Class Teacher</p>
               </div>
               <div className="text-center border-t border-slate-200 pt-2 w-40">
                 <p className="text-[9px] font-black uppercase text-slate-500">Principal</p>
               </div>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="bg-slate-900 p-8 rounded-[2rem] text-white text-center h-full flex flex-col justify-center">
               <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-4 text-slate-400">Grand Total</p>
               <div className="text-6xl font-black tracking-tighter mb-2">{percentage}%</div>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{totalObtained} out of {totalMax}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 no-print pb-20">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
           </div>
           <h3 className="text-lg font-black uppercase text-slate-800 mb-2">Download Report</h3>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Save official PDF copy of results</p>
           <button 
             onClick={handlePrintAction}
             className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Generate Marksheet PDF
           </button>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col">
           {showSuccess ? (
             <div className="flex-grow flex flex-col items-center justify-center text-center py-10">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h4 className="text-lg font-black uppercase text-slate-800">Redirecting...</h4>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-2 px-6 text-center">Opening stylish query message on WhatsApp. Check the new window.</p>
                <button onClick={() => setShowSuccess(false)} className="mt-4 text-[9px] font-black text-indigo-600 uppercase underline">New Query</button>
             </div>
           ) : (
             <>
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                 </div>
                 Direct Help
               </h3>
               <textarea 
                 value={parentMessage}
                 onChange={e => setParentMessage(e.target.value)}
                 placeholder="Enter your query here... It will be sent as a stylish report to the teacher's WhatsApp."
                 className="flex-grow w-full p-5 bg-slate-50 border-0 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-emerald-500 mb-4 h-28 resize-none placeholder:text-slate-300"
               />
               <button 
                 onClick={handleSendMessage}
                 disabled={!parentMessage.trim()}
                 className="w-full bg-[#25D366] hover:bg-[#1ebd5e] disabled:bg-slate-100 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
               >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.408 2.438 1.103 3.394l-.717 2.628 2.688-.705c.827.53 1.814.84 2.875.84 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.757-5.767-5.757zm3.366 8.24c-.144.406-.837.756-1.15.8-.313.044-.693.088-1.745-.333-1.052-.421-2.316-1.554-2.887-2.308-.57-.754-.954-1.631-.954-2.557 0-1.021.536-1.527.73-1.733.194-.206.428-.258.57-.258.143 0 .285 0 .406.01.127.01.3.037.47.447.172.411.59 1.442.639 1.545.05.103.082.222.012.35-.069.127-.104.22-.206.34-.103.12-.218.267-.31.36-.103.103-.211.216-.09.421.12.206.536.877 1.153 1.428.793.708 1.46.927 1.666 1.03.206.103.328.087.45-.051.12-.138.52-.605.659-.81.138-.206.277-.172.467-.103.189.069 1.201.567 1.408.669.206.103.345.155.396.241.051.086.051.5-.093.906z"/></svg>
                  Send Stylish WhatsApp
               </button>
               <p className="mt-3 text-[8px] font-black text-slate-300 uppercase text-center tracking-widest leading-relaxed">Safety First: No query data is stored on our servers.</p>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
