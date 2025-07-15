import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, conversation } = body;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",  
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150, // Reduced for shorter responses
      }
    });

    if (!conversation) {
      try {
        const result = await model.generateContent({
          contents: [{
            role: "user",
            parts: [{ 
              text: `You are a professional Software enginering company chatbot. 
              Your responses must be:
              - Under 50 words
              - Professional and direct
              - End with a clear question about what the user needs
              
              Our services:
              - Mobile & Web App Development
              - AI Integration & Custom Solutions
              - Machine Learning Implementation
              - Computer Vision Systems
              - Consulting & Strategy
              
              Start by saying: "Welcome to TopoRapula.dev. How can I assist you with your technology needs today?"` 
            }]
          }]
        });
        
        const response = await result.response;
        const initialMessage = response.text();

        return NextResponse.json({
          message: initialMessage,
          conversation: {
            messages: [{
              role: "model",
              parts: [{ text: initialMessage }]
            }],
            lastResponse: initialMessage
          }
        });
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    }

    try {
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ 
              text: `Important instructions for all responses:
              - Keep responses under 50 words
              - Be direct and professional
              - Focus on our actual services
              - For app development questions, mention our full-stack development team
              - Always end with a follow-up question
              - Never give long lists or technical details unless specifically asked`
            }]
          },
          ...conversation.messages,
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      });

      const response = await result.response;
      const text = response.text();

      const updatedConversation = {
        messages: [
          ...conversation.messages,
          { role: "user", parts: [{ text: message }] },
          { role: "model", parts: [{ text }] }
        ],
        lastResponse: text
      };

      return NextResponse.json({
        message: text,
        conversation: updatedConversation
      });
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}