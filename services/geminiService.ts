
import { GoogleGenAI } from "@google/genai";
import { Job } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCareerAdvice = async (userPrompt: string, availableJobs: Job[]) => {
  const jobsContext = availableJobs.map(j => `${j.title} at ${j.company} (${j.type} in ${j.category})`).join(', ');
  
  const systemInstruction = `
    You are an expert Career Coach for all professions in Sri Lanka.
    Your goal is to help students and fresh graduates across all domains including Medicine, Banking, Education, Engineering, Tourism, and Tech.
    You have access to these current listings: ${jobsContext}.
    Provide encouraging, practical advice based on the Sri Lankan job market trends. 
    Suggest specific opportunities from the list if they match the user's field.
    Use clear, concise bullet points.
    If the user asks in Sinhala or Singlish, reply in a relatable mix of English and Sinhala (Singlish), maintaining a professional yet friendly tone.
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
