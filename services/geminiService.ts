
import { GoogleGenAI } from "@google/genai";
import { Mark, Student } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudentPerformanceAnalysis = async (student: Student, marks: Mark[]) => {
  const marksSummary = marks.map(m => `${m.subject}: ${m.marks_obtained}/${m.max_marks}`).join(', ');
  const prompt = `
    Student Name: ${student.name}
    Class: ${student.class_name} ${student.section}
    Stream: ${student.stream}
    Marks: ${marksSummary}
    
    Please provide a concise analysis of this student's academic performance. 
    Highlight strengths, areas for improvement, and provide a motivational closing remark.
    Keep it professional and encouraging for a school context.
    Max 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to generate analysis at this time.";
  }
};
