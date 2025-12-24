import React, { useState } from 'react';

interface AdminDashboardProps {
  resultsEnabled: boolean;
  onUpdateSetting: (key: string, value: string) => Promise<void>;
  examName: string;
  session: string;
  studentCount: number;
  onFactoryReset: () => void;
  onDeleteAllMarks: () => Promise<void>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [eName, setEName] = useState(props.examName);
  const [eSession, setESession] = useState(props.session);

  const handleUpdate = async () => {
    await props.onUpdateSetting('examName', eName);
    await props.onUpdateSetting('session', eSession);
    alert("Saved successfully!");
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

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100">
        <h3 className="text-lg font-black uppercase mb-6">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Exam Title</label>
            <input value={eName} onChange={e => setEName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold border-0 focus:ring-2 ring-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Session</label>
            <input value={eSession} onChange={e => setESession(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold border-0 focus:ring-2 ring-indigo-500 outline-none" />
          </div>
        </div>
        <button onClick={handleUpdate} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest">Update Portal Settings</button>
        
        <div className="mt-12 pt-8 border-t flex flex-wrap gap-4">
           <button onClick={props.onDeleteAllMarks} className="px-6 py-4 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-red-100">Wipe All Marks</button>
           <button onClick={props.onFactoryReset} className="px-6 py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Reset Portal</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;