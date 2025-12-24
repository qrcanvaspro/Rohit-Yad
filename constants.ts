
export const CLASSES = ['9', '10', '11', '12'];

export const SECTIONS_MAP: Record<string, string[]> = {
  '9': ['A', 'B', 'C', 'D', 'E', 'F'],
  '10': ['A', 'B', 'C', 'D', 'E', 'F'],
  '11': ['A', 'B', 'C', 'D', 'E'],
  '12': ['A', 'B', 'C', 'D', 'E'],
};

export const getStreamForClassSection = (className: string, section: string) => {
  if (['9', '10'].includes(className)) return 'General';
  
  const sec = section.toUpperCase();
  if (['A', 'B'].includes(sec)) return 'Biology';
  if (['C', 'D'].includes(sec)) return 'Maths';
  if (sec === 'E') return 'Commerce';
  
  return 'General';
};

export const SUBJECTS_BY_STREAM: Record<string, string[]> = {
  'General': ['Hindi', 'English', 'Science', 'Maths', 'Social Science', 'Sanskrit'],
  'Biology': ['Hindi', 'English', 'Physics', 'Chemistry', 'Biology'],
  'Maths': ['Hindi', 'English', 'Physics', 'Chemistry', 'Maths'],
  'Commerce': ['Hindi', 'English', 'Accountancy', 'Business Studies', 'Economics']
};