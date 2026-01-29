
import { GoogleGenAI, Type } from "@google/genai";
import { AppState } from "../types";

export const getAIFeedback = async (state: AppState) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare a concise summary for AI
  const recentLogs = state.logs.slice(-7);
  const completionRate = state.tasks.length > 0 ? state.tasks.filter(t => t.completed).length / state.tasks.length : 0;
  
  const prompt = `
    Act as a "Productivity Scientist" and "Life Mentor". 
    Analyze the following data for an 18-year-old student prepping for SSC and Olympiads:
    
    Data:
    - Recent Moods: ${recentLogs.map(l => l.mood).join(', ')}
    - Recent Focus Scores: ${recentLogs.map(l => l.focusScore).join(', ')}
    // Fix: deepWorkHours property was renamed/moved to studyTimeSeconds in types.ts
    - Average Study Time: ${recentLogs.reduce((acc, l) => acc + (l.studyTimeSeconds / 3600), 0) / (recentLogs.length || 1)}h
    - Task Completion Rate: ${Math.round(completionRate * 100)}%
    
    Provide a "Brutally Honest" weekly summary and actionable patterns detected. 
    Focus on correlation between mood, weight, and focus.
    Format your response as a simple JSON with 'summary' and 'recommendations' (array).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['summary', 'recommendations']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Feedback error:", error);
    return { 
      summary: "I'm unable to analyze your data right now. Keep pushing.", 
      recommendations: ["Stay consistent with your logs."] 
    };
  }
};
