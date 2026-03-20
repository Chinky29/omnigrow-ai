import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const isAIEnabled = !!apiKey;

export const gemini = isAIEnabled
  ? new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" })
  : null;