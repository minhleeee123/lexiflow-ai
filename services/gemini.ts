import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WordData, ReadingSessionData } from '../types';

const apiKey = process.env.API_KEY || '';

// We reuse a single instance if possible, or create on demand to ensure we catch env vars
const getAI = () => new GoogleGenAI({ apiKey });

// ---------------------------------------------------------
// AGENT 1: Vocabulary Processing
// ---------------------------------------------------------

export const processVocabularyList = async (rawInput: string): Promise<WordData[]> => {
  const ai = getAI();
  const modelId = 'gemini-3-flash-preview';

  // Schema for strict JSON output
  const wordSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      word: { type: Type.STRING },
      ipa: { type: Type.STRING },
      pos: { type: Type.STRING },
      definition: { type: Type.STRING },
      example: { type: Type.STRING },
    },
    required: ['word', 'ipa', 'pos', 'definition', 'example'],
  };

  const listSchema: Schema = {
    type: Type.ARRAY,
    items: wordSchema,
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Process the following list of English vocabulary words. For each word, provide the IPA pronunciation, part of speech, a clear definition in Vietnamese (Tiếng Việt), and an example sentence in English.
      
      Input words: ${rawInput}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: listSchema,
        systemInstruction: "You are an expert lexicographer. Provide definitions in Vietnamese. Ensure definitions are concise. Example sentences must be in English.",
      },
    });

    const text = response.text;
    if (!text) return [];

    const rawData = JSON.parse(text);
    // Add IDs locally
    return rawData.map((w: any) => ({
      ...w,
      id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }));
  } catch (error) {
    console.error("Error processing vocabulary:", error);
    throw new Error("Failed to process vocabulary. Please check your API key and try again.");
  }
};

// ---------------------------------------------------------
// AGENT 2: Reading Generation
// ---------------------------------------------------------

export const generateReadingSession = async (
  words: WordData[],
  level: string
): Promise<ReadingSessionData> => {
  const ai = getAI();
  const modelId = 'gemini-3-flash-preview';

  const targetWords = words.map((w) => w.word).join(', ');

  const readingSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content: { type: Type.STRING, description: "The story content with target words wrapped in double curly braces, e.g., {{word}}." },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
          },
          required: ['question', 'options', 'correctAnswerIndex']
        }
      }
    },
    required: ['title', 'content', 'questions']
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Write a short, engaging reading passage (approx 150-200 words) at CEFR level ${level}.
      
      You MUST include the following target words in the story: ${targetWords}.
      
      IMPORTANT: When you use a target word in the text, wrap it in double curly braces like this: {{targetWord}}.
      
      After the story, provide 3 multiple-choice reading comprehension questions based on the text.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: readingSchema,
        systemInstruction: "You are an English teacher creating reading materials. The story should be coherent and natural, not just a list of sentences.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as ReadingSessionData;
  } catch (error) {
    console.error("Error generating reading:", error);
    throw new Error("Failed to generate reading session.");
  }
};