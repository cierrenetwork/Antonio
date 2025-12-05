import { GoogleGenAI, Type, Schema } from "@google/genai";
import { QuizQuestion } from "../types";

// Define the schema for the response
const questionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "La domanda del quiz sul Napoli.",
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Una lista di 4 possibili risposte.",
      },
      correctAnswer: {
        type: Type.STRING,
        description: "La risposta corretta (deve corrispondere esattamente a una delle opzioni).",
      },
      explanation: {
        type: Type.STRING,
        description: "Una breve spiegazione o curiosità sulla risposta corretta.",
      },
    },
    required: ["question", "options", "correctAnswer", "explanation"],
  },
};

const fetchBatch = async (ai: GoogleGenAI, difficulty: string, count: number): Promise<QuizQuestion[]> => {
  const prompt = `
    Genera ${count} domande a risposta multipla sul SSC Napoli (Calcio Napoli).
    Target: Community "SpazioNapoli" (Esperti e Tifosi accaniti).
    Difficoltà: ${difficulty.toUpperCase()}.
    
    FONTI UFFICIALI DI RIFERIMENTO: Gazzetta dello Sport, Il Mattino, UEFA.com, Tabellini ufficiali storici.
    
    Istruzioni specifiche per livello ${difficulty}:
    ${difficulty === 'medium' ? 
      '- Focus: Anni 2000-2024. Allenatori, statistiche stagionali, marcatori non ovvi, portieri, record di squadra.' : ''}
    
    ${difficulty === 'hard' ? 
      '- Focus: FORMAZIONI TITOLARI in partite storiche (es. chi giocava terzino in Napoli-Real Madrid dell\'87? Chi era in panchina nella finale di Coppa Italia?).\n' +
      '- Dettagli sui tabellini (minuto del gol, arbitro, sostituzioni).\n' +
      '- Anni \'80, \'90 e notti europee meno recenti.\n' +
      '- Evita domande banali su Maradona, Osimhen o Kvara. Cerca la "chicca" da vero esperto.' : ''}

    Regole:
    1. Le opzioni devono essere 4.
    2. Una sola risposta è corretta al 100% basandosi sui tabellini ufficiali.
    3. Le opzioni errate devono essere plausibili (es. giocatori che erano in rosa in quegli anni).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: questionSchema,
      temperature: 0.7, // Lower temperature for more factual accuracy on lineups
    },
  });

  if (!response.text) return [];
  return JSON.parse(response.text);
};

export const generateFullGameQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });

    // Requesting 20 Medium and 40 Hard.
    // We split the Hard request into two batches of 20 to avoid token limits and ensure higher quality.
    const [mediumBatch, hardBatch1, hardBatch2] = await Promise.all([
      fetchBatch(ai, 'medium', 20),
      fetchBatch(ai, 'hard', 20),
      fetchBatch(ai, 'hard', 20)
    ]);

    // Combine to form 60 questions: 20 Medium -> 40 Hard
    return [...mediumBatch, ...hardBatch1, ...hardBatch2];
  } catch (error) {
    console.error("Error generating full game questions:", error);
    throw error;
  }
};

// Keep the original function for compatibility or smaller tests if needed
export const generateNapoliQuestions = async (
  difficulty: string = "mixed",
  count: number = 5
): Promise<QuizQuestion[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  const ai = new GoogleGenAI({ apiKey });
  return fetchBatch(ai, difficulty, count);
};