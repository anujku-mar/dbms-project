import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const question = body.question;

        if (!question) {
            return NextResponse.json(
                { error: "Question is required" },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!,
        });

        const response = await ai.models.generateContent({
            model: "models/gemini-2.5-flash",
            contents: `
                You are Smart Rail AI, an assistant for an Indian Railways project.

                Answer railway-related questions clearly and shortly.

                User Question:
                ${question}
                            `
                        });

                        return NextResponse.json({
                            reply: response.text
                        });

                    } catch (error: any) {
                        console.error(error);

                        return NextResponse.json(
                            {
                                error: "AI request failed"
                            },
                            {
                                status: 500
                            }
                        );
                    }
        }