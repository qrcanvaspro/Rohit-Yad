
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
  const [resultsEnabled, setResultsEnabled] = useState<boolean>(true);
  const [examName, setExamName] = useState<string>('Annual Examination');
  const [session, setSession] = useState<string>('2024-25');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sData, mData, settings] = await Promise.all([
        db.students.getAll(),
        db.marks.getAll(),
        db.settings.get()
      ]);
      
      setStudents(sData);
      setMarks(mData);
      
      if (settings) {
        if (settings.resultsEnabled !== undefined) setResultsEnabled(settings.resultsEnabled);
        if (settings.examName) setExamName(settings.examName);
        if (settings.session) setSession(settings.session);
      }
    } catch (error: any) {
      console.error("Initial Fetch Error:", error.message);
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
    setStudents(prev => [created, ...prev]);
    return created;
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await db.settings.update(key, value);
      if (key === 'resultsEnabled') setResultsEnabled(value === 'true');
      if (key === 'examName') setExamName(value);
      if (key === 'session') setSession(value);
    } catch (e) {
      console.error("Setting update failed", e);
      alert("Failed to save setting to cloud.");
    }
  };

  const handleDeleteAllMarks = async () => {
    if (window.confirm("FATAL WARNING: This will permanently delete ALL marks for ALL students. This cannot be undone. Are you absolutely sure?")) {
      const secondCheck = window.prompt("Type 'DELETE' to confirm complete wipeout:");
      if (secondCheck === 'DELETE') {
        try {
          setLoading(true);
          await db.marks.deleteAll();
          setMarks([]);
          alert("All marks have been successfully wiped from the database.");
        } catch (e) {
          alert("Error deleting marks. Check connection.");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleLogout = () => {
    setAuthState({ user: null, role: null, profile: null });
  };

  const factoryReset = async () => {
    if (window.confirm("This will clear your current local session. The data on cloud remains safe.")) {
      localStorage.clear();
      handleLogout();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Initialising Secure Portal...</p>
      </div>
    );
  }

  const renderContent = () => {
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
      <Layout 
        user={authState.profile} 
        role={authState.role} 
        onLogout={handleLogout}
        schoolName="SVM Rambagh Basti"
      >
        {authState.role === 'ADMIN' && (
          <AdminDashboard 
            resultsEnabled={resultsEnabled}
            onUpdateSetting={handleUpdateSetting}
            examName={examName}
            session={session}
            studentCount={students.length}
            onFactoryReset={factoryReset}
            onDeleteAllMarks={handleDeleteAllMarks}
          />
        )}
        {authState.role === 'TEACHER' && (
          <TeacherDashboard 
            students={students}
            marks={marks}
            setMarks={setMarks}
            setStudents={setStudents}
          />
        )}
        {authState.role === 'STUDENT' && (
          <StudentDashboard 
            student={authState.profile}
            marks={marks.filter(m => m.student_id === authState.profile.id)}
            resultsEnabled={resultsEnabled}
            examName={examName}
            session={session}
          />
        )}
      </Layout>
    );
  };

  return <div className="min-h-screen">{renderContent()}</div>;
};

export default App;
