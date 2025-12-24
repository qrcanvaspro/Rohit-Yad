
export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface Student {
  id: string;
  name: string;
  roll_no: string;
  computer_id: string; // Required for student login
  class_name: string;
  section: string;
  stream: string;
  password?: string;
  created_at?: string;
}

export interface Mark {
  id: string;
  student_id: string;
  subject: string;
  marks_obtained: number;
  max_marks: number;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
}

export interface TeacherMapping {
  [classSectionKey: string]: string; // "9-A": "919876543210"
}

export interface AuthState {
  user: any | null;
  role: Role | null;
  profile: any | null;
}
