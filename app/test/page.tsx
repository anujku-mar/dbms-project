import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export default async function showModels() {
  try {
    const models = await ai.models.list();
    const allModels: string[] = [];

    for await (const model of models) {
      allModels.push(model.name ?? "Unknown");
    }

    return allModels;
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}