import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
export const geminiPreviewModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

export async function generateHustleIdea(prompt: string) {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating hustle idea:', error);
    throw error;
  }
}

export async function generateResponse(message: string, history: string[]) {
  try {
    // Convert history into a format that Gemini can understand
    const formattedHistory = history.map(msg => ({
      role: msg.startsWith('User: ') ? 'user' : 'model',
      parts: [{ text: msg.replace(/^(User: |Assistant: )/, '') }]
    }));

    // Add the current message
    const chat = geminiModel.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}