
import { createClient } from '@supabase/supabase-js';

// User provided credentials
const SUPABASE_URL = "https://lrryohsmgcaujltllczs.supabase.co";
const SUPABASE_KEY = "sb_publishable_oONIXlpH0i1apUn0bmuOBw_aY47_54P";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

export const db = {
  students: {
    async getAll() {
      const local = storage.get('students') || [];
      try {
        const { data, error } = await supabase.from('students').select('*').order('roll_no');
        if (error) throw error;
        
        storage.set('students', data || []);
        return data || [];
      } catch (err) {
        console.warn("Using local cache", err);
        return local;
      }
    },
    async create(student: any) {
      try {
        const { data, error } = await supabase.from('students').insert([student]).select();
        if (error) throw error;
        
        const current = storage.get('students') || [];
        storage.set('students', [...current, data[0]]);
        return data[0];
      } catch (err) {
        console.error("Cloud insert failed", err);
        const current = storage.get('students') || [];
        storage.set('students', [...current, student]);
        return student;
      }
    },
    async delete(id: string) {
      try {
        const { error } = await supabase.from('students').delete().eq('id', id);
        if (error) throw error;
        
        const current = storage.get('students') || [];
        storage.set('students', current.filter((s: any) => s.id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
      return true;
    }
  },
  marks: {
    async getAll() {
      const local = storage.get('marks') || [];
      try {
        const { data, error } = await supabase.from('marks').select('*');
        if (error) throw error;
        
        storage.set('marks', data || []);
        return data || [];
      } catch {
        return local;
      }
    },
    async upsert(marks: any[]) {
      try {
        const { error } = await supabase.from('marks').upsert(marks, { onConflict: 'student_id,subject' });
        if (error) throw error;
        
        const current = storage.get('marks') || [];
        let updated = [...current];
        marks.forEach(m => {
          const idx = updated.findIndex(um => um.student_id === m.student_id && um.subject === m.subject);
          if (idx > -1) updated[idx] = { ...updated[idx], ...m };
          else updated.push(m);
        });
        storage.set('marks', updated);
      } catch (err) {
        console.error("Marks update failed", err);
      }
    },
    async deleteAll() {
      try {
        const { error } = await supabase.from('marks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) throw error;
        storage.set('marks', []);
      } catch (err) {
        console.error("Clear marks failed", err);
      }
    }
  },
  settings: {
    async get() {
      const defaults = { resultsEnabled: true, examName: 'Annual Examination', session: '2024-25', teacherMappings: {} };
      try {
        const { data, error } = await supabase.from('settings').select('*');
        if (error) throw error;
        
        if (!data || data.length === 0) return storage.get('settings') || defaults;
        
        const s = data.reduce((acc: any, c: any) => {
          acc[c.key] = c.value === 'true' ? true : c.value === 'false' ? false : c.value;
          return acc;
        }, {});
        
        const merged = { ...defaults, ...s };
        storage.set('settings', merged);
        return merged;
      } catch {
        return storage.get('settings') || defaults;
      }
    },
    async update(key: string, value: string) {
      try {
        const { error } = await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
        if (error) throw error;
        
        const current = storage.get('settings') || {};
        storage.set('settings', { ...current, [key]: value === 'true' ? true : value === 'false' ? false : value });
      } catch (err) {
        console.error("Settings update failed", err);
      }
    }
  }
};
