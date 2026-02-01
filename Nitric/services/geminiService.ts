import { GoogleGenAI, Modality } from "@google/genai";
import { getInstructions, MODEL_NAME, TTS_MODEL } from "../constants";
import { UserSettings } from "../types";

export class GeminiService {
  constructor() {}

  async sendMessage(
    prompt: string, 
    history: { role: 'user' | 'model', parts: { text: string }[] }[],
    settings: UserSettings,
    isRoot: boolean = false
  ) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const instruction = getInstructions(settings, isRoot);
      
      const safetySettings = isRoot ? [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_CIVIC_INTEGRITY', threshold: 'BLOCK_NONE' }
      ] : undefined;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: instruction,
          tools: [{ googleSearch: {} }],
          temperature: isRoot ? 1.0 : 0.7,
          topP: 0.95,
          topK: 64,
          // Adding a thinking budget in root mode allows the model to process 
          // complex "bypass" logic internally for better results
          thinkingConfig: isRoot ? { thinkingBudget: 4096 } : undefined,
          safetySettings: safetySettings as any
        },
      });

      const text = response.text || "";
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || 'External Resource',
          uri: chunk.web?.uri || ''
        }))
        .filter(link => link.uri !== '');

      return { text, links };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async generateImage(prompt: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let imageUrl = null;
      let text = "";

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          } else if (part.text) {
            text += part.text;
          }
        }
      }

      return { imageUrl, text: text || "Image generation successful." };
    } catch (error) {
      console.error("Image Generation Error:", error);
      throw error;
    }
  }

  async generateSpeech(text: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: TTS_MODEL,
        contents: [{ parts: [{ text: `Say clearly: ${text.slice(0, 500)}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return base64Audio;
    } catch (error) {
      console.error("TTS Error:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
