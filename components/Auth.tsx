
import React, { useState } from 'react';
import { Role, Student } from '../types';
import { CLASSES, SECTIONS_MAP } from '../constants';

interface AuthProps {
  onLogin: (role: Role, profile: any) => void;
  onRegister: (student: Partial<Student>) => Promise<Student>;
  students: Student[];
  onBack: () => void;
  registrationEnabled: boolean;
}

type AuthView = 'selection' | 'student-login' | 'student-register' | 'teacher-login' | 'admin-login';

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, students, onBack, registrationEnabled }) => {
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
        if (!registrationEnabled) throw new Error('Public registration is currently closed by Administration.');
        if (!formData.name || !formData.roll_no || !formData.computer_id) {
          throw new Error('Please fill all fields');
        }
        
        const alreadyExists = students.find(s => s.roll_no === formData.roll_no);
        if (alreadyExists) throw new Error('Roll Number already registered');

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
          throw new Error('Invalid Roll No. or Secret Key');
        }
      } 
      else if (view === 'teacher-login') {
        if (formData.codeword === 'TEACHER_SVM_2024') {
          onLogin('TEACHER', { name: 'Faculty Member', email: 'teacher@svm.edu' });
        } else {
          throw new Error('Wrong Codeword');
        }
      } 
      else if (view === 'admin-login') {
        if (formData.codeword === 'ADMIN_RAMBAGH_786') {
          onLogin('ADMIN', { name: 'Principal Office', email: 'admin@svm.edu' });
        } else {
          throw new Error('Wrong Codeword');
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#fefce8] relative overflow-hidden hero-pattern">
        {/* Heritage Patterns */}
        <div className="absolute top-10 left-10 w-40 h-40 gold-gradient opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 saffron-gradient opacity-5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl w-full relative z-10">
          <div className="text-center mb-24">
            <button onClick={onBack} className="mb-12 text-amber-950/40 hover:text-amber-950 uppercase font-black text-[12px] tracking-[0.5em] transition-all bg-white/40 px-10 py-4 rounded-full border-2 border-amber-500/10 backdrop-blur-md">Return to Main Site</button>
            <h1 className="text-7xl font-black text-amber-950 uppercase tracking-tighter drop-shadow-sm">Gateway <span className="text-amber-600">Access</span></h1>
            <p className="mt-4 text-[11px] font-black text-amber-600/40 uppercase tracking-[1em]">Secure Academic Hub</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { id: 'student-login', label: 'Scholar Hub', desc: 'Results & Records', icon: 'M12 14l9-5-9-5-9 5 9 5z', grad: 'gold-gradient' },
              { id: 'teacher-login', label: 'Faculty Hub', desc: 'Registry & Marks', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5', grad: 'accent-gradient' },
              { id: 'admin-login', label: 'Admin Desk', desc: 'Control Center', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0', grad: 'bg-amber-950' }
            ].map((card) => (
              <button key={card.id} onClick={() => { resetForm(); setView(card.id as any); }} className="glass p-16 rounded-[4rem] text-center hover:scale-105 transition-all group border-4 border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-[100%] transition-transform group-hover:scale-150"></div>
                <div className={`w-28 h-28 ${card.grad} rounded-[2.2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-amber-900/30 group-hover:rotate-6 transition-transform border-4 border-white/20`}>
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={card.icon}></path></svg>
                </div>
                <h3 className="text-3xl font-black text-amber-950 uppercase tracking-tighter mb-4">{card.label}</h3>
                <p className="text-[12px] font-black text-amber-700/60 uppercase tracking-[0.3em]">{card.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefce8] p-6 relative overflow-hidden hero-pattern">
      <div className="max-w-xl w-full glass rounded-[4rem] p-16 border-4 border-white/50 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <button onClick={() => setView('selection')} className="text-amber-950/40 hover:text-amber-950 mb-12 flex items-center gap-4 font-black text-[12px] uppercase tracking-[0.4em] transition-all">
           <div className="w-10 h-10 rounded-full gold-gradient text-white flex items-center justify-center shadow-lg">&larr;</div>
           Exit to Selection
        </button>
        <h2 className="text-4xl font-black text-amber-950 uppercase mb-12 tracking-tighter">
          {view === 'student-login' ? 'Scholar Entry' : view === 'student-register' ? 'New Registry' : 'Faculty Access'}
        </h2>
        
        <form onSubmit={handleAction} className="space-y-8">
          {error && <div className="p-8 bg-red-500/10 text-red-700 rounded-[2rem] text-[12px] font-black uppercase tracking-widest border-2 border-red-200 shadow-sm leading-relaxed">{error}</div>}
          
          {(view === 'student-login' || view === 'student-register') && (
            <>
              {view === 'student-register' && (
                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase text-amber-900/40 ml-3 tracking-[0.2em]">Scholar Full Name</label>
                   <input type="text" required placeholder="Enter Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-6 bg-white border-4 border-amber-500/5 rounded-[2rem] text-amber-950 font-bold outline-none focus:border-amber-500 focus:ring-8 ring-amber-500/5 placeholder:text-amber-950/20 shadow-inner" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-amber-900/40 ml-3 tracking-[0.2em]">Roll No</label>
                  <input type="text" required placeholder="Ex. 101" value={formData.roll_no} onChange={e => setFormData({...formData, roll_no: e.target.value})} className="w-full p-6 bg-white border-4 border-amber-500/5 rounded-[2rem] text-amber-950 font-bold outline-none focus:border-amber-500 focus:ring-8 ring-amber-500/5 placeholder:text-amber-950/20 shadow-inner" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase text-amber-900/40 ml-3 tracking-[0.2em]">Identity Key</label>
                  <input type="password" required placeholder="Pin" value={formData.computer_id} onChange={e => setFormData({...formData, computer_id: e.target.value})} className="w-full p-6 bg-white border-4 border-amber-500/5 rounded-[2rem] text-amber-950 font-bold outline-none focus:border-amber-500 focus:ring-8 ring-amber-500/5 placeholder:text-amber-950/20 shadow-inner" />
                </div>
              </div>
              {view === 'student-register' && (
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-amber-900/40 ml-3 tracking-[0.2em]">Std.</label>
                    <select value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})} className="w-full p-6 bg-white border-4 border-amber-500/5 text-amber-950 rounded-[2rem] font-black text-[12px] uppercase tracking-widest outline-none focus:border-amber-500 appearance-none shadow-sm cursor-pointer">
                      {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase text-amber-900/40 ml-3 tracking-[0.2em]">Sec.</label>
                    <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full p-6 bg-white border-4 border-amber-500/5 text-amber-950 rounded-[2rem] font-black text-[12px] uppercase tracking-widest outline-none focus:border-amber-500 appearance-none shadow-sm cursor-pointer">
                      {SECTIONS_MAP[formData.class_name].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {(view === 'teacher-login' || view === 'admin-login') && (
            <div className="space-y-6">
              <label className="text-[12px] font-black uppercase text-amber-950/40 text-center block tracking-[0.5em]">Faculty Secret Code</label>
              <input type="password" required placeholder="••••••••" value={formData.codeword} onChange={e => setFormData({...formData, codeword: e.target.value})} className="w-full p-10 bg-white border-4 border-amber-500/5 rounded-[3rem] text-amber-950 font-black outline-none text-center text-4xl tracking-[1em] focus:border-amber-500 focus:ring-12 ring-amber-500/5 shadow-inner" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn-3d saffron-gradient p-8 rounded-[2.5rem] text-white font-black uppercase tracking-[0.5em] text-[14px] hover:scale-105 transition-all shadow-2xl shadow-amber-500/30 mt-8 active:scale-95 border-2 border-white/20">
            {loading ? 'Processing...' : 'Verify Entry'}
          </button>

          <div className="pt-10 text-center">
            {view === 'student-login' && registrationEnabled && (
              <button type="button" onClick={() => setView('student-register')} className="text-amber-950/30 text-[12px] uppercase font-black tracking-[0.5em] hover:text-amber-950 transition-colors">
                Registry Open &bull; Join Now
              </button>
            )}
            {view === 'student-register' && (
              <button type="button" onClick={() => setView('student-login')} className="text-amber-950/30 text-[12px] uppercase font-black tracking-[0.5em] hover:text-amber-950 transition-colors">
                Already Joined? Enter Hub
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
