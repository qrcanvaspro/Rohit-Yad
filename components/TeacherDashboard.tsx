
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
  onRegisterStudent: (student: Partial<Student>) => Promise<Student>;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ students, marks, refreshData, onRegisterStudent }) => {
  const [selectedClass, setSelectedClass] = useState('9');
  const [selectedSection, setSelectedSection] = useState('A');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMarksFor, setEditingMarksFor] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Add Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    roll_no: '',
    computer_id: '',
    class_name: '9',
    section: 'A'
  });

  const filteredStudents = students.filter(s => 
    s.class_name === selectedClass && 
    s.section === selectedSection &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll_no.includes(searchQuery))
  );

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

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await onRegisterStudent(newStudent);
      setShowAddModal(false);
      setNewStudent({ name: '', roll_no: '', computer_id: '', class_name: '9', section: 'A' });
      await refreshData();
      alert("Scholar added to registry successfully.");
    } catch (err: any) {
      alert("Failed: " + err.message);
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
      <div className="fixed inset-0 bg-red-950/70 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 border border-amber-100">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-xl font-black uppercase text-red-950 tracking-tighter">{student.name}</h3>
               <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mt-1">Roll No: {student.roll_no} • {student.stream}</p>
            </div>
            <button onClick={() => setEditingMarksFor(null)} className="w-10 h-10 bg-amber-50 text-amber-600 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {subjects.map(sub => (
              <div key={sub} className="flex items-center justify-between p-4 bg-amber-50/20 rounded-2xl border border-amber-100 group hover:border-amber-300 transition-all">
                <span className="font-bold text-red-900 text-xs uppercase tracking-tight">{sub}</span>
                <div className="flex items-center gap-3">
                   <input 
                     type="number" max="100" min="0"
                     value={localMarks[sub]}
                     onChange={(e) => setLocalMarks({...localMarks, [sub]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))})}
                     className="w-20 px-3 py-2 bg-white border border-amber-200 rounded-xl text-center font-black text-red-950 outline-none focus:ring-2 ring-amber-400"
                   />
                   <span className="text-[10px] font-black text-amber-900/20 uppercase tracking-widest">/ 100</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            disabled={isProcessing}
            onClick={handleSave} 
            className="w-full mt-6 accent-gradient hover:opacity-90 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] flex justify-center items-center shadow-xl shadow-amber-500/20 transition-all"
          >
            {isProcessing ? "Finalizing Entry..." : "Confirm & Save Results"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-amber-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="hidden md:block w-10 h-10 saffron-gradient rounded-full flex items-center justify-center text-white shadow-lg shadow-red-900/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
           </div>
           <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-red-950">Faculty Dashboard</h2>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Section {selectedClass}-{selectedSection} Performance Log</p>
           </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={() => setShowAddModal(true)}
             className="px-6 py-2 bg-red-950 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-950/20 hover:scale-105 transition-all"
           >
             + New Admission
           </button>
           <input 
             type="text"
             placeholder="Search scholar..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="px-4 py-2 bg-amber-50/50 border-0 rounded-lg font-bold text-[11px] outline-none focus:ring-2 ring-amber-500 min-w-[180px] text-red-950 placeholder:text-red-950/20"
           />
           <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection('A'); }} className="px-4 py-2 bg-amber-50/50 border-0 rounded-lg font-black text-[10px] uppercase tracking-widest cursor-pointer text-red-950">
              {CLASSES.map(c => <option key={c} value={c}>Std {c}</option>)}
           </select>
           <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-4 py-2 bg-amber-50/50 border-0 rounded-lg font-black text-[10px] uppercase tracking-widest cursor-pointer text-red-950">
              {SECTIONS_MAP[selectedClass].map(s => <option key={s} value={s}>Sec {s}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-amber-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-amber-50/30 border-b border-amber-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-amber-900/40">Roll No</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-amber-900/40">Student Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-amber-900/40">Academic Stream</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-amber-900/40">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50">
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-amber-50/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-red-950/50 text-xs">#{s.roll_no}</td>
                  <td className="px-6 py-4 font-black uppercase text-red-950 tracking-tight text-sm">{s.name}</td>
                  <td className="px-6 py-4"><span className="text-[9px] font-black px-2 py-1 bg-red-100/50 text-red-800 rounded uppercase tracking-widest">{s.stream}</span></td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                     <button onClick={() => setEditingMarksFor(s.id)} className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Update Marks</button>
                     <button onClick={() => handleDeleteStudent(s.id)} disabled={isProcessing} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-700 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Revoke</button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-amber-900/20 font-black uppercase text-[10px] tracking-[0.3em] italic">
                    {searchQuery ? "No scholar matches your query" : "Registry is currently empty for this section"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-red-950/70 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 border border-amber-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase text-red-950 tracking-tighter">New Admission</h3>
              <button onClick={() => setShowAddModal(false)} className="text-amber-400 hover:text-red-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-amber-600 ml-1">Scholar Name</label>
                <input required value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full p-4 bg-amber-50 rounded-2xl font-bold text-red-950 outline-none focus:ring-2 ring-amber-400" placeholder="e.g. Rahul Kumar" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-amber-600 ml-1">Roll No</label>
                  <input required value={newStudent.roll_no} onChange={e => setNewStudent({...newStudent, roll_no: e.target.value})} className="w-full p-4 bg-amber-50 rounded-2xl font-bold text-red-950 outline-none focus:ring-2 ring-amber-400" placeholder="e.g. 101" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-amber-600 ml-1">Secret Key</label>
                  <input required value={newStudent.computer_id} onChange={e => setNewStudent({...newStudent, computer_id: e.target.value})} className="w-full p-4 bg-amber-50 rounded-2xl font-bold text-red-950 outline-none focus:ring-2 ring-amber-400" placeholder="e.g. PIN123" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-amber-600 ml-1">Class</label>
                  <select value={newStudent.class_name} onChange={e => setNewStudent({...newStudent, class_name: e.target.value})} className="w-full p-4 bg-amber-50 rounded-2xl font-black text-[10px] uppercase text-red-950">
                    {CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-amber-600 ml-1">Section</label>
                  <select value={newStudent.section} onChange={e => setNewStudent({...newStudent, section: e.target.value})} className="w-full p-4 bg-amber-50 rounded-2xl font-black text-[10px] uppercase text-red-950">
                    {SECTIONS_MAP[newStudent.class_name].map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
              </div>
              <button disabled={isProcessing} className="w-full saffron-gradient text-white font-black py-5 rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-red-900/10 hover:scale-105 transition-all mt-4">
                {isProcessing ? "Saving Record..." : "Confirm Admission"}
              </button>
            </form>
          </div>
        </div>
      )}

      {editingMarksFor && <MarkEditor student={students.find(s => s.id === editingMarksFor)!} />}
    </div>
  );
};

export default TeacherDashboard;
