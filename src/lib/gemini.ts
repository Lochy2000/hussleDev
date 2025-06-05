import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateResponse(prompt: string, context: string[] = []) {
  try {
    const chat = geminiModel.startChat({
      history: context.map(msg => ({
        role: msg.startsWith("User: ") ? "user" : "model",
        parts: msg.replace(/^(User: |Assistant: )/, ""),
      })),
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

export async function generateHustleIdea(prompt: string) {
  try {
    const result = await geminiModel.generateContent(`
      As an AI expert in developer side hustles, provide detailed advice for the following request:
      ${prompt}
      
      Format your response with:
      1. A clear, actionable recommendation
      2. Technical implementation details
      3. Monetization strategy
      4. Time and resource requirements
      5. Potential challenges and solutions
    `);
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating hustle idea:', error);
    throw error;
  }
}