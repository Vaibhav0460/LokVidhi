import { Router, Request, Response } from 'express';

const router = Router();

// We use the specific model that supports Google Search Grounding
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';

// The API Key will be injected by the environment or you can paste yours here for testing.
const API_KEY = "AIzaSyBe70_UUHgZy8b9sxMxVm5C1UWD4YbE_uQ"; 

const SYSTEM_INSTRUCTION = `You are LokVidhi, an expert Indian legal literacy assistant. 
Your goal is to simplify complex laws for the average citizen.

GUIDELINES:
1. **Be Accurate:** Base answers on Indian Bare Acts (IPC, CrPC, Contract Act, etc.).
2. **Be Simple:** Avoid heavy legalese. Explain like you are talking to a college student.
3. **Be Safe:** Always add a disclaimer: "I am an AI, not a lawyer. Please consult a professional for serious legal matters."
4. **Context:** If the user asks about specific state laws (like Rent Control), ask them which state they are in if you don't know.
`;

router.post('/query', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Construct the payload for Gemini
    const payload = {
      contents: [{ parts: [{ text: message }] }],
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      // This enables Google Search to fact-check the AI's answers
      tools: [{ google_search: {} }]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text and any source links (grounding)
    const candidate = data.candidates?.[0];
    const botReply = candidate?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    
    // Extract sources if available (Google Search Grounding)
    const sources = candidate?.groundingMetadata?.groundingAttributions?.map((attr: any) => ({
      title: attr.web?.title || "Source",
      uri: attr.web?.uri
    })).filter((s: any) => s.uri);

    res.json({ 
      reply: botReply,
      sources: sources || []
    });

  } catch (error) {
    console.error("Chatbot Route Error:", error);
    res.status(500).json({ error: "Failed to process legal query." });
  }
});

export default router;