
import React, { useState } from 'react';
import { CLASSES, SECTIONS_MAP } from '../constants';
import { TeacherMapping } from '../types';

interface AdminDashboardProps {
  resultsEnabled: boolean;
  registrationEnabled: boolean;
  onUpdateSetting: (key: string, value: string) => Promise<void>;
  examName: string;
  session: string;
  studentCount: number;
  onFactoryReset: () => void;
  onDeleteAllMarks: () => Promise<void>;
  teacherMappings: TeacherMapping;
  onUpdateMappings: (mappings: TeacherMapping) => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [eName, setEName] = useState(props.examName);
  const [eSession, setESession] = useState(props.session);
  
  const [newClass, setNewClass] = useState('9');
  const [newSection, setNewSection] = useState('A');
  const [newPhone, setNewPhone] = useState('');

  const handleUpdate = async () => {
    await props.onUpdateSetting('examName', eName);
    await props.onUpdateSetting('session', eSession);
    alert("Configurations synchronized!");
  };

  const handleAddTeacher = async () => {
    if (!newPhone || newPhone.length < 10) {
      alert("Invalid Phone: Use 91xxxxxxxxxx format.");
      return;
    }
    const key = `${newClass}-${newSection}`;
    const updatedMappings = { ...props.teacherMappings, [key]: newPhone };
    await props.onUpdateMappings(updatedMappings);
    setNewPhone('');
    alert(`Success: Class ${key} linked to +${newPhone}`);
  };

  const handleRemoveMapping = async (key: string) => {
    const updated = { ...props.teacherMappings };
    delete updated[key];
    await props.onUpdateMappings(updated);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border-b-4 border-amber-500 shadow-sm overflow-hidden relative">
          <div className="text-4xl font-black text-red-950 relative z-10">{props.studentCount}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 relative z-10">Total Students</div>
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <svg className="w-20 h-20 text-red-950" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-b-4 border-red-800 shadow-sm group">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${props.resultsEnabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}></div>
            <div className="text-2xl font-black uppercase text-red-950">{props.resultsEnabled ? 'Live' : 'Hidden'}</div>
          </div>
          <button onClick={() => props.onUpdateSetting('resultsEnabled', props.resultsEnabled ? 'false' : 'true')} className="mt-2 text-[10px] font-black uppercase text-amber-600 hover:text-amber-800 transition-colors tracking-widest">Results Toggle</button>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-b-4 border-emerald-800 shadow-sm group">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${props.registrationEnabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}></div>
            <div className="text-2xl font-black uppercase text-red-950">{props.registrationEnabled ? 'Open' : 'Closed'}</div>
          </div>
          <button onClick={() => props.onUpdateSetting('registrationEnabled', props.registrationEnabled ? 'false' : 'true')} className="mt-2 text-[10px] font-black uppercase text-amber-600 hover:text-amber-800 transition-colors tracking-widest">Regis. Toggle</button>
        </div>
        <div className="bg-red-950 p-8 rounded-[2rem] text-white shadow-xl shadow-red-950/20">
          <div className="text-xl font-black uppercase tracking-tight text-amber-400">Secure Vault</div>
          <div className="text-[10px] font-bold uppercase text-amber-200/40 tracking-widest">E2E Encryption</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Configuration */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-amber-100 h-full shadow-sm">
          <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-3 text-red-950">
            <div className="w-8 h-8 rounded-lg saffron-gradient flex items-center justify-center shadow-lg shadow-red-900/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
            </div>
            Portal Parameters
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-amber-900/40 ml-1 tracking-widest">Academic Event</label>
              <input value={eName} onChange={e => setEName(e.target.value)} className="w-full px-5 py-4 bg-amber-50/50 rounded-2xl font-bold border-0 focus:ring-2 ring-red-800 outline-none text-red-950" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-amber-900/40 ml-1 tracking-widest">Active Session</label>
              <input value={eSession} onChange={e => setESession(e.target.value)} className="w-full px-5 py-4 bg-amber-50/50 rounded-2xl font-bold border-0 focus:ring-2 ring-red-800 outline-none text-red-950" />
            </div>
            <button onClick={handleUpdate} className="w-full saffron-gradient text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-900/10 hover:opacity-90 transition-all">Update Portal Meta</button>
            
            <div className="pt-6 border-t border-amber-50 flex flex-wrap gap-3">
               <button onClick={props.onDeleteAllMarks} className="flex-1 px-4 py-3 bg-red-50 text-red-800 rounded-xl font-black text-[9px] uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-colors">Wipe Marks</button>
               <button onClick={props.onFactoryReset} className="flex-1 px-4 py-3 bg-red-950 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-colors">Hard Reset</button>
            </div>
          </div>
        </div>

        {/* Teacher Assignments */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-amber-100 h-full shadow-sm">
          <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-3 text-red-950">
            <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            Staff Assignments
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-amber-900/40 ml-1 mb-2 block">Standard</label>
                <select value={newClass} onChange={e => setNewClass(e.target.value)} className="w-full px-4 py-3 bg-amber-50/50 border-0 rounded-xl font-black text-[10px] uppercase tracking-widest focus:ring-2 ring-amber-500 text-red-950">
                  {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-amber-900/40 ml-1 mb-2 block">Section</label>
                <select value={newSection} onChange={e => setNewSection(e.target.value)} className="w-full px-4 py-3 bg-amber-50/50 border-0 rounded-xl font-black text-[10px] uppercase tracking-widest focus:ring-2 ring-amber-500 text-red-950">
                  {SECTIONS_MAP[newClass].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-amber-900/40 ml-1 tracking-widest">Direct Contact (91xxxxxxxxxx)</label>
              <input 
                type="tel"
                placeholder="91xxxxxxxxxx"
                value={newPhone} 
                onChange={e => setNewPhone(e.target.value.replace(/\D/g, ''))} 
                className="w-full px-5 py-4 bg-amber-50/50 rounded-2xl font-bold border-0 focus:ring-2 ring-amber-500 outline-none text-red-950" 
              />
            </div>
            <button onClick={handleAddTeacher} className="w-full accent-gradient text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-500/10 hover:opacity-90 transition-all">Link WhatsApp Hub</button>
            
            <div className="mt-8">
              <label className="text-[10px] font-black uppercase text-amber-900/40 ml-1 mb-4 block underline underline-offset-4 decoration-amber-100 tracking-[0.2em]">Faculty Registry</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(props.teacherMappings).length > 0 ? Object.entries(props.teacherMappings).map(([key, phone]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-amber-50/20 rounded-2xl border border-amber-100 group hover:border-amber-300 transition-all">
                    <div>
                      <span className="text-[9px] font-black bg-red-900/10 text-red-950 px-2 py-1 rounded-md uppercase mr-3">SEC {key}</span>
                      <span className="font-bold text-red-900 text-xs">+{phone}</span>
                    </div>
                    <button onClick={() => handleRemoveMapping(key)} className="text-red-400 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    </button>
                  </div>
                )) : (
                  <p className="text-[9px] font-black uppercase text-amber-900/20 text-center py-4">No staff mapping found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
