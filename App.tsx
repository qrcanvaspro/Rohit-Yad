
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

const PortalLoader: React.FC<{ message?: string; progress?: number; type?: 'initial' | 'result' }> = ({ 
  message = "Establishing Secure Connection", 
  progress,
  type = 'initial'
}) => (
  <div className="fixed inset-0 z-[200] bg-red-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
    <div className="absolute w-[800px] h-[800px] bg-amber-500/5 rounded-full animate-pulse pointer-events-none"></div>
    
    <div className="relative mb-12 animate-pulse-gold">
      <div className="w-24 h-24 saffron-gradient rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.2)] rotate-12 transition-transform duration-1000">
        <svg className="w-12 h-12 text-white -rotate-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.848l.788.338v3.623a1 1 0 00.187.585L5.432 14.5a1 1 0 00.828.416h7.48a1 1 0 00.828-.416l1.843-2.279a1 1 0 00.187-.585V8.013l.788-.338a1 1 0 000-1.848l-7-3z"></path>
        </svg>
      </div>
      <div className="absolute -inset-6 border-2 border-dashed border-amber-500/20 rounded-[3rem] animate-spin-slow" style={{ animationDuration: '12s' }}></div>
      <div className="absolute -inset-10 border border-amber-500/10 rounded-[4rem] animate-spin-slow" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
    </div>

    <div className="space-y-4 max-w-xs w-full">
      <h2 className="text-white font-black text-2xl uppercase tracking-[0.3em]">{type === 'initial' ? 'SVM Portal' : 'Accessing Vault'}</h2>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
        <div 
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-700 ease-out shadow-[0_0_10px_#fbbf24]" 
          style={{ width: progress !== undefined ? `${progress}%` : '70%' }}
        ></div>
        <div className="absolute inset-0 shimmer opacity-20"></div>
      </div>
      <p className="text-amber-200/40 text-[10px] uppercase font-black tracking-[0.5em] animate-pulse">
        {message}
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'portal'>('landing');
  const [authState, setAuthState] = useState<AuthState>({ user: null, role: null, profile: null });
  const [isOpeningResult, setIsOpeningResult] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Establishing Secure Connection");
  const [loadingProgress, setLoadingProgress] = useState(10);

  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [settings, setSettings] = useState({
    resultsEnabled: true,
    registrationEnabled: false,
    examName: 'Annual Examination',
    session: '2024-25',
    teacherMappings: {} as TeacherMapping
  });
  
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoadingMsg("Connecting to Cloud Server");
    setLoadingProgress(20);
    try {
      const [sData, mData, sSettings] = await Promise.all([
        db.students.getAll(),
        db.marks.getAll(),
        db.settings.get()
      ]);
      
      setLoadingProgress(60);
      setStudents(sData || []);
      setMarks(mData || []);
      
      let teacherMappings = {};
      if (sSettings && sSettings.teacherMappings) {
        teacherMappings = typeof sSettings.teacherMappings === 'string' 
          ? JSON.parse(sSettings.teacherMappings) 
          : sSettings.teacherMappings;
      }

      setSettings(prev => ({ 
        ...prev, 
        ...sSettings,
        teacherMappings: teacherMappings || {},
        registrationEnabled: sSettings.registrationEnabled ?? false
      }));
      
      setLoadingProgress(100);
      setLoadingMsg("Sync Complete");
    } catch (error) {
      console.error("Data fetch error", error);
      setLoadingMsg("Offline Mode Enabled");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogin = (role: Role, profile: any) => {
    setIsOpeningResult(true);
    setLoadingMsg("Authenticating Identity");
    setLoadingProgress(20);
    
    setTimeout(() => { setLoadingMsg("Opening Secure Digital Vault"); setLoadingProgress(50); }, 600);
    setTimeout(() => { setLoadingMsg("Decrypting Academic Records"); setLoadingProgress(80); }, 1200);
    setTimeout(() => { setLoadingMsg("Compiling Official Marksheet"); setLoadingProgress(95); }, 1800);
    
    setTimeout(() => {
      setAuthState({ user: profile, role, profile });
      setIsOpeningResult(false);
    }, 2400);
  };

  const handleRegister = async (studentData: Partial<Student>) => {
    const stream = getStreamForClassSection(studentData.class_name!, studentData.section!);
    const newStudent = {
      ...studentData,
      id: crypto.randomUUID(),
      stream,
      created_at: new Date().toISOString()
    } as Student;
    
    const savedStudent = await db.students.create(newStudent);
    setStudents(prev => [...prev.filter(s => s.roll_no !== newStudent.roll_no), savedStudent]);
    return savedStudent;
  };

  const handleUpdateSetting = async (key: string, value: string) => {
    await db.settings.update(key, value);
    setSettings(prev => ({
      ...prev,
      [key]: value === 'true' ? true : value === 'false' ? false : value
    }));
  };

  const handleUpdateMappings = async (mappings: TeacherMapping) => {
    await db.settings.update('teacherMappings', JSON.stringify(mappings));
    setSettings(prev => ({ ...prev, teacherMappings: mappings }));
  };

  const handleLogout = () => {
    setAuthState({ user: null, role: null, profile: null });
    setView('landing');
  };

  const handleDeleteAllMarks = async () => {
    if (confirm("Permanently wipe all marks from cloud and local?")) {
      await db.marks.deleteAll();
      setMarks([]);
      alert("System wiped successfully.");
    }
  };

  if (loading) {
    return <PortalLoader message={loadingMsg} progress={loadingProgress} type="initial" />;
  }

  if (isOpeningResult) {
    return <PortalLoader message={loadingMsg} progress={loadingProgress} type="result" />;
  }

  if (view === 'landing' && !authState.role) {
    return <HomePage onEnterPortal={() => setView('portal')} />;
  }

  if (!authState.role) {
    return (
      <Auth 
        onLogin={handleLogin}
        onRegister={handleRegister}
        students={students}
        onBack={() => setView('landing')}
        registrationEnabled={settings.registrationEnabled}
      />
    );
  }

  return (
    <Layout user={authState.profile} role={authState.role} onLogout={handleLogout} schoolName="SVM Rambagh Basti">
      <div className="reveal-anim">
        {authState.role === 'ADMIN' && (
          <AdminDashboard 
            resultsEnabled={settings.resultsEnabled}
            registrationEnabled={settings.registrationEnabled}
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
            setMarks={() => {}} 
            setStudents={() => {}} 
            refreshData={fetchData}
            onRegisterStudent={handleRegister}
          />
        )}
        {authState.role === 'STUDENT' && (
          <div className="relative">
            <StudentDashboard 
              student={authState.profile}
              marks={marks.filter(m => m.student_id === authState.profile.id)}
              resultsEnabled={settings.resultsEnabled}
              examName={settings.examName}
              session={settings.session}
              teacherMappings={settings.teacherMappings}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
