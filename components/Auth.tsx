
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
      <div className="min-h-screen flex items-center justify-center p-10 bg-[#fefce8] relative overflow-hidden hero-pattern-rich">
        {/* Heritage Decorations */}
        <div className="absolute top-0 left-0 w-full h-40 saffron-gradient opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 gold-gradient opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl w-full relative z-10">
          <div className="text-center mb-28">
            <button onClick={onBack} className="mb-12 bg-white px-12 py-4 rounded-full border-4 border-orange-500/20 text-orange-950 font-black text-[12px] uppercase tracking-[0.5em] transition-all hover:scale-110 active:scale-95 shadow-xl">Back to Homepage</button>
            <h1 className="text-8xl font-black text-orange-950 uppercase tracking-tighter drop-shadow-2xl leading-none">Identity <br/><span className="text-orange-600">Verification</span></h1>
            <p className="mt-6 text-[13px] font-black text-orange-900/40 uppercase tracking-[1em] shloka-font">सा विद्या या विमुक्तये</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { id: 'student-login', label: 'Scholar Hub', icon: 'M12 14l9-5-9-5-9 5 9 5z', grad: 'saffron-gradient', desc: 'View Results' },
              { id: 'teacher-login', label: 'Faculty Hub', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5', grad: 'gold-gradient', desc: 'Entry Portal' },
              { id: 'admin-login', label: 'Admin Desk', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0', grad: 'bg-orange-950', desc: 'System Controls' }
            ].map((card) => (
              <button key={card.id} onClick={() => { resetForm(); setView(card.id as any); }} className="glass-heavy p-20 rounded-[4.5rem] text-center hover:scale-105 transition-all group border-8 border-white shadow-[0_50px_100px_-30px_rgba(180,83,9,0.3)] relative overflow-hidden">
                <div className={`w-32 h-32 ${card.grad} rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-2xl group-hover:rotate-12 transition-transform duration-500 border-4 border-white/20`}>
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={card.icon}></path></svg>
                </div>
                <h3 className="text-4xl font-black text-orange-950 uppercase tracking-tighter mb-4">{card.label}</h3>
                <p className="text-[14px] font-black text-orange-700/50 uppercase tracking-[0.4em]">{card.desc}</p>
                <div className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="inline-block bg-orange-600/10 px-6 py-2 rounded-full text-[10px] font-black uppercase text-orange-700">Enter Hub &rarr;</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefce8] p-10 relative overflow-hidden hero-pattern-rich">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm pointer-events-none"></div>

      <div className="max-w-2xl w-full glass-heavy rounded-[5rem] p-20 border-8 border-white shadow-2xl relative z-10 animate-in fade-in zoom-in duration-700">
        <button onClick={() => setView('selection')} className="text-orange-950/40 hover:text-orange-950 mb-14 flex items-center gap-4 font-black text-[13px] uppercase tracking-[0.5em] transition-all">
           <div className="w-12 h-12 rounded-full saffron-gradient text-white flex items-center justify-center shadow-2xl">&larr;</div>
           Exit Gateway
        </button>
        <h2 className="text-6xl font-black text-orange-950 uppercase mb-14 tracking-tighter leading-none">
          {view === 'student-login' ? 'Scholar Hub' : view === 'student-register' ? 'New Entry' : 'Secure Entry'}
        </h2>
        
        <form onSubmit={handleAction} className="space-y-10">
          {error && <div className="p-8 bg-red-500/10 text-red-700 rounded-[2.5rem] text-[13px] font-black uppercase tracking-widest border-4 border-red-100 shadow-inner">{error}</div>}
          
          {(view === 'student-login' || view === 'student-register') && (
            <div className="space-y-8">
              {view === 'student-register' && (
                <div className="space-y-3">
                   <label className="text-[12px] font-black uppercase text-orange-950/30 ml-4 tracking-[0.3em]">Full Legal Name</label>
                   <input type="text" required placeholder="Ex. Rahul Verma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-8 bg-orange-50/50 border-4 border-orange-500/5 rounded-[2.5rem] text-orange-950 font-bold outline-none focus:border-orange-500 focus:ring-12 ring-orange-500/5 shadow-inner text-xl placeholder:text-orange-950/20" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase text-orange-950/30 ml-4 tracking-[0.3em]">Roll Number</label>
                  <input type="text" required placeholder="000" value={formData.roll_no} onChange={e => setFormData({...formData, roll_no: e.target.value})} className="w-full p-8 bg-orange-50/50 border-4 border-orange-500/5 rounded-[2.5rem] text-orange-950 font-bold outline-none focus:border-orange-500 focus:ring-12 ring-orange-500/5 shadow-inner text-xl placeholder:text-orange-950/20" />
                </div>
                <div className="space-y-3">
                  <label className="text-[12px] font-black uppercase text-orange-950/30 ml-4 tracking-[0.3em]">Identity Pin</label>
                  <input type="password" required placeholder="••••" value={formData.computer_id} onChange={e => setFormData({...formData, computer_id: e.target.value})} className="w-full p-8 bg-orange-50/50 border-4 border-orange-500/5 rounded-[2.5rem] text-orange-950 font-bold outline-none focus:border-orange-500 focus:ring-12 ring-orange-500/5 shadow-inner text-xl placeholder:text-orange-950/20" />
                </div>
              </div>
              {view === 'student-register' && (
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[12px] font-black uppercase text-orange-950/30 ml-4 tracking-[0.3em]">Grade</label>
                    <select value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})} className="w-full p-8 bg-white border-4 border-orange-500/5 text-orange-950 rounded-[2.5rem] font-black text-[14px] uppercase tracking-widest outline-none focus:border-orange-500 cursor-pointer shadow-inner">
                      {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-black uppercase text-orange-950/30 ml-4 tracking-[0.3em]">Sec</label>
                    <select value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="w-full p-8 bg-white border-4 border-orange-500/5 text-orange-950 rounded-[2.5rem] font-black text-[14px] uppercase tracking-widest outline-none focus:border-orange-500 cursor-pointer shadow-inner">
                      {SECTIONS_MAP[formData.class_name].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {(view === 'teacher-login' || view === 'admin-login') && (
            <div className="space-y-8">
              <label className="text-[14px] font-black uppercase text-orange-950/30 text-center block tracking-[1em]">Secret Verification Code</label>
              <input type="password" required placeholder="••••••••" value={formData.codeword} onChange={e => setFormData({...formData, codeword: e.target.value})} className="w-full p-12 bg-white border-8 border-orange-500/5 rounded-[4rem] text-orange-950 font-black outline-none text-center text-5xl tracking-[1em] focus:border-orange-500 focus:ring-16 ring-orange-500/5 shadow-2xl" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn-heritage py-10 rounded-[3rem] text-[18px] mt-8">
            {loading ? 'Decrypting Access...' : 'Enter Secure Hub'}
          </button>

          <div className="pt-12 text-center">
            {view === 'student-login' && registrationEnabled && (
              <button type="button" onClick={() => setView('student-register')} className="text-orange-950/30 text-[13px] font-black uppercase tracking-[0.6em] hover:text-orange-950 transition-colors">
                Registry Open &bull; Register Now
              </button>
            )}
            {view === 'student-register' && (
              <button type="button" onClick={() => setView('student-login')} className="text-orange-950/30 text-[13px] font-black uppercase tracking-[0.6em] hover:text-orange-950 transition-colors">
                Already Joined? Enter Now
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
