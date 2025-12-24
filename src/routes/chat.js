import { Router } from "express";
import OpenAI from "openai";
import Message from "../models/Messaje.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * POST /chat
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { messages, conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: "conversationId requerido" });
    }

    const userId = req.user._id;

    // Guardar mensaje usuario
    const userMessage = messages[messages.length - 1];

    await Message.create({
      userId,
      conversationId,
      role: "user",
      content: userMessage.content,
    });

    const inputText = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: inputText,
    });

    // Guardar mensaje bot
    await Message.create({
      userId,
      conversationId,
      role: "bot",
      content: response.output_text,
    });

    res.json({ reply: response.output_text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /chat/history/:conversationId
 */
router.get("/history/:conversationId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      userId: req.user._id,
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
