// api/routes/chatbot.ts

import { Router, Request, Response } from 'express';

const router = Router();

// 1. FIX: Use v1beta for tool support + the correct model alias
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_INSTRUCTION = `You are LokVidhi, an expert Indian legal assistant. 
Simplify laws for citizens. Always add a disclaimer: "I am an AI, not a lawyer."`;

router.post('/query', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const payload = {
      contents: [{ parts: [{ text: message }] }],
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      tools: [{ google_search: {} }] 
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", JSON.stringify(data, null, 2));
      res.status(response.status).json({ error: data.error?.message || "API Error" });
      return;
    }

    const candidate = data.candidates?.[0];
    const botReply = candidate?.content?.parts?.[0]?.text || "No response generated.";
    
    // 2. FIX: Updated mapping to handle both new and old metadata structures
    // This prevents the "Cannot read property of undefined" error
    const metadata = candidate?.groundingMetadata;
    const sources = (metadata?.groundingChunks || metadata?.groundingAttributions || [])
      .map((item: any) => ({
        // Support both .web.title/uri and flat .title/uri structures
        title: item.web?.title || item.title || "Legal Source",
        uri: item.web?.uri || item.uri
      }))
      .filter((s: any) => s.uri);

    res.json({ reply: botReply, sources });

  } catch (error) {
    console.error("Chatbot Route Error:", error);
    res.status(500).json({ error: "Failed to process legal query." });
  }
});

export default router;