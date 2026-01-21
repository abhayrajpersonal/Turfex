
import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(req: Request) {
  try {
    if (!ai) {
      // Fallback for demo/dev mode without keys
      return NextResponse.json({ 
        text: "I'm in demo mode. Please configure the server API_KEY to receive real AI responses." 
      });
    }

    const body = await req.json();
    const { prompt, context, model = 'gemini-2.0-flash-lite-preview-02-05', systemInstruction } = body;

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: `${context ? `Context: ${context}\n\n` : ''}${prompt}` }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ text: response.text });

  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
