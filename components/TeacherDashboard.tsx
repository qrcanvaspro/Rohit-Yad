
import React, { useState } from 'react';
import { Student, Mark } from '../types';
import { CLASSES, SECTIONS_MAP, SUBJECTS_BY_STREAM } from '../constants';
import { db } from '../supabase';

interface TeacherDashboardProps {
  students: Student[];
  marks: Mark[];
  setMarks: React.Dispatch<React.SetStateAction<Mark[]>>;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ students, marks, setMarks, setStudents }) => {
  const [selectedClass, setSelectedClass] = useState('9');
  const [selectedSection, setSelectedSection] = useState('A');
  const [editingMarksFor, setEditingMarksFor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filteredStudents = students.filter(s => s.class_name === selectedClass && s.section === selectedSection);

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm("CAUTION: This will delete the student and their marks permanently.")) {
      try {
        await db.students.delete(id);
        setStudents(prev => prev.filter(s => s.id !== id));
        setMarks(prev => prev.filter(m => m.student_id !== id));
      } catch (err) {
        alert("Could not delete from cloud. Check connection.");
      }
    }
  };

  const MarkEditor: React.FC<{ student: Student }> = ({ student }) => {
    const subjects = SUBJECTS_BY_STREAM[student.stream] || SUBJECTS_BY_STREAM['General'];
    const currentMarks = marks.filter(m => m.student_id === student.id);
    
    const [localMarks, setLocalMarks] = useState<Record<string, number>>(
      subjects.reduce((acc, sub) => {
        const found = currentMarks.find(m => m.subject === sub);
        acc[sub] = found ? found.marks_obtained : 0;
        return acc;
      }, {} as Record<string, number>)
    );

    const handleSave = async () => {
      setSaving(true);
      try {
        const entries = subjects.map(sub => ({
          student_id: student.id,
          subject: sub,
          marks_obtained: localMarks[sub] || 0,
          max_marks: 100
        }));
        
        await db.marks.upsert(entries);
        
        // Update the main app state immediately
        setMarks(prev => {
          const others = prev.filter(m => m.student_id !== student.id);
          const newMarks: Mark[] = entries.map(e => ({ ...e, id: crypto.randomUUID() }));
          return [...others, ...newMarks];
        });
        
        setEditingMarksFor(null);
      } catch (e) {
        alert("Failed to sync grades with database.");
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in duration-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase">{student.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roll: {student.roll_no} • {student.stream}</p>
            </div>
            <button onClick={() => setEditingMarksFor(null)} className="text-slate-300 hover:text-slate-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
            {subjects.map(sub => (
              <div key={sub} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 text-sm">{sub}</span>
                <input 
                  type="number" 
                  max="100"
                  min="0"
                  value={localMarks[sub]}
                  onChange={(e) => setLocalMarks({...localMarks, [sub]: Math.min(100, parseInt(e.target.value) || 0)})}
                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center font-black focus:border-indigo-500 outline-none"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              disabled={saving}
              onClick={handleSave} 
              className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-2"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Sync to Cloud"}
            </button>
            <button onClick={() => setEditingMarksFor(null)} className="px-6 bg-slate-100 text-slate-400 font-black py-4 rounded-xl text-xs uppercase tracking-widest">Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase">Grade Ledger</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Class {selectedClass} | Sec {selectedSection}</p>
        </div>
        <div className="flex gap-2">
           <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black outline-none focus:border-indigo-500">
              {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
           </select>
           <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black outline-none focus:border-indigo-500">
              {SECTIONS_MAP[selectedClass].map(s => <option key={s} value={s}>Section {s}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Stream</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStudents.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-500 text-sm">#{s.roll_no}</td>
                <td className="px-6 py-4 font-black text-slate-800 text-sm uppercase">{s.name}</td>
                <td className="px-6 py-4">
                  <span className="text-[9px] font-black px-2 py-0.5 bg-orange-50 text-orange-600 rounded uppercase">{s.stream}</span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => setEditingMarksFor(s.id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                   </button>
                   <button onClick={() => handleDeleteStudent(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingMarksFor && (
        <MarkEditor student={students.find(s => s.id === editingMarksFor)!} />
      )}
    </div>
  );
};

export default TeacherDashboard;
