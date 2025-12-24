
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zpfuzexzvdxeqxtdwqzv.supabase.co";
const SUPABASE_KEY = "sb_publishable_fF7R-U8rcDZZ8X3qDq9Ozw_NOlM6-jP";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const db = {
  students: {
    async getAll() {
      const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error("Fetch Error:", error.message);
        return JSON.parse(localStorage.getItem('svm_students') || '[]');
      }
      localStorage.setItem('svm_students', JSON.stringify(data));
      return data || [];
    },
    async create(student: any) {
      const { data, error } = await supabase.from('students').insert([student]).select();
      if (error) throw error;
      return data[0];
    },
    async delete(id: string) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
    }
  },
  marks: {
    async getAll() {
      const { data, error } = await supabase.from('marks').select('*');
      if (error) return JSON.parse(localStorage.getItem('svm_marks') || '[]');
      localStorage.setItem('svm_marks', JSON.stringify(data));
      return data || [];
    },
    async upsert(marks: any[]) {
      const { error } = await supabase.from('marks').upsert(marks, { onConflict: 'student_id,subject' });
      if (error) throw error;
    },
    async deleteByStudent(studentId: string) {
      const { error } = await supabase.from('marks').delete().eq('student_id', studentId);
      if (error) throw error;
    },
    async deleteAll() {
      const { error } = await supabase.from('marks').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      if (error) throw error;
    }
  },
  settings: {
    async get() {
      const { data, error } = await supabase.from('settings').select('*');
      if (error || !data) return { resultsEnabled: true, examName: 'Annual Examination', session: '2024-25' };
      const settingsMap = data.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value === 'true' ? true : curr.value === 'false' ? false : curr.value;
        return acc;
      }, {});
      return settingsMap;
    },
    async update(key: string, value: string) {
      const { error } = await supabase.from('settings').upsert({ key, value });
      if (error) throw error;
    }
  }
};
