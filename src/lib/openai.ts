import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const openai = apiKey 
  ? new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage in Vite
    })
  : null;

export const isAIEnabled = !!apiKey;
