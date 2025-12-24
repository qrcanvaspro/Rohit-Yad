
import React, { useState } from 'react';
import { CLASSES, SECTIONS_MAP } from '../constants';
import { TeacherMapping } from '../types';

interface AdminDashboardProps {
  resultsEnabled: boolean;
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
    alert("Saved successfully!");
  };

  const handleAddTeacher = async () => {
    if (!newPhone || newPhone.length < 10) {
      alert("Please enter a valid phone number with country code (e.g. 91xxxxxxxxxx)");
      return;
    }
    const key = `${newClass}-${newSection}`;
    const updatedMappings = { ...props.teacherMappings, [key]: newPhone };
    await props.onUpdateMappings(updatedMappings);
    setNewPhone('');
    alert(`Assigned Class ${key} to ${newPhone}`);
  };

  const handleRemoveMapping = async (key: string) => {
    const updated = { ...props.teacherMappings };
    delete updated[key];
    await props.onUpdateMappings(updated);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border-b-4 border-orange-500 shadow-sm">
          <div className="text-4xl font-black text-slate-800">{props.studentCount}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Students</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border-b-4 border-indigo-600 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${props.resultsEnabled ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <div className="text-2xl font-black uppercase text-slate-800">{props.resultsEnabled ? 'Results Live' : 'Results Hidden'}</div>
          </div>
          <button onClick={() => props.onUpdateSetting('resultsEnabled', props.resultsEnabled ? 'false' : 'true')} className="mt-2 text-[10px] font-black uppercase text-indigo-600 hover:underline">Toggle Visibility</button>
        </div>
        <div className="bg-indigo-900 p-8 rounded-[2rem] text-white shadow-xl">
          <div className="text-xl font-black uppercase">Cloud Status</div>
          <div className="text-[10px] font-bold uppercase text-indigo-300">Synchronized & Secure</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Configuration */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 h-full">
          <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
            Configuration
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Exam Title</label>
              <input value={eName} onChange={e => setEName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold border-0 focus:ring-2 ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Session</label>
              <input value={eSession} onChange={e => setESession(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold border-0 focus:ring-2 ring-indigo-500 outline-none" />
            </div>
            <button onClick={handleUpdate} className="w-full bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Update Portal Settings</button>
            
            <div className="pt-6 border-t flex flex-wrap gap-3">
               <button onClick={props.onDeleteAllMarks} className="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[9px] uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-colors">Wipe All Marks</button>
               <button onClick={props.onFactoryReset} className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-colors">Reset Portal</button>
            </div>
          </div>
        </div>

        {/* Teacher Assignments */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 h-full">
          <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Teacher Assignments
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">Class</label>
                <select value={newClass} onChange={e => setNewClass(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl font-bold text-xs uppercase focus:ring-2 ring-emerald-500">
                  {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">Section</label>
                <select value={newSection} onChange={e => setNewSection(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl font-bold text-xs uppercase focus:ring-2 ring-emerald-500">
                  {SECTIONS_MAP[newClass].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">WhatsApp Number (with country code, e.g. 91xxxxxxxxxx)</label>
              <input 
                type="tel"
                placeholder="91xxxxxxxxxx"
                value={newPhone} 
                onChange={e => setNewPhone(e.target.value.replace(/\D/g, ''))} 
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold border-0 focus:ring-2 ring-emerald-500 outline-none" 
              />
            </div>
            <button onClick={handleAddTeacher} className="w-full bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">Assign Teacher</button>
            
            <div className="mt-8">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-4 block underline underline-offset-4 decoration-slate-200">Current Mappings</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {Object.entries(props.teacherMappings).length > 0 ? Object.entries(props.teacherMappings).map(([key, phone]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                    <div>
                      <span className="text-[9px] font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md uppercase mr-3">CLASS {key}</span>
                      <span className="font-bold text-slate-600">+{phone}</span>
                    </div>
                    <button onClick={() => handleRemoveMapping(key)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    </button>
                  </div>
                )) : (
                  <p className="text-[9px] font-black uppercase text-slate-300 text-center py-4">No teachers assigned yet</p>
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
