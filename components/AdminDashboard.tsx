
import React, { useState } from 'react';
import { db } from '../supabase';

interface AdminDashboardProps {
  resultsEnabled: boolean;
  onUpdateSetting: (key: string, value: string) => Promise<void>;
  examName: string;
  session: string;
  studentCount: number;
  onFactoryReset: () => void;
  onDeleteAllMarks: () => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  resultsEnabled, 
  onUpdateSetting, 
  examName, 
  session, 
  studentCount, 
  onFactoryReset,
  onDeleteAllMarks
}) => {
  const [localExamName, setLocalExamName] = useState(examName);
  const [localSession, setLocalSession] = useState(session);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await onUpdateSetting('examName', localExamName);
    await onUpdateSetting('session', localSession);
    setIsSaving(false);
    alert("Settings updated successfully!");
  };

  const handleExportBackup = async () => {
    const students = await db.students.getAll();
    const marks = await db.marks.getAll();
    const backupData = {
      timestamp: new Date().toISOString(),
      school: "SVM Rambagh Basti",
      data: { students, marks, examName: localExamName, session: localSession }
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SVM_PORTAL_BACKUP_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative bg-slate-900 rounded-[3rem] p-12 overflow-hidden shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">Command Center</h2>
          <p className="text-orange-400 font-black tracking-[0.4em] uppercase text-xs">Administrative & Cloud Portal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-b-8 border-orange-500 transition-all hover:-translate-y-2">
          <div className="p-4 bg-orange-50 rounded-2xl w-fit text-orange-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div className="text-5xl font-black text-slate-900">{studentCount}</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Verified Enrollees</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-b-8 border-indigo-600 transition-all hover:-translate-y-2">
          <div className="p-4 bg-indigo-50 rounded-2xl w-fit text-indigo-600 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </div>
          <div className="flex items-center gap-4">
             <div className={`w-4 h-4 rounded-full ${resultsEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
             <div className="text-3xl font-black uppercase tracking-tight">{resultsEnabled ? 'Live' : 'Hidden'}</div>
          </div>
          <button 
            onClick={() => onUpdateSetting('resultsEnabled', resultsEnabled ? 'false' : 'true')}
            className="mt-4 text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
          >
            {resultsEnabled ? 'Disable Student Access' : 'Publish Results Now'}
          </button>
        </div>

        <div className="bg-indigo-900 p-10 rounded-[2.5rem] shadow-xl border-b-8 border-indigo-400 text-white transition-all hover:-translate-y-2">
          <div className="p-4 bg-white/10 rounded-2xl w-fit text-indigo-200 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
          </div>
          <div className="text-3xl font-black uppercase tracking-tight">Cloud Active</div>
          <p className="text-indigo-300 font-bold uppercase tracking-widest text-[10px] mt-2">Server Connection: Stable</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-10 flex items-center gap-4">
          <div className="w-2 h-10 bg-indigo-500 rounded-full"></div>
          Portal Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Examination Name (e.g. Annual Exam)</label>
            <input 
              type="text" 
              value={localExamName}
              onChange={(e) => setLocalExamName(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Session (e.g. 2024-25)</label>
            <input 
              type="text" 
              value={localSession}
              onChange={(e) => setLocalSession(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl mb-12 flex items-center justify-center gap-2"
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
          Update Portal Settings
        </button>
        
        <div className="border-t border-slate-100 pt-12">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Danger Zone & Utility</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={handleExportBackup} className="flex items-center justify-center gap-3 p-6 bg-slate-50 hover:bg-slate-100 rounded-3xl transition-all border border-slate-100">
               <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
               <span className="font-black uppercase tracking-wide text-[10px]">Database Backup</span>
            </button>

            <button onClick={onDeleteAllMarks} className="flex items-center justify-center gap-3 p-6 bg-red-50 hover:bg-red-100 rounded-3xl transition-all border border-red-100">
               <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
               <span className="font-black uppercase tracking-wide text-[10px] text-red-600">Delete All Marks</span>
            </button>

            <button onClick={onFactoryReset} className="flex items-center justify-center gap-3 p-6 bg-slate-900 hover:bg-black rounded-3xl transition-all text-white shadow-xl">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
               <span className="font-black uppercase tracking-wide text-[10px]">Portal Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
