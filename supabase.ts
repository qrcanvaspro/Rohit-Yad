
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zpfuzexzvdxeqxtdwqzv.supabase.co";
const SUPABASE_KEY = "sb_publishable_fF7R-U8rcDZZ8X3qDq9Ozw_NOlM6-jP";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const handleError = (error: any, context: string) => {
  const msg = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
  console.error(`[Supabase Error - ${context}]:`, error);
  
  if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('row-level security')) {
    throw new Error(`${context} failed: ACCESS DENIED. Please run the SQL Policy fix in Supabase Dashboard.`);
  }
  
  throw new Error(`${context} failed: ${msg}`);
};

export const db = {
  students: {
    async getAll() {
      const { data, error } = await supabase.from('students').select('*').order('roll_no', { ascending: true });
      if (error) return handleError(error, "Fetch Students");
      return data || [];
    },
    async create(student: any) {
      const { data, error } = await supabase.from('students').insert([student]).select();
      if (error) return handleError(error, "Student Registration");
      if (!data || data.length === 0) throw new Error("Registration failed: No data returned.");
      return data[0];
    },
    async delete(id: string) {
      await supabase.from('marks').delete().eq('student_id', id);
      const { error: studentError } = await supabase.from('students').delete().eq('id', id);
      if (studentError) return handleError(studentError, "Delete Student Table");
      return true;
    }
  },
  marks: {
    async getAll() {
      const { data, error } = await supabase.from('marks').select('*');
      if (error) return handleError(error, "Fetch Marks");
      return data || [];
    },
    async upsert(marks: any[]) {
      const { error } = await supabase.from('marks').upsert(marks, { onConflict: 'student_id,subject' });
      if (error) return handleError(error, "Save Marks");
    },
    async deleteAll() {
      const { error } = await supabase.from('marks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) return handleError(error, "Wipe All Marks");
      return true;
    }
  },
  settings: {
    async get() {
      const { data, error } = await supabase.from('settings').select('*');
      if (error || !data) return { resultsEnabled: true, examName: 'Annual Examination', session: '2024-25' };
      return data.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value === 'true' ? true : curr.value === 'false' ? false : curr.value;
        return acc;
      }, {});
    },
    async update(key: string, value: string) {
      const { error } = await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
      if (error) return handleError(error, "Update Settings");
    }
  }
};
