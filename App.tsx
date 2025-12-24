import React, { useState, useEffect } from 'react';
import { Role, Student, Mark, AuthState } from './types';
import { getStreamForClassSection } from './constants';
import Auth from './components/Auth';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Layout } from './components/Layout';
import { db } from './supabase';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    profile: null,
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [settings, setSettings] = useState({
    resultsEnabled: true,
    examName: 'Annual Examination',
    session: '2024-25'
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sData, mData, sSettings] = await Promise.all([
        db.students.getAll(),
        db.marks.getAll(),
        db.settings.get()
      ]);
      setStudents(sData);
      setMarks(mData);
      setSettings(prev => ({ ...prev, ...sSettings }));
    } catch (error: any) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = async (studentData: Partial<Student>) => {
    const stream = getStreamForClassSection(studentData.class_name!, studentData.section!);
    const newStudent = {
      ...studentData,
      id: crypto.randomUUID(),
      stream,
      created_at: new Date().toISOString()
    };
    const created = await db.students.create(newStudent);
    setStudents(prev => [...prev, created]);
    return created;
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await db.settings.update(key, value);
      setSettings(prev => ({
        ...prev,
        [key]: value === 'true' ? true : value === 'false' ? false : value
      }));
    } catch (e: any) {
      alert(`Setting Error: ${e.message}`);
    }
  };

  const handleLogout = () => setAuthState({ user: null, role: null, profile: null });

  const handleDeleteAllMarks = async () => {
    if (confirm("DANGER: This will permanently delete ALL marks for ALL students. Continue?")) {
      try {
        setLoading(true);
        await db.marks.deleteAll();
        await fetchData(); // Hard refresh from server
        alert("Success: All marks have been deleted.");
      } catch (e: any) {
        alert("Action Failed: " + e.message + "\n\nTip: Ensure Supabase RLS policies allow DELETE operations.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading SVM Portal...</p>
        </div>
      </div>
    );
  }

  if (!authState.role) {
    return (
      <Auth 
        onLogin={(role, profile) => setAuthState({ user: profile, role, profile })}
        onRegister={handleRegister}
        students={students}
      />
    );
  }

  return (
    <Layout user={authState.profile} role={authState.role} onLogout={handleLogout} schoolName="SVM Rambagh Basti">
      {authState.role === 'ADMIN' && (
        <AdminDashboard 
          resultsEnabled={settings.resultsEnabled}
          onUpdateSetting={handleUpdateSetting}
          examName={settings.examName}
          session={settings.session}
          studentCount={students.length}
          onFactoryReset={() => { localStorage.clear(); window.location.reload(); }}
          onDeleteAllMarks={handleDeleteAllMarks}
        />
      )}
      {authState.role === 'TEACHER' && (
        <TeacherDashboard 
          students={students}
          marks={marks}
          setMarks={setMarks}
          setStudents={setStudents}
          refreshData={fetchData}
        />
      )}
      {authState.role === 'STUDENT' && (
        <StudentDashboard 
          student={authState.profile}
          marks={marks.filter(m => m.student_id === authState.profile.id)}
          resultsEnabled={settings.resultsEnabled}
          examName={settings.examName}
          session={settings.session}
        />
      )}
    </Layout>
  );
};

export default App;