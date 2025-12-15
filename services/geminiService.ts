import { GoogleGenAI, Type } from "@google/genai";
import { FlashcardData, MathProblem } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_TEXT = 'gemini-2.5-flash';
const MODEL_VISION = 'gemini-2.5-flash';

export const generateChineseLesson = async (): Promise<FlashcardData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: "Generate 3 simple Chinese vocabulary words suitable for a 7-year-old. Topics: Animals, Food, or Nature. Return in strict JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: "The Chinese character(s)" },
              pronunciation: { type: Type.STRING, description: "Pinyin with tone marks" },
              translation: { type: Type.STRING, description: "English meaning" },
              exampleSentence: { type: Type.STRING, description: "A very simple example sentence in Chinese" },
              emoji: { type: Type.STRING, description: "A relevant emoji for the word" }
            },
            required: ["word", "pronunciation", "translation", "exampleSentence", "emoji"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as FlashcardData[];
  } catch (error) {
    console.error("Error generating Chinese lesson:", error);
    return [];
  }
};

export const generateEnglishLesson = async (): Promise<FlashcardData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: "Generate 3 simple English vocabulary words suitable for a 7-year-old ESL learner. Topics: School, Family, or Colors. Return in strict JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: "The English word" },
              pronunciation: { type: Type.STRING, description: "Simple phonetic guide" },
              translation: { type: Type.STRING, description: "Chinese translation (Simplified)" },
              exampleSentence: { type: Type.STRING, description: "A simple example sentence in English" },
              emoji: { type: Type.STRING, description: "A relevant emoji" }
            },
            required: ["word", "pronunciation", "translation", "exampleSentence", "emoji"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as FlashcardData[];
  } catch (error) {
    console.error("Error generating English lesson:", error);
    return [];
  }
};

export const generateMathQuiz = async (): Promise<MathProblem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: "Generate 3 basic math word problems or equations (addition/subtraction within 20) for a 6-8 year old. Include multiple choice options. Return in strict JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.INTEGER } },
              correctAnswer: { type: Type.INTEGER }
            },
            required: ["id", "question", "options", "correctAnswer"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as MathProblem[];
  } catch (error) {
    console.error("Error generating Math quiz:", error);
    return [];
  }
};

export const analyzeDrawing = async (base64Image: string): Promise<string> => {
  try {
    // base64Image comes in as 'data:image/png;base64,...' we need to strip the prefix if using inlineData directly sometimes,
    // but the SDK usually handles raw base64. Let's clean it to be safe.
    const base64Data = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: MODEL_VISION,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Data
            }
          },
          {
            text: "You are a kind kindergarten teacher. Look at this drawing by a 7-year-old. 1. Guess what it is. 2. Give a very short, encouraging compliment (max 2 sentences)."
          }
        ]
      }
    });

    return response.text || "Great drawing!";
  } catch (error) {
    console.error("Error analyzing drawing:", error);
    return "That looks amazing! Keep up the good work!";
  }
};
