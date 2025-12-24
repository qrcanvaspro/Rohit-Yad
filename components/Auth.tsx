
import React, { useState } from 'react';
import { Role, Student } from '../types';
import { CLASSES, SECTIONS_MAP } from '../constants';

interface AuthProps {
  onLogin: (role: Role, profile: any) => void;
  onRegister: (student: Partial<Student>) => Promise<Student>;
  students: Student[];
}

type AuthView = 'selection' | 'student-login' | 'student-register' | 'teacher-login' | 'admin-login';

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, students }) => {
  const [view, setView] = useState<AuthView>('selection');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    roll_no: '',
    computer_id: '',
    class_name: '9',
    section: 'A',
    codeword: '',
  });

  const resetForm = () => {
    setFormData({ name: '', roll_no: '', computer_id: '', class_name: '9', section: 'A', codeword: '', });
    setError('');
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'student-register') {
        if (!formData.name || !formData.roll_no || !formData.computer_id) {
          throw new Error('All fields are mandatory for registration');
        }
        if (students.some(s => s.roll_no === formData.roll_no)) {
          throw new Error('This Roll Number is already registered');
        }
        const newStudent = await onRegister({ 
          name: formData.name,
          roll_no: formData.roll_no,
          computer_id: formData.computer_id,
          class_name: formData.class_name,
          section: formData.section
        });
        onLogin('STUDENT', newStudent);
      } 
      else if (view === 'student-login') {
        const student = students.find(s => s.roll_no === formData.roll_no && s.computer_id === formData.computer_id);
        if (student) {
          onLogin('STUDENT', student);
        } else {
          throw new Error('Invalid Credentials. Please check Roll No and Computer ID.');
        }
      } 
      else if (view === 'teacher-login') {
        if (formData.codeword === 'TEACHER_SVM_2024') {
          onLogin('TEACHER', { name: 'SVM Faculty', email: 'teacher@svm.edu' });
        } else {
          throw new Error('Incorrect Teacher Access Codeword');
        }
      } 
      else if (view === 'admin-login') {
        if (formData.codeword === 'ADMIN_RAMBAGH_786') {
          onLogin('ADMIN', { name: 'Principal Office', email: 'admin@svm.edu' });
        } else {
          throw new Error('Incorrect Administrator Codeword');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (view === 'selection') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-5xl w-full relative z-10">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex p-5 bg-indigo-900 rounded-3xl shadow-2xl mb-8 border-4 border-indigo-800 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
               <svg className="w-12 h-12 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
               </svg>
            </div>
            <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4">SVM <span className="text-orange-500">RAMBAGH BASTI</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Official Digital Examination Portal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'student-login', title: 'Students', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z', color: 'orange', desc: 'Check and download results.' },
              { id: 'teacher-login', title: 'Teachers', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'indigo', desc: 'Manage grades and records.' },
              { id: 'admin-login', title: 'Admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', color: 'slate', desc: 'Configure system settings.' }
            ].map((card, i) => (
              <button 
                key={card.id}
                onClick={() => { resetForm(); setView(card.id as AuthView); }}
                className="group relative bg-white p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-slate-100 hover:-translate-y-2 text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className={`mx-auto w-20 h-20 bg-${card.color}-50 rounded-3xl flex items-center justify-center text-${card.color}-600 mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon}></path></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{card.title}</h3>
                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{card.desc}</p>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-1/2 h-1.5 bg-${card.color}-500 rounded-t-full transition-all duration-500`}></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const theme = view.includes('student') ? 'orange' : view.includes('teacher') ? 'indigo' : 'slate';

  return (
    <div className={`min-h-screen flex items-center justify-center bg-slate-50 p-6`}>
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
        <div className={`bg-${theme}-600 p-10 text-white text-center relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
             <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path></svg>
          </div>
          <button onClick={() => setView('selection')} className="absolute top-8 left-8 p-2 hover:bg-white/20 rounded-xl transition-all z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-1 relative z-10">
            {view === 'student-login' ? 'Student' : view === 'student-register' ? 'Enrollment' : view === 'teacher-login' ? 'Teacher' : 'Admin'}
          </h2>
          <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] relative z-10">Secure Gateway</p>
        </div>
        
        <form onSubmit={handleAction} className="p-10 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}
          
          {(view === 'student-login' || view === 'student-register') && (
            <div className="space-y-4">
              {view === 'student-register' && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:bg-white bg-slate-50 outline-none font-bold text-slate-700 transition-all placeholder-slate-300" placeholder="e.g. Aman Gupta" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Roll No.</label>
                  <input type="text" required value={formData.roll_no} onChange={(e) => setFormData({...formData, roll_no: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:bg-white bg-slate-50 outline-none font-bold text-slate-700 transition-all placeholder-slate-300" placeholder="Unique ID" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Comp. ID</label>
                  <input type="text" required value={formData.computer_id} onChange={(e) => setFormData({...formData, computer_id: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 focus:bg-white bg-slate-50 outline-none font-bold text-slate-700 transition-all placeholder-slate-300" placeholder="PC-XXXX" />
                </div>
              </div>
              {view === 'student-register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Grade</label>
                    <select value={formData.class_name} onChange={(e) => setFormData({...formData, class_name: e.target.value, section: 'A'})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 bg-slate-50 outline-none font-bold text-slate-700 transition-all">
                      {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Section</label>
                    <select value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 focus:border-orange-500 bg-slate-50 outline-none font-bold text-slate-700 transition-all">
                      {SECTIONS_MAP[formData.class_name].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {(view === 'teacher-login' || view === 'admin-login') && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Master Codeword</label>
              <input type="password" required value={formData.codeword} onChange={(e) => setFormData({...formData, codeword: e.target.value})} className={`w-full px-6 py-5 rounded-2xl border-2 border-slate-50 focus:border-${theme}-500 focus:bg-white bg-slate-50 outline-none font-black text-slate-700 transition-all text-center tracking-[0.5em] text-lg`} placeholder="••••••" />
            </div>
          )}

          <button type="submit" disabled={loading} className={`w-full bg-${theme}-600 hover:bg-${theme}-700 disabled:bg-slate-200 text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-${theme}-200 transition-all flex justify-center items-center gap-3 uppercase tracking-widest text-[10px] transform active:scale-95`}>
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Authorize & Enter'}
          </button>

          {view.includes('student') && (
            <div className="text-center pt-2">
              <button type="button" onClick={() => { setView(view === 'student-login' ? 'student-register' : 'student-login'); resetForm(); }} className={`text-[10px] text-${theme}-600 hover:text-${theme}-800 font-black uppercase tracking-widest`}>
                {view === 'student-login' ? "Don't have an account? Register" : 'Already enrolled? Login'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
