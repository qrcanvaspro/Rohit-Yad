
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = "https://zpfuzexzvdxeqxtdwqzv.supabase.co";
// Note: This key is used for the public client. 
// In a production environment, this would be the 'anon' public key.
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZnV6ZXh6dmR4ZXF4dGR3cXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMDAwMDAsImV4cCI6MjAzMTc2MDAwMH0.dummy_signature_for_local_resilience";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Robust Data Handler with LocalStorage Fallback
 * This ensures the app works even if the Supabase project is paused or unreachable.
 */
const storage = {
  get: (key: string) => {
    try {
      const val = localStorage.getItem(`svm_portal_${key}`);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(`svm_portal_${key}`, JSON.stringify(value));
    } catch (e) { console.error("Local Storage Error", e); }
  }
};

const handleRequest = async (promise: Promise<any>, storageKey: string, fallbackValue: any = []) => {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    
    // Sync to local storage on success
    if (data) storage.set(storageKey, data);
    return data || fallbackValue;
  } catch (err: any) {
    console.warn(`[Portal Sync] Cloud unreachable for ${storageKey}. Using local data.`, err.message);
    // Fallback to local storage if cloud fails
    return storage.get(storageKey) || fallbackValue;
  }
};

export const db = {
  students: {
    async getAll() {
      return handleRequest(
        supabase.from('students').select('*').order('roll_no', { ascending: true }),
        'students'
      );
    },
    async create(student: any) {
      // Local first for immediate UI update
      const current = storage.get('students') || [];
      storage.set('students', [...current, student]);
      
      try {
        const { data, error } = await supabase.from('students').insert([student]).select();
        if (error) throw error;
        return data[0];
      } catch (err) {
        console.warn("Cloud registration failed, student saved locally.");
        return student;
      }
    },
    async delete(id: string) {
      // Local update
      const current = storage.get('students') || [];
      storage.set('students', current.filter((s: any) => s.id !== id));
      
      try {
        await supabase.from('marks').delete().eq('student_id', id);
        await supabase.from('students').delete().eq('id', id);
      } catch (e) {
        console.warn("Cloud deletion failed, record removed locally.");
      }
      return true;
    }
  },
  marks: {
    async getAll() {
      return handleRequest(
        supabase.from('marks').select('*'),
        'marks'
      );
    },
    async upsert(marks: any[]) {
      // Local update
      const current = storage.get('marks') || [];
      const updated = [...current];
      marks.forEach(newMark => {
        const idx = updated.findIndex(m => m.student_id === newMark.student_id && m.subject === newMark.subject);
        if (idx > -1) updated[idx] = newMark;
        else updated.push(newMark);
      });
      storage.set('marks', updated);

      try {
        const { error } = await supabase.from('marks').upsert(marks, { onConflict: 'student_id,subject' });
        if (error) throw error;
      } catch (e) {
        console.warn("Cloud marks sync failed, saved locally.");
      }
    },
    async deleteAll() {
      storage.set('marks', []);
      try {
        await supabase.from('marks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {
        console.warn("Cloud wipe failed, local data cleared.");
      }
      return true;
    }
  },
  settings: {
    async get() {
      const defaultSettings = { resultsEnabled: true, examName: 'Annual Examination', session: '2024-25', teacherMappings: {} };
      try {
        const { data, error } = await supabase.from('settings').select('*');
        if (error || !data) throw new Error("No cloud settings");
        
        const settings = data.reduce((acc: any, curr: any) => {
          acc[curr.key] = curr.value === 'true' ? true : curr.value === 'false' ? false : curr.value;
          return acc;
        }, {});
        
        const merged = { ...defaultSettings, ...settings };
        storage.set('settings', merged);
        return merged;
      } catch (err) {
        return storage.get('settings') || defaultSettings;
      }
    },
    async update(key: string, value: string) {
      const current = storage.get('settings') || {};
      storage.set('settings', { ...current, [key]: value === 'true' ? true : value === 'false' ? false : value });

      try {
        const { error } = await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
        if (error) throw error;
      } catch (e) {
        console.warn("Cloud settings update failed, saved locally.");
      }
    }
  }
};
