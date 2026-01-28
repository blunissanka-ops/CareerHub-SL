
import { GoogleGenAI } from "@google/genai";
import { Job } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCareerAdvice = async (userPrompt: string, availableJobs: Job[]) => {
  const jobsContext = availableJobs.map(j => `${j.title} at ${j.company} (${j.type})`).join(', ');
  
  const systemInstruction = `
    You are an expert Career Coach specifically for Sri Lankan students and fresh graduates.
    Your goal is to help them navigate the job market.
    You have access to these current listings: ${jobsContext}.
    Provide encouraging, practical advice. Suggest specific jobs from the list if they match the user's interests or skills.
    Use clear, concise bullet points where appropriate.
    If the user asks in Sinhala or Singlish, you can reply in a mix of English and Sinhala (Singlish) to be more relatable, but maintain professionalism.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text || "I'm having trouble thinking right now. Please try again!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI coach is currently offline. Please check your connection.";
  }
};
