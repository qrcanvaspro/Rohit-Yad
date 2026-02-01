import React, { useState, useEffect } from 'react';
import { Role, Student, Mark, AuthState, TeacherMapping } from './types';
import { getStreamForClassSection } from './constants';
import Auth from './components/Auth';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { db } from './supabase';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'portal'>('landing');
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
    session: '2024-25',
    teacherMappings: {} as TeacherMapping
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
      
      let teacherMappings = {};
      try {
        if (sSettings.teacherMappings) {
          teacherMappings = typeof sSettings.teacherMappings === 'string' 
            ? JSON.parse(sSettings.teacherMappings) 
            : sSettings.teacherMappings;
        }
      } catch (e) {
        console.error("Mapping Parse Error", e);
      }

      setSettings(prev => ({ 
        ...prev, 
        ...sSettings,
        teacherMappings
      }));
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

  const handleUpdateMappings = async (mappings: TeacherMapping) => {
    const jsonStr = JSON.stringify(mappings);
    await handleUpdateSetting('teacherMappings', jsonStr);
    setSettings(prev => ({ ...prev, teacherMappings: mappings }));
  };

  const handleLogout = () => {
    setAuthState({ user: null, role: null, profile: null });
    setView('landing');
  };

  const handleDeleteAllMarks = async () => {
    if (confirm("DANGER: This will permanently delete ALL marks for ALL students. Continue?")) {
      try {
        setLoading(true);
        await db.marks.deleteAll();
        await fetchData(); 
        alert("Success: All marks have been deleted.");
      } catch (e: any) {
        alert("Action Failed: " + e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-[6px] border-white/10 border-t-orange-500 rounded-full animate-spin mb-6 shadow-2xl"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Initializing Secure Portal</p>
        </div>
      </div>
    );
  }

  // Start with Landing Page
  if (view === 'landing' && !authState.role) {
    return <HomePage onEnterPortal={() => setView('portal')} />;
  }

  if (!authState.role) {
    return (
      <Auth 
        onLogin={(role, profile) => setAuthState({ user: profile, role, profile })}
        onRegister={handleRegister}
        students={students}
        onBack={() => setView('landing')}
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
          teacherMappings={settings.teacherMappings}
          onUpdateMappings={handleUpdateMappings}
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
          teacherMappings={settings.teacherMappings}
        />
      )}
    </Layout>
  );
};

export default App;