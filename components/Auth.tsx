import React, { useState } from 'react';
import { Role, Student } from '../types';
import { CLASSES, SECTIONS_MAP } from '../constants';

interface AuthProps {
  onLogin: (role: Role, profile: any) => void;
  onRegister: (student: Partial<Student>) => Promise<Student>;
  students: Student[];
  onBack: () => void;
}

type AuthView = 'selection' | 'student-login' | 'student-register' | 'teacher-login' | 'admin-login';

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, students, onBack }) => {
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
          throw new Error('Invalid Credentials. Check Roll No and Computer ID.');
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
      console.error("Auth Action Error:", err);
      setError(err.message || "An unexpected error occurred during authorization.");
    } finally {
      setLoading(false);
    }
  };

  if (view === 'selection') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] saffron-gradient rounded-full blur-[150px] animate-pulse-slow"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-5xl w-full relative z-10">
          <div className="text-center mb-16">
            <button onClick={onBack} className="mb-8 text-white/30 hover:text-white flex items-center gap-2 mx-auto font-black text-[10px] uppercase tracking-widest transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Return Home
            </button>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">Access <span className="text-orange-500">Portal</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.5em] text-[10px]">Select your identity to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 'student-login', title: 'Students', icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", color: 'orange', desc: 'Results & Roll' },
              { id: 'teacher-login', title: 'Teachers', icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", color: 'indigo', desc: 'Upload Records' },
              { id: 'admin-login', title: 'Office', icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", color: 'slate', desc: 'Control Panel' }
            ].map((card, i) => (
              <button 
                key={card.id}
                onClick={() => { resetForm(); setView(card.id as AuthView); }}
                className="group relative glass p-10 rounded-[3rem] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-4 text-center overflow-hidden"
              >
                <div className={`mx-auto w-24 h-24 saffron-gradient rounded-[2rem] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-2xl`}>
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon}></path></svg>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{card.title}</h3>
                <p className="text-xs font-bold text-white/40 mt-3 uppercase tracking-[0.2em]">{card.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-1 saffron-gradient opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const themeColor = view.includes('student') ? '#FF9933' : '#4338ca';

  return (
    <div className={`min-h-screen flex items-center justify-center bg-slate-900 p-6`}>
      <div className="max-w-md w-full glass rounded-[3rem] shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-500">
        <div className={`p-12 text-center relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-full saffron-gradient opacity-10"></div>
          <button onClick={() => setView('selection')} className="absolute top-8 left-8 p-3 hover:bg-white/10 rounded-2xl transition-all z-10 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h2 className="text-4xl font-black uppercase text-white tracking-tighter mb-2 relative z-10">
            {view === 'student-login' ? 'Sign In' : view === 'student-register' ? 'Join Portal' : view === 'teacher-login' ? 'Teachers' : 'Security'}
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] relative z-10">Verification required</p>
        </div>
        
        <form onSubmit={handleAction} className="px-10 pb-12 space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              <span>{error}</span>
            </div>
          )}
          
          {(view === 'student-login' || view === 'student-register') && (
            <div className="space-y-4">
              {view === 'student-register' && (
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 ml-1">Full Student Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-white/10 focus:border-orange-500 focus:bg-white/5 bg-white/5 outline-none font-bold text-white transition-all" placeholder="e.g. Aryan Singh" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 ml-1">Roll No.</label>
                  <input type="text" required value={formData.roll_no} onChange={(e) => setFormData({...formData, roll_no: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-white/10 focus:border-orange-500 bg-white/5 outline-none font-bold text-white transition-all" placeholder="ID" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 ml-1">Secret Key</label>
                  <input type="text" required value={formData.computer_id} onChange={(e) => setFormData({...formData, computer_id: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-white/10 focus:border-orange-500 bg-white/5 outline-none font-bold text-white transition-all" placeholder="Comp ID" />
                </div>
              </div>
              {view === 'student-register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 ml-1">Grade</label>
                    <select value={formData.class_name} onChange={(e) => setFormData({...formData, class_name: e.target.value, section: 'A'})} className="w-full px-6 py-4 rounded-2xl border border-white/10 focus:border-orange-500 bg-slate-800 outline-none font-bold text-white transition-all appearance-none">
                      {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 ml-1">Section</label>
                    <select value={formData.section} onChange={(e) => setFormData({...formData, section: e.target.value})} className="w-full px-6 py-4 rounded-2xl border border-white/10 focus:border-orange-500 bg-slate-800 outline-none font-bold text-white transition-all appearance-none">
                      {SECTIONS_MAP[formData.class_name].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {(view === 'teacher-login' || view === 'admin-login') && (
            <div>
              <label className="block text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 ml-1">Access Codeword</label>
              <input type="password" required value={formData.codeword} onChange={(e) => setFormData({...formData, codeword: e.target.value})} className={`w-full px-8 py-6 rounded-3xl border border-white/10 focus:border-orange-500 focus:bg-white/5 bg-white/5 outline-none font-black text-white transition-all text-center tracking-[1em] text-2xl`} placeholder="••••••" />
            </div>
          )}

          <button type="submit" disabled={loading} className={`w-full saffron-gradient hover:scale-[1.02] disabled:opacity-50 text-white font-black py-6 rounded-2xl shadow-2xl transition-all flex justify-center items-center gap-3 uppercase tracking-[0.3em] text-[10px] mt-4`}>
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Authorize Now'}
          </button>

          {view.includes('student') && (
            <div className="text-center pt-4">
              <button type="button" onClick={() => { setView(view === 'student-login' ? 'student-register' : 'student-login'); resetForm(); }} className={`text-[10px] text-white/40 hover:text-white font-black uppercase tracking-widest transition-colors underline underline-offset-8 decoration-white/10`}>
                {view === 'student-login' ? "New student? Enroll here" : 'Already enrolled? Log in'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;