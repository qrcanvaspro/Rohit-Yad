
import React, { useState } from 'react';
import { Student, Mark } from '../types';
import { CLASSES, SECTIONS_MAP, SUBJECTS_BY_STREAM } from '../constants';
import { db } from '../supabase';

interface TeacherDashboardProps {
  students: Student[];
  marks: Mark[];
  setMarks: React.Dispatch<React.SetStateAction<Mark[]>>;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  refreshData: () => Promise<void>;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ students, marks, refreshData }) => {
  const [selectedClass, setSelectedClass] = useState('9');
  const [selectedSection, setSelectedSection] = useState('A');
  const [editingMarksFor, setEditingMarksFor] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredStudents = students.filter(s => s.class_name === selectedClass && s.section === selectedSection);

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Delete this student permanently?")) return;
    setIsProcessing(true);
    try {
      await db.students.delete(id);
      await refreshData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsProcessing(false);
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
      setIsProcessing(true);
      try {
        const entries = subjects.map(sub => ({
          student_id: student.id,
          subject: sub,
          marks_obtained: localMarks[sub] || 0,
          max_marks: 100
        }));
        await db.marks.upsert(entries);
        await refreshData();
        setEditingMarksFor(null);
      } catch (e: any) {
        alert("Failed to save: " + e.message);
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black uppercase text-slate-800">{student.name}</h3>
            <button onClick={() => setEditingMarksFor(null)} className="text-slate-400 hover:text-slate-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {subjects.map(sub => (
              <div key={sub} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-700 text-sm uppercase">{sub}</span>
                <input 
                  type="number" max="100" min="0"
                  value={localMarks[sub]}
                  onChange={(e) => setLocalMarks({...localMarks, [sub]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))})}
                  className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl text-center font-black"
                />
              </div>
            ))}
          </div>
          <button 
            disabled={isProcessing}
            onClick={handleSave} 
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs flex justify-center items-center"
          >
            {isProcessing ? "Saving..." : "Update Marks"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 ml-4">Marks Management</h2>
        <div className="flex gap-2">
           <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection('A'); }} className="px-4 py-2 bg-slate-50 border rounded-lg font-black text-xs uppercase">
              {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
           </select>
           <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-4 py-2 bg-slate-50 border rounded-lg font-black text-xs uppercase">
              {SECTIONS_MAP[selectedClass].map(s => <option key={s} value={s}>Section {s}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Roll</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Stream</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-500">#{s.roll_no}</td>
                  <td className="px-6 py-4 font-black uppercase text-slate-800">{s.name}</td>
                  <td className="px-6 py-4"><span className="text-[9px] font-black px-2 py-1 bg-orange-100 text-orange-700 rounded uppercase">{s.stream}</span></td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                     <button onClick={() => setEditingMarksFor(s.id)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-[10px] font-black uppercase tracking-widest">Update Results</button>
                     <button onClick={() => handleDeleteStudent(s.id)} disabled={isProcessing} className="p-2 text-red-600 hover:bg-red-50 rounded-lg text-[10px] font-black uppercase tracking-widest">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">No students registered in this section yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingMarksFor && <MarkEditor student={students.find(s => s.id === editingMarksFor)!} />}
    </div>
  );
};

export default TeacherDashboard;
